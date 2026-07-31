import OpenAI from "openai";
import { buildTwinContext } from "@/lib/ai/human-twin-context";
import { buildMemoryContext } from "@/lib/ai/memory-context";
import { getAgentById } from "@/features/ai-agents/data/agents";
import type { HumanTwinScoreSet } from "@/core/human-twin/score-engine";
import type { MemoryRecord } from "@/types/memory";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
  twin?: Partial<HumanTwinScoreSet>;
  memories?: MemoryRecord[];
  agentId?: string;
}

const SAFETY_NOTE =
  "\n\nIf the person expresses intent to harm themselves or others, gently encourage them to reach out to a crisis line or trusted person right away, and keep your tone calm and caring.";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      {
        error:
          "OPENAI_API_KEY is not configured on the server. Add it to your environment variables to enable the AI Companion.",
      },
      { status: 500 }
    );
  }

  try {
    const body: ChatRequestBody = await request.json();

    if (!body.message?.trim()) {
      return Response.json({ error: "Message is required." }, { status: 400 });
    }

    const twinContext = body.twin ? buildTwinContext(body.twin) : null;
    const memoryContext =
      body.memories && body.memories.length > 0 ? buildMemoryContext(body.memories) : null;

    const agent = getAgentById(body.agentId ?? "companion");
    let systemContent = agent.systemPrompt + SAFETY_NOTE;

    if (twinContext) {
      systemContent += `\n\nHere is what you currently know about this person's Human Twin (their live wellbeing snapshot):\n${twinContext}`;
    }

    if (memoryContext) {
      systemContent += `\n\nHere are some recent things this person has journaled or worked on (use this only if relevant, never quote it verbatim):\n${memoryContext}`;
    }

    const history = (body.history ?? []).slice(-10);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: body.message },
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return Response.json(
      { error: "The AI Companion couldn't respond right now. Please try again." },
      { status: 500 }
    );
  }
}
