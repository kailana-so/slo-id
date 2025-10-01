import ErrorResponse from "@/utils/errorResponse";
import { Suggestion } from "@/types/suggestions"
import { buildSystemPrompt, ObsType } from "@/lib/prompts/promptBuilder";


type DSChatResponse = {
  choices?: Array<{ message?: { content?: unknown } }>;
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
    const url =
      process.env.DS_CHAT_HOST ??
      "https://api.deepseek.com/v1/chat/completions";

    const body = {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: buildSystemPrompt(formData.type as ObsType) },
        {
          role: "user",
          content: JSON.stringify(formData),
        },
      ],
      response_format: { type: "json_object" as const },
      stream: false,
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DS_API_KEY!}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
 
    const rawText = await resp.text();
    if (!resp.ok) {
      throw new Error(`DeepSeek ${resp.status}: ${rawText}`);
    }

    const envelope = JSON.parse(rawText) as DSChatResponse;
    const content = envelope.choices?.[0]?.message?.content;

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
