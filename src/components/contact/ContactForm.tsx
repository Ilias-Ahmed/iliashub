import { useTheme } from "@/contexts/ThemeContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Loader, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// haptics removed

import { initEmailJS, sendContactEmail } from "@/utils/emailjs";

// Define schema with Zod
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

// Infer TypeScript type from the schema
type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    initEmailJS();
  }, []);

  useEffect(() => {
    if (status === "success") {
      const timer = window.setTimeout(() => {
        setStatus("idle");
        setStatusMessage(null);
      }, 4000);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [status]);

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      // haptics removed
      setStatus("submitting");
      setStatusMessage(null);

      try {
        await sendContactEmail(data);

        setStatus("success");
        setStatusMessage(
          "Thanks for reaching out. I'll get back to you shortly."
        );

        toast("Message sent successfully!", {
          description: "I'll get back to you as soon as possible.",
        });

        reset();
        setActiveField(null);
      } catch (error) {
        console.error("Error submitting form:", error);

        const message =
          error instanceof Error ? error.message : "Please try again later.";

        setStatus("error");
        setStatusMessage(message);

        toast("Unable to send message", {
          description: message,
        });
      }
    },
    [reset]
  );

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  return (
    <div
      className="p-8 rounded-2xl border theme-transition"

    >
      <h3 className="text-2xl font-bold mb-6">Connect with me</h3>

      {status !== "idle" && status !== "submitting" && statusMessage && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
            status === "success"
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-red-300 bg-red-50 text-red-700"
          }`}
        >
          {status === "success" ? (
            <CheckCircle
              className="mt-0.5 h-4 w-4"
              style={{ color: accentColors.primary }}
            />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4" />
          )}
          <div>
            <p className="font-medium">
              {status === "success" ? "Message sent" : "Unable to send message"}
            </p>
            <p>{statusMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className={`block text-sm font-medium transition-colors duration-200 ${
                activeField === "name" ? "text-current" : "opacity-70"
              }`}
              style={{
                color:
                  activeField === "name" ? accentColors.primary : "inherit",
              }}
            >
              Your Name
            </label>
            <div className="relative">
              <input
                id="name"
                {...register("name", {
                  onBlur: handleBlur,
                })}
                onFocus={() => handleFocus("name")}
                className={`w-full rounded-lg border p-3 focus:outline-none transition-all duration-200 ${
                  errors.name ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(15,23,42,0.04)",
                  borderColor: errors.name
                    ? "#ef4444"
                    : activeField === "name"
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(15,23,42,0.15)",
                }}
                placeholder="Ilias Ahmed"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className={`block text-sm font-medium transition-colors duration-200 ${
                activeField === "email" ? "text-current" : "opacity-70"
              }`}
              style={{
                color:
                  activeField === "email" ? accentColors.primary : "inherit",
              }}
            >
              Your Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                {...register("email", {
                  onBlur: handleBlur,
                })}
                onFocus={() => handleFocus("email")}
                className={`w-full rounded-lg border p-3 focus:outline-none transition-all duration-200 ${
                  errors.email ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(15,23,42,0.04)",
                  borderColor: errors.email
                    ? "#ef4444"
                    : activeField === "email"
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(15,23,42,0.15)",
                }}
                placeholder="mehbub@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="subject"
            className={`block text-sm font-medium transition-colors duration-200 ${
              activeField === "subject" ? "text-current" : "opacity-70"
            }`}
            style={{
              color:
                activeField === "subject" ? accentColors.primary : "inherit",
            }}
          >
            Subject (Optional)
          </label>
          <input
            id="subject"
            {...register("subject", {
              onBlur: handleBlur,
            })}
            onFocus={() => handleFocus("subject")}
            className="w-full rounded-lg border p-3 focus:outline-none transition-all duration-200"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(15,23,42,0.04)",
              borderColor:
                activeField === "subject"
                  ? accentColors.primary
                  : isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(15,23,42,0.15)",
            }}
            placeholder="What is this regarding?"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="message"
            className={`block text-sm font-medium transition-colors duration-200 ${
              activeField === "message" ? "text-current" : "opacity-70"
            }`}
            style={{
              color:
                activeField === "message" ? accentColors.primary : "inherit",
            }}
          >
            Your Message
          </label>
          <div className="relative">
            <textarea
              id="message"
              {...register("message", {
                onBlur: handleBlur,
              })}
              onFocus={() => handleFocus("message")}
              rows={5}
              className={`w-full resize-none rounded-lg border p-3 focus:outline-none transition-all duration-200 ${
                errors.message ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(15,23,42,0.04)",
                borderColor: errors.message
                  ? "#ef4444"
                  : activeField === "message"
                  ? accentColors.primary
                  : isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(15,23,42,0.15)",
              }}
              placeholder="Tell me about your project or inquiry..."
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            background: `linear-gradient(135deg, ${accentColors.primary}, ${accentColors.secondary})`,
            boxShadow: `0 4px 14px ${accentColors.shadow}`,
          }}
        >
          {status === "submitting" ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
