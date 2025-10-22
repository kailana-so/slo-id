import { Router, Request, Response } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import { Suggestion } from '../types/suggestions.js';
import { buildSystemPrompt, ObsType } from '../lib/prompts/promptBuilder.js';

const router = Router();

type AnthropicResponse = {
    content?: Array<{ text?: string }>;
};

function toPayload(raw: unknown): { suggestions: Suggestion[] } {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (
        obj &&
        typeof obj === "object" &&
        Array.isArray((obj as { suggestions?: unknown }).suggestions)
    ) {
        return obj as { suggestions: Suggestion[] };
    }
    return { suggestions: [] };
}

async function tryAnthropic(systemPrompt: string, userMessage: string): Promise<{ suggestions: Suggestion[] } | null> {
    try {
        const url = process.env.CC_HOST!;
        const body = {
            model: process.env.CC_MODEL!,
            max_tokens: 500,
            temperature: 0.5,
            system: systemPrompt,
            messages: [{ role: "user", content: userMessage }],
        };

        const resp = await fetch(url, {
            method: "POST",
            headers: {
                "x-api-key": process.env.CC_API_KEY!,
                "anthropic-version": process.env.CC_VERSION!,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const rawText = await resp.text();
        
        // Check if overloaded
        if (!resp.ok && resp.status === 529) {
            console.log("Anthropic overloaded (529), falling back to DeepSeek");
            return null;
        }
        
        if (!resp.ok) {
            throw new Error(`Anthropic ${resp.status}: ${rawText}`);
        }
        
        const envelope = JSON.parse(rawText) as AnthropicResponse;
        const content = envelope.content?.[0]?.text;
        return toPayload(content);
    } catch (error) {
        console.error("Anthropic error:", error);
        return null;
    }
}

async function tryDeepSeek(systemPrompt: string, userMessage: string): Promise<{ suggestions: Suggestion[] } | null> {
    try {
        const url = process.env.DS_CHAT_HOST ?? "https://api.deepseek.com/v1/chat/completions";
        const body = {
            model: "deepseek-chat",
            max_tokens: 500,
            temperature: 0,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            response_format: { type: "json_object" as const },
        };

        const resp = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.DS_API_KEY!}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const rawText = await resp.text();
        if (!resp.ok) {
            console.error(`DeepSeek ${resp.status}: ${rawText}`);
            return null;
        }
        
        const envelope = JSON.parse(rawText) as { choices?: Array<{ message?: { content?: unknown } }> };
        const content = envelope.choices?.[0]?.message?.content;
        return toPayload(content);
    } catch (error) {
        console.error("DeepSeek error:", error);
        return null;
    }
}

router.post('/', async (req: Request, res: Response) => {
    const formData = req.body;
    try {
        // Filter out metadata fields and only send essential identification data
        // eslint-disable-next-line
        const { id, imageId, createdAt, updatedAt, status, userId, _topGroup, ...allFields } = formData;
         
        console.log('[all fields TS]', allFields);

        
        const systemPrompt = `${buildSystemPrompt(formData.type as ObsType)} 
        \n The user is trying to identify ${_topGroup} of type ${formData.type}.`;
        const userMessage = JSON.stringify(allFields);
        
        console.log('systemPrompt', systemPrompt);
        console.log('userMessage', userMessage);
        // Try DeepSeek first
        let payload = await tryDeepSeek(systemPrompt, userMessage);
        // Fallback to Anthropic if DeepSeek failed
        if (!payload) {
            payload = await tryAnthropic(systemPrompt, userMessage);
        }
        // If both failed, return empty
        if (!payload) {
            return res.status(200).json({ suggestions: [] });
        }

        return res.status(200).json(payload);
    } catch (err) {
        console.log("Suggestions error:", err);
        return ErrorResponse("Failed to fetch suggestion for note", err, 500, res);
    }
});

export default router;
