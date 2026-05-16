import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExamQuestion } from "@/app/(admin)/admin/exams/new/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const EXTRACTION_PROMPT = `You are an expert at extracting exam questions from academic documents.

Analyze this document and extract ALL questions into a structured JSON array.

For each question, determine its type and output ONE of these exact shapes:

1. Multiple Choice (mcq):
{"id":"","kind":"mcq","question":"Full question text","options":["Option A text","Option B text","Option C text","Option D text"],"answer":"The exact text of the correct option"}

2. True/False (true_false):
{"id":"","kind":"true_false","question":"Full statement text","options":["True","False"],"answer":"True or False"}

3. Fill in the blank — text answer (fill_in):
{"id":"","kind":"fill_in","answerType":"text","question":"Full question with ___ for blank","answer":"expected text answer"}

4. Fill in the blank — numeric answer (fill_in):
{"id":"","kind":"fill_in","answerType":"number","question":"Full question text","answer":42.5,"tolerance":0.1}

5. Fill in the blank — numeric range (fill_in):
{"id":"","kind":"fill_in","answerType":"range","question":"Full question text","answerMin":390,"answerMax":410,"answer":"390-410"}

RULES:
- Extract every question you find, in order.
- For MCQ: options must be the full text (not just A, B, C, D labels). The answer must exactly match one of the options strings.
- For True/False: answer must be exactly "True" or "False".
- For numeric fill-in: if the document shows a tolerance (e.g. ±0.1), include it. Otherwise omit the tolerance field.
- For range fill-in: set answerMin and answerMax and set answer to "answerMin-answerMax" as a string.
- If a question has an image/diagram reference, use kind "mcq" and note "[See diagram]" in the question text.
- Do NOT include question numbers in the question text.
- Do NOT add explanations or commentary outside the JSON.
- Respond with ONLY a valid JSON array. No markdown, no backticks, no preamble.`;

function validateQuestion(q: unknown): q is ExamQuestion {
  if (typeof q !== "object" || q === null) return false;
  const obj = q as Record<string, unknown>;
  if (typeof obj.question !== "string" || !obj.question.trim()) return false;

  switch (obj.kind) {
    case "mcq":
    case "pictorial_mcq":
      return (
        Array.isArray(obj.options) &&
        obj.options.length >= 2 &&
        typeof obj.answer === "string" &&
        (obj.options as string[]).includes(obj.answer)
      );
    case "true_false":
      return obj.answer === "True" || obj.answer === "False";
    case "fill_in": {
      if (obj.answerType === "text") return typeof obj.answer === "string";
      if (obj.answerType === "number") return typeof obj.answer === "number";
      if (obj.answerType === "range")
        return (
          typeof obj.answerMin === "number" &&
          typeof obj.answerMax === "number" &&
          obj.answerMin < obj.answerMax
        );
      return false;
    }
    default:
      return false;
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isPDF = file.type === "application/pdf";
    const isJSON =
      file.type === "application/json" || file.name.endsWith(".json");

    if (!isPDF && !isJSON) {
      return NextResponse.json(
        { error: "Only PDF and JSON files are supported" },
        { status: 400 },
      );
    }

    if (isJSON) {
      const text = await file.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON file — could not parse" },
          { status: 400 },
        );
      }

      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const valid = arr.filter(validateQuestion) as ExamQuestion[];

      if (valid.length === 0) {
        return NextResponse.json(
          {
            error:
              "No valid questions found in JSON. Make sure it matches the ExamQuestion schema.",
          },
          { status: 422 },
        );
      }

      return NextResponse.json({
        questions: valid,
        skipped: arr.length - valid.length,
      });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
      { text: EXTRACTION_PROMPT },
    ]);

    const raw = result.response.text().trim();

    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("[extract] Gemini returned non-JSON:", raw.slice(0, 500));
      return NextResponse.json(
        {
          error:
            "AI could not produce structured output from this PDF. Try a cleaner or more structured document.",
        },
        { status: 422 },
      );
    }

    const arr = Array.isArray(parsed) ? parsed : [parsed];
    const valid = arr.filter(validateQuestion) as ExamQuestion[];
    const skipped = arr.length - valid.length;

    if (valid.length === 0) {
      return NextResponse.json(
        {
          error:
            "No valid questions could be extracted. The PDF may not contain recognisable exam questions.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ questions: valid, skipped });
  } catch (error) {
    console.error("[POST /api/exams/extract]", error);
    return NextResponse.json(
      { error: "Extraction failed. Please try again." },
      { status: 500 },
    );
  }
}
