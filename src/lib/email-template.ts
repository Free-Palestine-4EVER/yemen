import type { Application } from "./firebase/types";
import { destinationName, DEGREE_OPTIONS } from "./data";

const degreeLabel: Record<string, string> = {
  bachelor: "Bachelor's degree",
  master: "Master's degree",
  diploma: "Diploma",
  phd: "PhD",
};

/**
 * Builds a professional English draft (subject + body) addressed to the
 * destination embassy (student track) or to employers (job track), summarising
 * the applicant. The admin reviews and edits this before it is ever sent.
 */
export function buildEmailDraft(app: Application) {
  const country = destinationName(app.destination, "en");
  const fullName = `${app.personal.firstName} ${app.personal.lastName}`.trim();
  const degree = degreeLabel[app.education.degree] ?? app.education.degree;
  const langs = app.languages
    .filter((l) => l.language.trim())
    .map((l) => `${l.language} (${l.level})`)
    .join(", ");

  const isStudent = app.track === "student";

  const subject = isStudent
    ? `Student visa enquiry — ${fullName} (Yemen → ${country})`
    : `Qualified candidate from Yemen seeking employment in ${country} — ${fullName}`;

  const intro = isStudent
    ? `Dear Sir or Madam,\n\nI am writing on behalf of ${fullName}, a graduate from Yemen who wishes to continue their studies in ${country}. We would be grateful for your guidance on the student-visa application process and the documents required.`
    : `Dear Sir or Madam,\n\nWe are writing to introduce ${fullName}, a qualified professional from Yemen seeking employment opportunities in ${country}. Please find a summary of their profile below.`;

  const profile = [
    `Full name: ${fullName}`,
    app.personal.dob ? `Date of birth: ${app.personal.dob}` : null,
    `City: ${app.personal.city}`,
    `Passport no.: ${app.passport.number}`,
    app.passport.expiry ? `Passport expiry: ${app.passport.expiry}` : null,
    `Education: ${degree} in ${app.education.field}, ${app.education.institution}${app.education.gradYear ? ` (${app.education.gradYear})` : ""}`,
    !isStudent && !app.experience.none && app.experience.jobTitle
      ? `Experience: ${app.experience.jobTitle}, ${app.experience.years} year(s)${app.experience.employer ? ` at ${app.experience.employer}` : ""}`
      : null,
    !isStudent && app.experience.skills ? `Key skills: ${app.experience.skills}` : null,
    langs ? `Languages: ${langs}` : null,
    `Contact (WhatsApp): ${app.personal.phone}`,
    `Email: ${app.applicantEmail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const outro = isStudent
    ? `\nThe applicant's passport and supporting documents are attached. We would appreciate any information on next steps, required appointments, or additional documentation.\n\nThank you for your time and assistance.\n\nKind regards,\nManfath — on behalf of ${fullName}`
    : `\nThe candidate's CV, passport and supporting documents are attached. We would welcome the opportunity to discuss suitable openings.\n\nThank you for your consideration.\n\nKind regards,\nManfath — on behalf of ${fullName}`;

  const body = `${intro}\n\n--- Applicant profile ---\n${profile}\n${outro}`;

  return { subject, body };
}

export const KNOWN_DEGREES = DEGREE_OPTIONS;
