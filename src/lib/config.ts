/**
 * Business configuration. Edit these values — they are the real-world details
 * your friend gives to applicants. Anything secret (API keys) lives in .env.
 */

export const PAYMENT = {
  /** Bank account number applicants transfer to. */
  accountNumber: "YEMEN828998397139713",
  /** Name on the account / beneficiary shown to applicants. */
  beneficiary: "Manfath — Mohammed",
  bankName: "Yemen Bank",
  currency: "USD",
};

export const CONTACT = {
  whatsapp: "+967000000000",
  email: "hello@manfath.app",
};

/**
 * Emails that get admin access. Add your friend's account email here.
 * (Also enforced server-side via Firestore rules / custom claims for real security.)
 */
export const ADMIN_EMAILS = ["admin@manfath.app"];

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}
