import type { Language } from "../config/navigation";

export type ContactReasonId = "job" | "project" | "other";
export type ContactIconKey = "job" | "data" | "automation" | "other";

type LocalizedText = Record<Language, string>;

export type ConversationTopic = {
  id: ContactIconKey;
  title: LocalizedText;
  description: LocalizedText;
};

export type ContactReason = {
  id: ContactReasonId;
  icon: ContactIconKey;
  label: LocalizedText;
  placeholder: LocalizedText;
};

export const conversationTopics: ConversationTopic[] = [
  {
    id: "job",
    title: { es: "Oportunidades laborales", en: "Job opportunities" },
    description: {
      es: "Roles de análisis de datos y operaciones",
      en: "Data analysis and operations roles"
    }
  },
  {
    id: "data",
    title: { es: "Proyectos de datos y BI", en: "Data and BI projects" },
    description: {
      es: "Indicadores, reportes y tableros",
      en: "KPIs, reports and dashboards"
    }
  },
  {
    id: "automation",
    title: { es: "Automatización y herramientas internas", en: "Automation and internal tools" },
    description: {
      es: "Procesos y herramientas internas",
      en: "Processes and internal tools"
    }
  }
];

export const contactReasons: ContactReason[] = [
  {
    id: "job",
    icon: "job",
    label: { es: "Oportunidad laboral", en: "Job opportunity" },
    placeholder: {
      es: "Contame brevemente sobre el rol, el equipo y la modalidad de trabajo.",
      en: "Tell me briefly about the role, the team and the working arrangement."
    }
  },
  {
    id: "project",
    icon: "data",
    label: { es: "Proyecto", en: "Project" },
    placeholder: {
      es: "Contame qué necesitás resolver, qué información utilizás y cuál sería el resultado esperado.",
      en: "Tell me what you need to solve, what information you use and what outcome you expect."
    }
  },
  {
    id: "other",
    icon: "other",
    label: { es: "Otra consulta", en: "Other inquiry" },
    placeholder: {
      es: "Escribí tu consulta con el contexto necesario.",
      en: "Write your inquiry and include the necessary context."
    }
  }
];

export const contactSectionCopy = {
  es: {
    title: "Contacto",
    subtitle: "¿Tenés una oportunidad laboral, un proyecto o una consulta? Escribime y conversemos.",
    availability: "Disponible para oportunidades y proyectos",
    infoTitle: "Hablemos de datos, procesos o productos digitales",
    infoDescription:
      "Estoy abierto a oportunidades como Analista de Datos y a proyectos donde pueda aportar con análisis, automatización y herramientas internas.",
    topicsTitle: "Podemos conversar sobre",
    directTitle: "Contacto directo",
    emailLabel: "Email",
    phoneLabel: "Teléfono",
    copyEmail: "Copiar email",
    copyPhone: "Copiar teléfono",
    emailCopied: "Email copiado",
    phoneCopied: "Teléfono copiado",
    location: "Buenos Aires, Argentina",
    response: "Respuesta habitual: dentro de 24 horas",
    linkedinLabel: "Abrir LinkedIn de Walter Enzo Wohl",
    githubLabel: "Abrir GitHub de Walter Enzo Wohl",
    formTitle: "Enviame un mensaje",
    formIntro: "Los campos marcados como obligatorios son necesarios para responderte.",
    requiredHint: "Campo obligatorio",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Email",
    emailPlaceholder: "tu@email.com",
    reason: "Motivo del contacto",
    message: "Mensaje",
    messageHelper: "Podés incluir enlaces o información relevante.",
    send: "Enviar mensaje",
    sending: "Enviando…",
    privacy: "Tu información solo será utilizada para responderte.",
    successTitle: "Mensaje enviado correctamente",
    successMessage: "Gracias por contactarme. Te responderé a la brevedad.",
    errorTitle: "No pudimos enviar el mensaje.",
    errorPrefix: "Intentá nuevamente o escribime directamente a",
    emailConfigError: "El formulario no está configurado. Escribime directamente a",
    validation: {
      nameRequired: "Ingresá tu nombre.",
      nameMax: "El nombre no puede superar los 80 caracteres.",
      emailRequired: "Ingresá tu email.",
      emailInvalid: "Ingresá un email válido, por ejemplo nombre@dominio.com.",
      reasonRequired: "Seleccioná un motivo de contacto.",
      messageRequired: "Escribí un mensaje.",
      messageMin: "Contame un poco más: el mensaje debe tener al menos 20 caracteres.",
      messageMax: "El mensaje no puede superar los 1500 caracteres."
    }
  },
  en: {
    title: "Contact",
    subtitle: "Do you have a job opportunity, a project or a question? Write to me and let's talk.",
    availability: "Available for opportunities and projects",
    infoTitle: "Let's talk about data, processes or digital products",
    infoDescription:
      "I am open to Data Analyst opportunities and projects where I can contribute through analysis, automation and internal tools.",
    topicsTitle: "We can talk about",
    directTitle: "Direct contact",
    emailLabel: "Email",
    phoneLabel: "Phone",
    copyEmail: "Copy email",
    copyPhone: "Copy phone",
    emailCopied: "Email copied",
    phoneCopied: "Phone copied",
    location: "Buenos Aires, Argentina",
    response: "Typical response time: within 24 hours",
    linkedinLabel: "Open Walter Enzo Wohl's LinkedIn",
    githubLabel: "Open Walter Enzo Wohl's GitHub",
    formTitle: "Send me a message",
    formIntro: "Fields marked as required are necessary so I can reply.",
    requiredHint: "Required field",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    reason: "Reason for contact",
    message: "Message",
    messageHelper: "You can include links or relevant information.",
    send: "Send message",
    sending: "Sending…",
    privacy: "Your information will only be used to reply to you.",
    successTitle: "Message sent successfully",
    successMessage: "Thank you for contacting me. I will reply shortly.",
    errorTitle: "We couldn't send your message.",
    errorPrefix: "Please try again or email me directly at",
    emailConfigError: "The form is not configured. Please email me directly at",
    validation: {
      nameRequired: "Enter your name.",
      nameMax: "Your name cannot exceed 80 characters.",
      emailRequired: "Enter your email.",
      emailInvalid: "Enter a valid email, for example name@domain.com.",
      reasonRequired: "Select a reason for contact.",
      messageRequired: "Write a message.",
      messageMin: "Please add more detail: the message must contain at least 20 characters.",
      messageMax: "The message cannot exceed 1500 characters."
    }
  }
} as const;
