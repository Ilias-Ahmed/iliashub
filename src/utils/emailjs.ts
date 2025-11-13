import emailjs from "@emailjs/browser";

export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Check if EmailJS is properly configured
export const isEmailJSConfigured = () => {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
};

// Initialize EmailJS with your public key
export const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("EmailJS initialized successfully");
  } else {
    console.error("EmailJS Public Key is missing");
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
  if (!isEmailJSConfigured()) {
    console.error("EmailJS Configuration:", {
      hasServiceId: !!EMAILJS_SERVICE_ID,
      hasTemplateId: !!EMAILJS_TEMPLATE_ID,
      hasPublicKey: !!EMAILJS_PUBLIC_KEY,
    });
    throw new Error("Email service is not configured. Please contact the site administrator.");
  }

  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: name,
        from_email: email,
        subject: subject || "Portfolio Contact Form",
        message,
        to_name: "Ilias Ahmed", // Your name
        reply_to: email,
      },
      EMAILJS_PUBLIC_KEY
    );
    
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw new Error("Failed to send email. Please try again or contact me directly.");
  }
};
