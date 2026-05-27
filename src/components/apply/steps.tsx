"use client";

import { GraduationCap, Briefcase, Plus, X, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { TextField, SelectField, FieldShell } from "@/components/ui/Field";
import { RadioCards } from "@/components/ui/RadioCards";
import { FileDrop } from "@/components/ui/FileDrop";
import { cn } from "@/lib/utils";
import { DEGREE_OPTIONS, LANG_LEVELS, DESTINATIONS, destinationName, type Track } from "@/lib/data";
import type {
  Application,
  Education,
  Experience,
  LanguageEntry,
  Passport,
  Personal,
} from "@/lib/firebase/types";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/dictionary";

export interface StepProps {
  app: Application;
  t: Dictionary;
  locale: Locale;
  errors: Record<string, string>;
  setTrack: (v: Track) => void;
  patchPersonal: (p: Partial<Personal>) => void;
  patchPassport: (p: Partial<Passport>) => void;
  patchEducation: (p: Partial<Education>) => void;
  patchExperience: (p: Partial<Experience>) => void;
  setLanguages: (l: LanguageEntry[]) => void;
  setDestination: (code: string) => void;
  uploadField: (field: "passportFile" | "photoFile", file: File) => void;
  uploading: Record<string, boolean>;
  confirm: boolean;
  setConfirm: (b: boolean) => void;
  goTo: (i: number) => void;
}

function StepHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-navy-950">{title}</h2>
      <p className="mt-1 text-navy-600">{sub}</p>
    </div>
  );
}

/* ---------------------------- 1. Track ---------------------------- */
export function TrackStep({ app, t, setTrack }: StepProps) {
  return (
    <div>
      <StepHeader title={t.form.track.title} sub={t.form.track.sub} />
      <RadioCards
        value={app.track}
        onChange={(v) => setTrack(v as Track)}
        options={[
          { value: "student", title: t.form.track.student, desc: t.form.track.studentDesc, icon: GraduationCap },
          { value: "job", title: t.form.track.job, desc: t.form.track.jobDesc, icon: Briefcase },
        ]}
      />
    </div>
  );
}

/* --------------------------- 2. Personal -------------------------- */
export function PersonalStep({ app, t, errors, patchPersonal }: StepProps) {
  const p = app.personal;
  return (
    <div>
      <StepHeader title={t.form.personal.title} sub={t.form.personal.sub} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="firstName" label={t.form.personal.firstName} value={p.firstName}
          error={errors.firstName} onChange={(e) => patchPersonal({ firstName: e.target.value })} />
        <TextField id="lastName" label={t.form.personal.lastName} value={p.lastName}
          error={errors.lastName} onChange={(e) => patchPersonal({ lastName: e.target.value })} />
        <SelectField id="gender" label={t.form.personal.gender} value={p.gender} error={errors.gender}
          onChange={(e) => patchPersonal({ gender: e.target.value as Personal["gender"] })}>
          <option value="">—</option>
          <option value="male">{t.form.personal.male}</option>
          <option value="female">{t.form.personal.female}</option>
        </SelectField>
        <TextField id="dob" type="date" label={t.form.personal.dob} value={p.dob}
          error={errors.dob} onChange={(e) => patchPersonal({ dob: e.target.value })} />
        <SelectField id="marital" label={t.form.personal.maritalStatus} value={p.maritalStatus}
          onChange={(e) => patchPersonal({ maritalStatus: e.target.value as Personal["maritalStatus"] })}>
          <option value="">—</option>
          <option value="single">{t.form.personal.single}</option>
          <option value="married">{t.form.personal.married}</option>
        </SelectField>
        <TextField id="city" label={t.form.personal.city} value={p.city}
          error={errors.city} onChange={(e) => patchPersonal({ city: e.target.value })} />
        <TextField id="phone" type="tel" label={t.form.personal.phone} hint={t.form.personal.phoneHint}
          value={p.phone} error={errors.phone} className="sm:col-span-2"
          onChange={(e) => patchPersonal({ phone: e.target.value })} placeholder="+967…" />
      </div>
    </div>
  );
}

/* --------------------------- 3. Passport -------------------------- */
export function PassportStep({ app, t, errors, patchPassport, uploadField, uploading }: StepProps) {
  const p = app.passport;
  return (
    <div>
      <StepHeader title={t.form.passport.title} sub={t.form.passport.sub} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="passnum" label={t.form.passport.number} value={p.number}
          error={errors.number} onChange={(e) => patchPassport({ number: e.target.value })} />
        <div className="hidden sm:block" />
        <TextField id="issue" type="date" label={t.form.passport.issue} value={p.issue}
          onChange={(e) => patchPassport({ issue: e.target.value })} />
        <TextField id="expiry" type="date" label={t.form.passport.expiry} value={p.expiry}
          error={errors.expiry} onChange={(e) => patchPassport({ expiry: e.target.value })} />
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <FileDrop label={t.form.passport.upload} hint={t.form.passport.uploadHint} value={p.passportFile}
          uploading={uploading.passportFile} error={errors.passportFile}
          onFile={(f) => uploadField("passportFile", f)} />
        <FileDrop label={t.form.passport.uploadPhoto} hint={t.form.passport.uploadHint} value={p.photoFile}
          uploading={uploading.photoFile} onFile={(f) => uploadField("photoFile", f)} />
      </div>
    </div>
  );
}

/* -------------------------- 4. Education -------------------------- */
export function EducationStep({ app, t, errors, patchEducation }: StepProps) {
  const e = app.education;
  return (
    <div>
      <StepHeader title={t.form.education.title} sub={t.form.education.sub} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="degree" label={t.form.education.degree} value={e.degree} error={errors.degree}
          onChange={(ev) => patchEducation({ degree: ev.target.value })}>
          <option value="">—</option>
          {DEGREE_OPTIONS.map((d) => (
            <option key={d} value={d}>{t.form.education[d as keyof typeof t.form.education] as string}</option>
          ))}
        </SelectField>
        <TextField id="field" label={t.form.education.field} value={e.field} error={errors.field}
          onChange={(ev) => patchEducation({ field: ev.target.value })} />
        <TextField id="institution" label={t.form.education.institution} value={e.institution}
          error={errors.institution} className="sm:col-span-2"
          onChange={(ev) => patchEducation({ institution: ev.target.value })} />
        <TextField id="eduCountry" label={t.form.education.country} value={e.country}
          onChange={(ev) => patchEducation({ country: ev.target.value })} />
        <TextField id="gradYear" label={t.form.education.gradYear} value={e.gradYear} error={errors.gradYear}
          inputMode="numeric" placeholder="2023"
          onChange={(ev) => patchEducation({ gradYear: ev.target.value })} />
        <TextField id="gpa" label={t.form.education.gpa} value={e.gpa} optional hint={t.common.optional}
          onChange={(ev) => patchEducation({ gpa: ev.target.value })} />
      </div>
    </div>
  );
}

/* ------------------------- 5. Experience -------------------------- */
export function ExperienceStep({ app, t, errors, patchExperience }: StepProps) {
  const x = app.experience;
  return (
    <div>
      <StepHeader title={t.form.experience.title} sub={t.form.experience.sub} />

      <label className="mb-5 flex cursor-pointer items-center gap-3 rounded-xl border border-navy-200 bg-white p-4">
        <input type="checkbox" checked={x.none} className="size-5 accent-navy-950"
          onChange={(e) => patchExperience({ none: e.target.checked })} />
        <span className="text-sm font-medium text-navy-800">{t.form.experience.none}</span>
      </label>

      {!x.none && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="jobTitle" label={t.form.experience.jobTitle} value={x.jobTitle} error={errors.jobTitle}
            onChange={(e) => patchExperience({ jobTitle: e.target.value })} />
          <TextField id="years" label={t.form.experience.years} value={x.years} error={errors.years}
            inputMode="numeric" placeholder="3"
            onChange={(e) => patchExperience({ years: e.target.value })} />
          <TextField id="employer" label={t.form.experience.employer} value={x.employer} className="sm:col-span-2"
            onChange={(e) => patchExperience({ employer: e.target.value })} />
          <FieldShell label={t.form.experience.skills} hint={t.form.experience.skillsHint} className="sm:col-span-2">
            <textarea value={x.skills} onChange={(e) => patchExperience({ skills: e.target.value })}
              className="min-h-24 w-full resize-y rounded-xl border border-navy-200 bg-white px-4 py-3 text-[15px] focus:border-azure-500 focus:outline-none focus:ring-4 focus:ring-azure-500/10" />
          </FieldShell>
        </div>
      )}
    </div>
  );
}

/* -------------------------- 6. Languages -------------------------- */
export function LanguagesStep({ app, t, errors, setLanguages }: StepProps) {
  const langs = app.languages;
  const update = (i: number, patch: Partial<LanguageEntry>) =>
    setLanguages(langs.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  return (
    <div>
      <StepHeader title={t.form.languages.title} sub={t.form.languages.sub} />
      <div className="space-y-3">
        {langs.map((l, i) => (
          <div key={i} className="flex items-end gap-3">
            <TextField className="flex-1" label={i === 0 ? t.form.languages.language : undefined}
              placeholder={t.form.languages.placeholder} value={l.language}
              onChange={(e) => update(i, { language: e.target.value })} />
            <SelectField className="w-40" label={i === 0 ? t.form.languages.level : undefined} value={l.level as string}
              onChange={(e) => update(i, { level: e.target.value })}>
              {LANG_LEVELS.map((lv) => (
                <option key={lv} value={lv}>{t.form.languages.levels[lv]}</option>
              ))}
            </SelectField>
            {langs.length > 1 && (
              <button type="button" onClick={() => setLanguages(langs.filter((_, idx) => idx !== i))}
                className="mb-1 grid size-11 place-items-center rounded-xl border border-navy-200 text-navy-500 hover:border-rose-soft hover:text-rose-soft"
                aria-label={t.form.languages.remove}>
                <X className="size-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      {errors.languages && <p className="mt-2 text-xs font-medium text-rose-soft">{errors.languages}</p>}
      <button type="button" onClick={() => setLanguages([...langs, { language: "", level: "intermediate" }])}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-800 hover:border-navy-400">
        <Plus className="size-4" /> {t.form.languages.add}
      </button>
    </div>
  );
}

/* ------------------------- 7. Destination ------------------------- */
export function DestinationStep({ app, t, locale, errors, setDestination }: StepProps) {
  return (
    <div>
      <StepHeader title={t.form.destination.title} sub={t.form.destination.sub} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {DESTINATIONS.map((d) => {
          const active = app.destination === d.code;
          return (
            <motion.button key={d.code} type="button" whileTap={{ scale: 0.97 }}
              onClick={() => setDestination(d.code)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-start transition-all",
                active ? "border-navy-950 bg-navy-950 text-paper shadow-lift" : "border-navy-200 bg-white hover:border-navy-400",
              )}>
              <span className="text-2xl">{d.flag}</span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{d[locale]}</div>
                <div className={cn("truncate text-xs", active ? "text-navy-300" : "text-navy-400")}>{d.hub[locale]}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
      {errors.destination && <p className="mt-3 text-xs font-medium text-rose-soft">{errors.destination}</p>}
    </div>
  );
}

/* --------------------------- 8. Review ---------------------------- */
export function ReviewStep({ app, t, locale, confirm, setConfirm, goTo }: StepProps) {
  const p = app.personal;
  const e = app.education;
  const rows: { label: string; value: string; step: number }[] = [
    { label: t.form.steps.track, value: app.track === "student" ? t.form.track.student : t.form.track.job, step: 0 },
    { label: t.form.personal.firstName, value: `${p.firstName} ${p.lastName}`.trim(), step: 1 },
    { label: t.form.personal.phone, value: p.phone, step: 1 },
    { label: t.form.passport.number, value: app.passport.number, step: 2 },
    { label: t.form.education.degree, value: `${(t.form.education[e.degree as keyof typeof t.form.education] as string) || ""} · ${e.field}`, step: 3 },
    { label: t.form.languages.title, value: app.languages.filter((l) => l.language).map((l) => l.language).join(", "), step: 5 },
    { label: t.form.destination.title, value: destinationName(app.destination, locale), step: 6 },
  ];

  return (
    <div>
      <StepHeader title={t.form.review.title} sub={t.form.review.sub} />
      <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <dt className="text-sm text-navy-500">{r.label}</dt>
            <dd className="flex items-center gap-3 text-end">
              <span className="text-sm font-medium text-navy-900">{r.value || "—"}</span>
              <button type="button" onClick={() => goTo(r.step)}
                className="text-navy-400 hover:text-azure-600" aria-label={t.form.review.edit}>
                <Pencil className="size-3.5" />
              </button>
            </dd>
          </div>
        ))}
      </dl>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-navy-200 bg-white p-4">
        <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)}
          className="mt-0.5 size-5 accent-navy-950" />
        <span className="text-sm font-medium text-navy-800">{t.form.review.confirm}</span>
      </label>
    </div>
  );
}
