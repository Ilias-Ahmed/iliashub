import emailjs from "@emailjs/browser";

export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS with your public key
export const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Sends a portfolio contact email and raises if EmailJS is not configured.
export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}: ContactEmailPayload) => {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error("Email service is not configured.");
  }

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      from_name: name,
      from_email: email,
      subject: subject || "Portfolio Contact Form",
      message,
    },
    EMAILJS_PUBLIC_KEY
  );
};
