import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { publicId, resourceType } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[delete-file]", err);

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
