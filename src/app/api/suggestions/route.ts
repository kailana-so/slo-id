import ErrorResponse from "@/utils/errorResponse";
import { Suggestion } from "@/types/suggestions"
import { buildSystemPrompt, ObsType } from "@/lib/prompts/promptBuilder";

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

export async function POST(req: Request): Promise<Response> {
  const formData = await req.json();

  try {
    const url = process.env.CC_HOST!;

    const systemPrompt = buildSystemPrompt(formData.type as ObsType);
    const userMessage = JSON.stringify(formData);

    const body = {
      model: process.env.CC_MODEL!,
      max_tokens: 400,
      temperature: 0,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
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
    if (!resp.ok) {
      throw new Error(`Anthropic ${resp.status}: ${rawText}`);
    }
    console.log("Anthropic response:", rawText);
    const envelope = JSON.parse(rawText) as AnthropicResponse;
    console.log("Anthropic envelope:", envelope);
    const content = envelope.content?.[0]?.text;
    console.log("Anthropic content:", content);
    const payload = toPayload(content);

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.log("Suggestions error:", err)
    return ErrorResponse("Failed to fetch suggestion for note", err, 500);
  }
}
