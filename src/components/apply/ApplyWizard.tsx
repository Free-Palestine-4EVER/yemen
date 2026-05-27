"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/firebase/auth-context";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { TRACK_FEE, type Track } from "@/lib/data";
import {
  emptyApplication,
  type Application,
  type Education,
  type Experience,
  type LanguageEntry,
  type Passport,
  type Personal,
} from "@/lib/firebase/types";
import {
  getApplication,
  saveApplication,
  uploadFile,
} from "@/lib/firebase/applications";
import {
  TrackStep,
  PersonalStep,
  PassportStep,
  EducationStep,
  ExperienceStep,
  LanguagesStep,
  DestinationStep,
  ReviewStep,
  type StepProps,
} from "./steps";
import { PaymentModal } from "./PaymentModal";

const STEP_KEYS = [
  "track",
  "personal",
  "passport",
  "education",
  "experience",
  "languages",
  "destination",
  "review",
] as const;

const STEP_COMPONENTS = [
  TrackStep,
  PersonalStep,
  PassportStep,
  EducationStep,
  ExperienceStep,
  LanguagesStep,
  DestinationStep,
  ReviewStep,
];

export function ApplyWizard() {
  const { t, locale } = useI18n();
  const { user, ready } = useAuth();
  const router = useRouter();

  const [app, setApp] = useState<Application | null>(null);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const loadedRef = useRef(false);

  // load existing / new application
  useEffect(() => {
    if (!user) return;
    if (loadedRef.current) return;
    loadedRef.current = true;
    (async () => {
      let existing: Application | null = null;
      if (ready) {
        try {
          existing = await getApplication(user.uid);
        } catch {
          existing = null;
        }
      }
      const base =
        existing ??
        emptyApplication(user.uid, user.displayName ?? "", user.email ?? "");
      const preset = typeof window !== "undefined" ? sessionStorage.getItem("manfath.track") : null;
      if (!base.track && (preset === "student" || preset === "job")) base.track = preset;
      setApp(base);
    })();
  }, [user, ready]);

  /* ---- updaters ---- */
  const setTrack = (v: Track) => setApp((a) => (a ? { ...a, track: v } : a));
  const patchPersonal = (p: Partial<Personal>) =>
    setApp((a) => (a ? { ...a, personal: { ...a.personal, ...p } } : a));
  const patchPassport = (p: Partial<Passport>) =>
    setApp((a) => (a ? { ...a, passport: { ...a.passport, ...p } } : a));
  const patchEducation = (p: Partial<Education>) =>
    setApp((a) => (a ? { ...a, education: { ...a.education, ...p } } : a));
  const patchExperience = (p: Partial<Experience>) =>
    setApp((a) => (a ? { ...a, experience: { ...a.experience, ...p } } : a));
  const setLanguages = (l: LanguageEntry[]) => setApp((a) => (a ? { ...a, languages: l } : a));
  const setDestination = (code: string) => setApp((a) => (a ? { ...a, destination: code } : a));

  const uploadFieldFn = useCallback(
    async (field: "passportFile" | "photoFile", file: File) => {
      if (!user || !ready) return;
      setUploading((u) => ({ ...u, [field]: true }));
      try {
        const meta = await uploadFile(user.uid, field === "passportFile" ? "passport" : "photo", file);
        setApp((a) => (a ? { ...a, passport: { ...a.passport, [field]: meta } } : a));
      } catch {
        setErrors((e) => ({ ...e, [field]: t.common.error }));
      } finally {
        setUploading((u) => ({ ...u, [field]: false }));
      }
    },
    [user, ready, t.common.error],
  );

  /* ---- validation ---- */
  const validate = useCallback(
    (a: Application, s: number): Record<string, string> => {
      const e: Record<string, string> = {};
      const req = t.form.errors.required;
      const key = STEP_KEYS[s];
      if (key === "track" && !a.track) e.track = t.form.errors.pickOne;
      if (key === "personal") {
        (["firstName", "lastName", "gender", "dob", "city"] as const).forEach((f) => {
          if (!a.personal[f]) e[f] = req;
        });
        if (!a.personal.phone || a.personal.phone.replace(/\D/g, "").length < 6) e.phone = t.form.errors.phone;
      }
      if (key === "passport") {
        if (!a.passport.number) e.number = req;
        if (!a.passport.expiry) e.expiry = req;
        if (!a.passport.passportFile) e.passportFile = t.form.errors.file;
      }
      if (key === "education") {
        (["degree", "field", "institution", "gradYear"] as const).forEach((f) => {
          if (!a.education[f]) e[f] = req;
        });
      }
      if (key === "experience" && !a.experience.none) {
        if (!a.experience.jobTitle) e.jobTitle = req;
        if (!a.experience.years) e.years = req;
      }
      if (key === "languages" && !a.languages.some((l) => l.language.trim())) {
        e.languages = t.form.errors.required;
      }
      if (key === "destination" && !a.destination) e.destination = t.form.errors.pickOne;
      return e;
    },
    [t],
  );

  const persist = useCallback(
    async (a: Application) => {
      if (!ready) return;
      setSaving(true);
      try {
        await saveApplication(a);
        setSavedAt(Date.now());
      } catch {
        /* offline / not configured — keep local state */
      } finally {
        setSaving(false);
      }
    },
    [ready],
  );

  const goNext = async () => {
    if (!app) return;
    const e = validate(app, step);
    setErrors(e);
    if (Object.keys(e).length) return;
    await persist(app);
    if (step < STEP_KEYS.length - 1) {
      setDir(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    setErrors({});
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const goTo = (i: number) => {
    setErrors({});
    setDir(i > step ? 1 : -1);
    setStep(i);
  };

  const submit = async () => {
    if (!app || !confirm) return;
    const next: Application = {
      ...app,
      status: "payment_pending",
      paymentStatus: "unpaid",
      payment: { ...app.payment, amount: TRACK_FEE[(app.track || "student") as Track] },
      timeline: [
        ...app.timeline.filter((x) => x.status !== "submitted" && x.status !== "payment_pending"),
        { status: "submitted", at: Date.now() },
        { status: "payment_pending", at: Date.now() },
      ],
    };
    setApp(next);
    await persist(next);
    setShowPayment(true);
  };

  const stepProps: StepProps | null = useMemo(() => {
    if (!app) return null;
    return {
      app, t, locale, errors,
      setTrack, patchPersonal, patchPassport, patchEducation, patchExperience,
      setLanguages, setDestination, uploadField: uploadFieldFn, uploading,
      confirm, setConfirm, goTo,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app, t, locale, errors, uploading, confirm]);

  if (!app || !stepProps) {
    return (
      <div className="grid place-items-center py-32">
        <Loader2 className="size-7 animate-spin text-navy-300" />
      </div>
    );
  }

  const StepComp = STEP_COMPONENTS[step];
  const progress = ((step + 1) / STEP_KEYS.length) * 100;
  const isLast = step === STEP_KEYS.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 lg:py-14">
      {/* progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-navy-700">
            {t.form.steps[STEP_KEYS[step]]}
          </span>
          <span className="text-navy-400">
            {`${step + 1} / ${STEP_KEYS.length}`}
            {saving ? ` · ${t.form.saving}` : savedAt ? ` · ${t.form.saved}` : ""}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-navy-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-navy-700 to-gold-500"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        {/* step pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {STEP_KEYS.map((k, i) => (
            <button
              key={k}
              onClick={() => i <= step && goTo(i)}
              disabled={i > step}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                i === step
                  ? "bg-navy-950 text-paper"
                  : i < step
                    ? "bg-navy-100 text-navy-700 hover:bg-navy-200"
                    : "text-navy-300",
              )}
            >
              {t.form.steps[k]}
            </button>
          ))}
        </div>
      </div>

      {/* animated step */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepComp {...stepProps} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* nav */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
        <Button variant="ghost" onClick={goBack} disabled={step === 0} className={step === 0 ? "invisible" : ""}>
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {t.form.back}
        </Button>

        {isLast ? (
          <Button variant="gold" size="lg" onClick={submit} disabled={!confirm || saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            {t.form.review.submit}
            <Check className="size-4" />
          </Button>
        ) : (
          <Button size="lg" onClick={goNext} disabled={saving}>
            {t.form.next}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            app={app}
            onClose={() => router.push("/dashboard")}
            onSubmitted={(updated) => {
              setApp(updated);
              router.push("/dashboard");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
