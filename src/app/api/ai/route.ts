import { NextResponse } from "next/server";

type Message = {
  role: "user" | "ai";
  content: string;
  imageUrl?: string;
};

const SYSTEM_PROMPT = `
You are JudeAI, a smart and friendly academic study assistant
built by CHEESA Tratech. You help students understand exam questions,
explain concepts clearly, and answer follow-up questions.
Format responses using clean markdown.

Rules:
- Use short paragraphs
- Use bullet points where helpful
- Use **bold** for key concepts
- Use headings sparingly
- Avoid giant walls of text
- Keep explanations concise but readable
- Never output raw HTML
`.trim();

// OPTION 1 — Anthropic Claude
// Install: npm install @anthropic-ai/sdk
// Env var:  ANTHROPIC_API_KEY
// import Anthropic from "@anthropic-ai/sdk";
//
// async function getClaudeResponse(messages: Message[]): Promise<string> {
//   const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
//
//   const response = await client.messages.create({
//     model: "claude-opus-4-5",
//     max_tokens: 1024,
//     system: SYSTEM_PROMPT,
//     messages: messages.map((m) => ({
//       role: m.role === "ai" ? "assistant" : "user",
//       content: m.content,
//     })),
//   });
//
//   const block = response.content[0];
//   return block.type === "text" ? block.text : "No response generated.";
// }

// OPTION 2 — OpenAI GPT
// Install: npm install openai
// Env var:  OPENAI_API_KEY
// import OpenAI from "openai";
//
// async function getOpenAIResponse(messages: Message[]): Promise<string> {
//   const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//
//   const response = await client.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       { role: "system", content: SYSTEM_PROMPT },
//       ...messages.map((m) => ({
//         role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
//         content: m.content,
//       })),
//     ],
//   });
//
//   return response.choices[0]?.message?.content ?? "No response generated.";
// }

// OPTION 3 — Google Gemini
// Install: npm install @google/generative-ai
// Env var:  GEMINI_API_KEY
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

async function getGeminiResponse(messages: Message[]): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const priorMessages = messages.slice(0, -1);
  const firstUserIndex = priorMessages.findIndex((m) => m.role === "user");
  const trimmedHistory =
    firstUserIndex === -1 ? [] : priorMessages.slice(firstUserIndex);

  const history = trimmedHistory.map((m) => ({
    role: m.role === "ai" ? "model" : "user",
    parts: [{ text: m.content }] as Part[],
  }));

  const chat = model.startChat({ history });
  const lastMessage = messages[messages.length - 1];
  let parts: Part[];

  if (lastMessage.imageUrl) {
    const res = await fetch(lastMessage.imageUrl.split("?")[0]);
    const buffer = await res.arrayBuffer();

    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = "image/jpeg";

    parts = [
      { text: lastMessage.content },
      {
        inlineData: {
          data: base64,
          mimeType,
        },
      },
    ];
  } else {
    parts = [{ text: lastMessage.content }];
  }

  const result = await chat.sendMessage(parts);

  return result.response.text() ?? "No response generated.";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: Message[] = body?.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json(
        { error: "No user message found" },
        { status: 400 },
      );
    }

    //   const response = await getClaudeResponse(messages);
    //   const response = await getOpenAIResponse(messages);
    const response = await getGeminiResponse(messages);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
