export function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{
  url: string;
  publicId: string;
  size: number;
  fileName: string;
  resourceType: string;
}> {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      reject(new Error("Cloudinary environment variables are not set."));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "chemeng-materials");

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status !== 200) {
        reject(new Error("Upload failed. File too large....."));
        return;
      }

      const data = JSON.parse(xhr.responseText);

      resolve({
        url: data.secure_url,
        publicId: data.public_id,
        size: data.bytes,
        fileName: file.name,
        resourceType: data.resource_type,
      });
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    xhr.send(formData);
  });
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
