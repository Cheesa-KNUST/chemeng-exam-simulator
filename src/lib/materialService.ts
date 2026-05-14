import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  Unsubscribe,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type FileType = "pdf" | "doc" | "ppt" | "image" | "video";
export type MaterialStatus = "approved" | "pending" | "rejected";

export type Material = {
  id: string;
  title: string;
  description: string;
  course: string;
  semester: string;
  year: string;
  tags: string[];
  fileType: FileType;
  fileUrl: string;
  fileName: string;
  publicId: string;
  status: MaterialStatus;
  uploadedBy: string;
  uploaderName: string;
  uploadedAt: Timestamp | null;
  downloadCount: number;
  size: number;
  resourceType: string;
};

export type MaterialInput = Omit<
  Material,
  "id" | "uploadedAt" | "downloadCount"
>;

export function listenToAllMaterials(
  callback: (materials: Material[]) => void,
): Unsubscribe {
  const q = query(collection(db, "materials"), orderBy("uploadedAt", "desc"));

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Material, "id">),
      })),
    );
  });
}

export function listenToApprovedMaterials(
  callback: (materials: Material[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, "materials"),
    where("status", "==", "approved"),
    orderBy("uploadedAt", "desc"),
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Material, "id">),
      })),
    );
  });
}

export async function addMaterial(input: MaterialInput): Promise<string> {
  const ref = await addDoc(collection(db, "materials"), {
    ...input,
    uploadedAt: Timestamp.now(),
    downloadCount: 0,
  });
  return ref.id;
}

export async function updateMaterial(
  id: string,
  updates: Partial<Omit<Material, "id">>,
): Promise<void> {
  await updateDoc(doc(db, "materials", id), updates);
}

export async function setMaterialStatus(
  id: string,
  status: MaterialStatus,
): Promise<void> {
  await updateDoc(doc(db, "materials", id), { status });
}

export async function deleteMaterial(id: string): Promise<void> {
  await deleteDoc(doc(db, "materials", id));
}

export async function incrementDownload(id: string): Promise<void> {
  await updateDoc(doc(db, "materials", id), {
    downloadCount: increment(1),
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileTypeFromMime(file: File): FileType {
  const { type, name } = file;
  if (type === "application/pdf") return "pdf";
  if (type.includes("word") || name.endsWith(".docx") || name.endsWith(".doc"))
    return "doc";
  if (
    type.includes("presentation") ||
    name.endsWith(".pptx") ||
    name.endsWith(".ppt")
  )
    return "ppt";
  if (type.startsWith("image/")) return "image";
  return "pdf";
}
