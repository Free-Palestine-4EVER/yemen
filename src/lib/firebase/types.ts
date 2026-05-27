import type { Track } from "../data";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "payment_pending"
  | "payment_review"
  | "payment_verified"
  | "sent"
  | "response";

export type PaymentStatus = "unpaid" | "pending" | "verified" | "rejected";

export interface UploadedFile {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface LanguageEntry {
  language: string;
  level: (typeof import("../data"))["LANG_LEVELS"][number] | string;
}

export interface AppResponse {
  id: string;
  type: "embassy" | "job";
  message: string;
  at: number;
}

export interface TimelineEntry {
  status: ApplicationStatus;
  at: number;
  note?: string;
}

export interface Personal {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "";
  dob: string;
  maritalStatus: "single" | "married" | "";
  city: string;
  phone: string;
}

export interface Passport {
  number: string;
  issue: string;
  expiry: string;
  passportFile?: UploadedFile;
  photoFile?: UploadedFile;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  country: string;
  gradYear: string;
  gpa: string;
}

export interface Experience {
  none: boolean;
  jobTitle: string;
  years: string;
  employer: string;
  skills: string;
}

export interface PaymentInfo {
  amount: number;
  proofFile?: UploadedFile;
  submittedAt?: number;
  verifiedAt?: number;
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
  sentAt?: number;
}

export interface Application {
  uid: string;
  applicantName: string;
  applicantEmail: string;
  track: Track | "";
  status: ApplicationStatus;
  paymentStatus: PaymentStatus;
  personal: Personal;
  passport: Passport;
  education: Education;
  experience: Experience;
  languages: LanguageEntry[];
  destination: string;
  payment: PaymentInfo;
  email?: EmailDraft;
  responses: AppResponse[];
  timeline: TimelineEntry[];
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  createdAt: number;
}

export function emptyApplication(
  uid: string,
  name: string,
  email: string,
): Application {
  const now = Date.now();
  return {
    uid,
    applicantName: name,
    applicantEmail: email,
    track: "",
    status: "draft",
    paymentStatus: "unpaid",
    personal: {
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      maritalStatus: "",
      city: "",
      phone: "",
    },
    passport: { number: "", issue: "", expiry: "" },
    education: { degree: "", field: "", institution: "", country: "", gradYear: "", gpa: "" },
    experience: { none: false, jobTitle: "", years: "", employer: "", skills: "" },
    languages: [{ language: "", level: "intermediate" }],
    destination: "",
    payment: { amount: 0 },
    responses: [],
    timeline: [{ status: "draft", at: now }],
    createdAt: now,
    updatedAt: now,
  };
}
