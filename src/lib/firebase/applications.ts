import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "./client";
import type {
  Application,
  ApplicationStatus,
  AppResponse,
  PaymentStatus,
  TimelineEntry,
  UploadedFile,
} from "./types";
import { uid as genId } from "../utils";

const COL = "applications";

export async function getApplication(uid: string): Promise<Application | null> {
  const snap = await getDoc(doc(db, COL, uid));
  return snap.exists() ? (snap.data() as Application) : null;
}

export function subscribeApplication(
  uid: string,
  cb: (app: Application | null) => void,
) {
  return onSnapshot(
    doc(db, COL, uid),
    (snap) => cb(snap.exists() ? (snap.data() as Application) : null),
    // Resolve to "no data" on error (e.g. Firestore not yet created / offline)
    // so the UI stops loading instead of spinning forever.
    () => cb(null),
  );
}

export function subscribeAllApplications(cb: (apps: Application[]) => void) {
  const q = query(collection(db, COL), orderBy("updatedAt", "desc"));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => d.data() as Application)),
    () => cb([]),
  );
}

export async function listApplications(): Promise<Application[]> {
  const q = query(collection(db, COL), orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Application);
}

export async function saveApplication(app: Application): Promise<void> {
  await setDoc(
    doc(db, COL, app.uid),
    { ...app, updatedAt: Date.now() },
    { merge: true },
  );
}

/** Uploads a file to Storage and returns its metadata + download URL. */
export async function uploadFile(
  uid: string,
  category: "passport" | "photo" | "payment",
  file: File,
): Promise<UploadedFile> {
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `applications/${uid}/${category}/${Date.now()}_${safeName}`;
  const r = storageRef(storage, path);
  await uploadBytes(r, file, { contentType: file.type });
  const url = await getDownloadURL(r);
  return { name: file.name, url, path, size: file.size, type: file.type };
}

export async function pushTimeline(
  uid: string,
  status: ApplicationStatus,
  note?: string,
) {
  const entry: TimelineEntry = { status, at: Date.now(), ...(note ? { note } : {}) };
  await updateDoc(doc(db, COL, uid), {
    status,
    timeline: arrayUnion(entry),
    updatedAt: Date.now(),
  });
}

export async function setPaymentStatus(
  uid: string,
  paymentStatus: PaymentStatus,
  status?: ApplicationStatus,
) {
  const patch: Record<string, unknown> = { paymentStatus, updatedAt: Date.now() };
  if (status) patch.status = status;
  if (paymentStatus === "verified") patch["payment.verifiedAt"] = Date.now();
  await updateDoc(doc(db, COL, uid), patch);
  if (status) await pushTimeline(uid, status);
}

export async function addResponse(
  uid: string,
  type: AppResponse["type"],
  message: string,
) {
  const response: AppResponse = { id: genId("res"), type, message, at: Date.now() };
  await updateDoc(doc(db, COL, uid), {
    responses: arrayUnion(response),
    status: "response",
    updatedAt: Date.now(),
  });
  await pushTimeline(uid, "response", type === "embassy" ? "Embassy reply" : "Job lead");
}

export async function saveEmailDraft(
  uid: string,
  email: { to: string; subject: string; body: string; sentAt?: number },
) {
  await updateDoc(doc(db, COL, uid), { email, updatedAt: Date.now() });
}
