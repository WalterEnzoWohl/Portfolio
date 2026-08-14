import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import emailjs from "@emailjs/browser";
import { MotionConfig, motion, type Variants } from "motion/react";
import { useForm, type FieldErrors } from "react-hook-form";
import {
  TbBriefcase2,
  TbBrandGithub,
  TbBrandLinkedin,
  TbCheck,
  TbClock,
  TbCopy,
  TbFolder,
  TbMail,
  TbMapPin,
  TbMessageCircle,
  TbPhone,
  TbRobot,
  TbSend,
  TbShieldCheck
} from "react-icons/tb";
import type { Language } from "../config/navigation";
import {
  contactReasons,
  contactSectionCopy,
  conversationTopics,
  type ContactIconKey,
  type ContactReasonId,
  type ConversationTopic
} from "../data/contact";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type CopiedField = "email" | "phone" | null;
type SubmitState = "idle" | "success" | "error" | "configuration-error";

type ContactFormValues = {
  name: string;
  email: string;
  reason: ContactReasonId;
  message: string;
  website: string;
};

const CONTACT_EMAIL = "walterenzowohl@gmail.com";
const CONTACT_PHONE = "+54 11 4141 9407";
const CONTACT_PHONE_HREF = "+541141419407";
const LINKEDIN_URL = "https://www.linkedin.com/in/walterenzowohl";
const GITHUB_URL = "https://github.com/WalterEnzoWohl";
const easeOut = [0.22, 1, 0.36, 1] as const;

const topicIcons: Record<ContactIconKey, IconComponent> = {
  job: TbBriefcase2,
  data: TbFolder,
  automation: TbRobot,
  other: TbMessageCircle
};

const pageReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: easeOut } }
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay, ease: easeOut }
  })
};

const topicContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.13, staggerChildren: 0.075 } }
};

const topicReveal: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: easeOut } }
};

async function writeToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = value;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.opacity = "0";
  document.body.appendChild(temporaryInput);
  temporaryInput.select();
  document.execCommand("copy");
  temporaryInput.remove();
}

function ConversationTopicItem({ topic, language }: { topic: ConversationTopic; language: Language }) {
  const Icon = topicIcons[topic.id];

  return (
    <motion.li className="contact-conversation-topic" variants={topicReveal}>
      <span className="contact-conversation-icon" aria-hidden="true"><Icon /></span>
      <span>
        <strong>{topic.title[language]}</strong>
        <small>{topic.description[language]}</small>
      </span>
    </motion.li>
  );
}

type ContactMethodProps = {
  label: string;
  value: string;
  href: string;
  copyLabel: string;
  copied: boolean;
  icon: IconComponent;
  onCopy: () => void;
};

function ContactMethod({ label, value, href, copyLabel, copied, icon: Icon, onCopy }: ContactMethodProps) {
  return (
    <div className={`contact-method${copied ? " is-copied" : ""}`}>
      <span className="contact-method-icon" aria-hidden="true"><Icon /></span>
      <a href={href} className="contact-method-value" aria-label={`${label}: ${value}`}>
        <small>{label}</small>
        <strong>{value}</strong>
      </a>
      <button type="button" className="contact-copy-button" onClick={onCopy} aria-label={copyLabel} title={copyLabel}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.84 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.16 }}
          aria-hidden="true"
        >
          {copied ? <TbCheck /> : <TbCopy />}
        </motion.span>
      </button>
    </div>
  );
}

function ContactInfoCard({ language }: { language: Language }) {
  const copy = contactSectionCopy[language];
  const [copiedField, setCopiedField] = useState<CopiedField>(null);
  const clearCopiedTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (clearCopiedTimer.current) window.clearTimeout(clearCopiedTimer.current);
  }, []);

  const copyContact = async (field: Exclude<CopiedField, null>, value: string) => {
    try {
      await writeToClipboard(value);
      setCopiedField(field);
      if (clearCopiedTimer.current) window.clearTimeout(clearCopiedTimer.current);
      clearCopiedTimer.current = window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(null);
    }
  };

  return (
    <motion.article className="contact-info-card" variants={cardReveal} custom={0.04}>
      <motion.span
        className="contact-info-line"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.52, ease: easeOut, delay: 0.08 }}
        aria-hidden="true"
      />

      <div className="contact-info-content">
        <h3>{copy.infoTitle}</h3>
        <p className="contact-info-intro">{copy.infoDescription}</p>

        <section className="contact-info-group" aria-labelledby="contact-topics-title">
          <h4 id="contact-topics-title">{copy.topicsTitle}</h4>
          <motion.ul className="contact-conversation-list" variants={topicContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}>
            {conversationTopics.map((topic) => <ConversationTopicItem key={topic.id} topic={topic} language={language} />)}
          </motion.ul>
        </section>

        <section className="contact-info-group" aria-labelledby="contact-direct-title">
          <h4 id="contact-direct-title">{copy.directTitle}</h4>
          <div className="contact-methods">
            <ContactMethod
              label={copy.emailLabel}
              value={CONTACT_EMAIL}
              href={`mailto:${CONTACT_EMAIL}`}
              copyLabel={copy.copyEmail}
              copied={copiedField === "email"}
              icon={TbMail}
              onCopy={() => void copyContact("email", CONTACT_EMAIL)}
            />
            <ContactMethod
              label={copy.phoneLabel}
              value={CONTACT_PHONE}
              href={`tel:${CONTACT_PHONE_HREF}`}
              copyLabel={copy.copyPhone}
              copied={copiedField === "phone"}
              icon={TbPhone}
              onCopy={() => void copyContact("phone", CONTACT_PHONE)}
            />
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {copiedField === "email" ? copy.emailCopied : copiedField === "phone" ? copy.phoneCopied : ""}
          </p>
        </section>

        <div className="contact-professional-links">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label={copy.linkedinLabel}>
            <TbBrandLinkedin aria-hidden="true" /><span>LinkedIn</span>
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label={copy.githubLabel}>
            <TbBrandGithub aria-hidden="true" /><span>GitHub</span>
          </a>
        </div>
      </div>

      <footer className="contact-info-footer">
        <span><TbMapPin aria-hidden="true" />{copy.location}</span>
        <span><TbClock aria-hidden="true" />{copy.response}</span>
      </footer>
    </motion.article>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p className="contact-field-error" id={id} role="alert">{message}</p> : null;
}

function SubmitStatus({ state, language }: { state: SubmitState; language: Language }) {
  const copy = contactSectionCopy[language];

  if (state === "idle") return null;

  const isSuccess = state === "success";
  return (
    <motion.div
      className={`contact-submit-status ${isSuccess ? "is-success" : "is-error"}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
    >
      {isSuccess ? <TbCheck aria-hidden="true" /> : <TbMessageCircle aria-hidden="true" />}
      <span>
        <strong>{isSuccess ? copy.successTitle : copy.errorTitle}</strong>
        {isSuccess ? (
          <small>{copy.successMessage}</small>
        ) : (
          <small>
            {state === "configuration-error" ? copy.emailConfigError : copy.errorPrefix}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </small>
        )}
      </span>
    </motion.div>
  );
}

function ContactReasonSelector({
  language,
  register,
  selectedReason,
  error
}: {
  language: Language;
  register: ReturnType<typeof useForm<ContactFormValues>>["register"];
  selectedReason: ContactReasonId;
  error?: string;
}) {
  const copy = contactSectionCopy[language];

  return (
    <fieldset className="contact-reason-fieldset" aria-describedby={error ? "contact-reason-error" : undefined}>
      <legend>{copy.reason} <span aria-hidden="true">*</span><span className="sr-only"> ({copy.requiredHint})</span></legend>
      <div className="contact-reason-grid">
        {contactReasons.map((reason) => {
          const Icon = topicIcons[reason.icon];
          const isSelected = selectedReason === reason.id;
          return (
            <label className={`contact-reason-option${isSelected ? " is-selected" : ""}`} key={reason.id}>
              <input type="radio" value={reason.id} {...register("reason", { required: copy.validation.reasonRequired })} />
              <Icon aria-hidden="true" />
              <span>{reason.label[language]}</span>
            </label>
          );
        })}
      </div>
      <FieldError id="contact-reason-error" message={error} />
    </fieldset>
  );
}

function ContactForm({ language }: { language: Language }) {
  const copy = contactSectionCopy[language];
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const initialReason = contactReasons[0].id;
  const initialPlaceholder = contactReasons[0].placeholder[language];
  const [messagePlaceholder, setMessagePlaceholder] = useState(initialPlaceholder);
  const [placeholderFading, setPlaceholderFading] = useState(false);
  const successTimer = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    mode: "onBlur",
    defaultValues: { name: "", email: "", reason: initialReason, message: "", website: "" }
  });

  const selectedReason = watch("reason") || initialReason;

  useEffect(() => () => {
    if (successTimer.current) window.clearTimeout(successTimer.current);
  }, []);

  useEffect(() => {
    const nextPlaceholder = contactReasons.find((reason) => reason.id === selectedReason)?.placeholder[language] ?? initialPlaceholder;
    setPlaceholderFading(true);
    const timer = window.setTimeout(() => {
      setMessagePlaceholder(nextPlaceholder);
      setPlaceholderFading(false);
    }, 90);
    return () => window.clearTimeout(timer);
  }, [initialPlaceholder, language, selectedReason]);

  const sendMessage = async (values: ContactFormValues) => {
    setSubmitState("idle");

    if (values.website) {
      reset({ name: "", email: "", reason: initialReason, message: "", website: "" });
      setSubmitState("success");
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setSubmitState("configuration-error");
      return;
    }

    const selectedReasonCopy = contactReasons.find((reason) => reason.id === values.reason)?.label[language] ?? values.reason;

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: values.name.trim(),
          email: values.email.trim(),
          phonenumber: "",
          title: selectedReasonCopy,
          reason: selectedReasonCopy,
          message: values.message.trim()
        },
        { publicKey }
      );
      reset({ name: "", email: "", reason: initialReason, message: "", website: "" });
      setSubmitState("success");
      if (successTimer.current) window.clearTimeout(successTimer.current);
      successTimer.current = window.setTimeout(() => setSubmitState("idle"), 9000);
    } catch {
      setSubmitState("error");
    }
  };

  const focusFirstError = (formErrors: FieldErrors<ContactFormValues>) => {
    const firstInvalidField = (["name", "email", "reason", "message"] as const).find((field) => Boolean(formErrors[field]));
    if (firstInvalidField) setFocus(firstInvalidField);
  };

  return (
    <motion.article className="contact-form-card" variants={cardReveal} custom={0.14}>
      <header>
        <h3>{copy.formTitle}</h3>
        <p>{copy.formIntro}</p>
      </header>

      <form onSubmit={handleSubmit(sendMessage, focusFirstError)} noValidate>
        <div className="contact-form-row">
          <div className="contact-form-field">
            <label htmlFor="contact-name">{copy.name} <span aria-hidden="true">*</span><span className="sr-only"> ({copy.requiredHint})</span></label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              placeholder={copy.namePlaceholder}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              {...register("name", {
                required: copy.validation.nameRequired,
                maxLength: { value: 80, message: copy.validation.nameMax }
              })}
            />
            <FieldError id="contact-name-error" message={errors.name?.message} />
          </div>

          <div className="contact-form-field">
            <label htmlFor="contact-email">{copy.email} <span aria-hidden="true">*</span><span className="sr-only"> ({copy.requiredHint})</span></label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              {...register("email", {
                required: copy.validation.emailRequired,
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: copy.validation.emailInvalid }
              })}
            />
            <FieldError id="contact-email-error" message={errors.email?.message} />
          </div>
        </div>

        <ContactReasonSelector
          language={language}
          register={register}
          selectedReason={selectedReason}
          error={errors.reason?.message}
        />

        <div className="contact-form-field contact-message-field">
          <label htmlFor="contact-message">{copy.message} <span aria-hidden="true">*</span><span className="sr-only"> ({copy.requiredHint})</span></label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder={messagePlaceholder}
            className={placeholderFading ? "is-placeholder-fading" : undefined}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={`contact-message-helper${errors.message ? " contact-message-error" : ""}`}
            {...register("message", {
              required: copy.validation.messageRequired,
              minLength: { value: 20, message: copy.validation.messageMin },
              maxLength: { value: 1500, message: copy.validation.messageMax }
            })}
          />
          <small className="contact-field-helper" id="contact-message-helper">{copy.messageHelper}</small>
          <FieldError id="contact-message-error" message={errors.message?.message} />
        </div>

        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <button className={`contact-submit-button${submitState === "success" ? " is-success" : submitState === "error" ? " is-error" : ""}`} type="submit" disabled={isSubmitting}>
          <span className="contact-submit-button-content">
            {isSubmitting ? <span className="contact-submit-spinner" aria-hidden="true" /> : submitState === "success" ? <TbCheck aria-hidden="true" /> : <TbSend aria-hidden="true" />}
            <span>{isSubmitting ? copy.sending : submitState === "success" ? copy.successTitle : copy.send}</span>
          </span>
        </button>

        <p className="contact-privacy-note"><TbShieldCheck aria-hidden="true" />{copy.privacy}</p>
        <SubmitStatus state={submitState} language={language} />
      </form>
    </motion.article>
  );
}

function ContactSection({ language }: { language: Language }) {
  const copy = contactSectionCopy[language];

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id="contacto"
        className="contact-dashboard-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
      >
        <div className="contact-dashboard-shell">
          <motion.header className="contact-dashboard-header" variants={pageReveal}>
            <h2>{copy.title}</h2>
            <p>{copy.subtitle}</p>
            <span className="contact-availability"><i aria-hidden="true" />{copy.availability}</span>
          </motion.header>

          <motion.div className="contact-dashboard-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }}>
            <ContactInfoCard language={language} />
            <ContactForm language={language} />
          </motion.div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}

export default ContactSection;
