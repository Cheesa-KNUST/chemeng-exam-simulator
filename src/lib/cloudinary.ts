export async function uploadToCloudinary(file: File): Promise<{
  url: string;
  publicId: string;
  size: number;
  fileName: string;
  resourceType: string;
}> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are not set.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "chemeng-materials");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "Cloudinary upload failed.");
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    size: data.bytes,
    fileName: file.name,
    resourceType: data.resource_type,
  };
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: string,
): Promise<void> {
  const res = await fetch("/api/materials/delete-file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId, resourceType }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to delete file from Cloudinary.");
  }
}
