import {
  NextResponse,
} from "next/server";

import {
  openai,
} from "@/lib/openai/openai";

export async function POST(
  req: Request
) {

  const body =
    await req.json();

  const response =
    await openai.chat.completions.create({

      model:
        "gpt-5",

      messages: [

        {
          role: "system",

          content: `
You are TIIF Human Twin AI.

Provide coaching,
reflection,
identity insights,
purpose guidance,
wellbeing recommendations.
`,
        },

        {
          role: "user",

          content:
            body.message,
        },

      ],

    });

  return NextResponse.json({

    message:
      response.choices[0]
        .message.content,

  });
}