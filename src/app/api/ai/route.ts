import { NextResponse } from "next/server";

type Message = {
  role: "user" | "ai";
  content: string;
};

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

    const userPrompt = lastMessage.content;

    // Replace this later with OpenAI / Claude / Gemini API

    const fakeResponse = generateMockResponse(userPrompt);

    return NextResponse.json({
      success: true,
      response: fakeResponse,
    });
  } catch (error) {
    console.error("AI Route Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Temporary AI logic (replace later with real model)
 */
function generateMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes("bernoulli")) {
    return "Bernoulli's equation describes the conservation of energy in flowing fluids: pressure + kinetic energy + potential energy remains constant along a streamline.";
  }

  if (lower.includes("heat transfer")) {
    return "Heat transfer occurs via conduction, convection, and radiation. Each mechanism describes how thermal energy moves between systems.";
  }

  if (lower.includes("reaction")) {
    return "Chemical reactions involve rearrangement of atoms, following conservation of mass and energy principles.";
  }

  return `I understand you're asking about: "${prompt}".\n\nThis is a placeholder response. Your AI backend will generate a detailed academic explanation here.`;
}
