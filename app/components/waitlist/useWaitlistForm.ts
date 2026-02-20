import { useState } from "react";
import { FormData, FormErrors, waitlistSchema } from "./types";

export function useWaitlistForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    social: "",
    type: "customer",
    province: "",
    city: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const validateStep = (currentStep: number): boolean => {
    try {
      if (currentStep === 1) {
        waitlistSchema.pick({ name: true, email: true, phone: true }).parse({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
      } else if (currentStep === 2) {
        waitlistSchema.pick({ type: true, social: true }).parse({
          type: formData.type,
          social: formData.social,
        });
      } else if (currentStep === 3) {
        waitlistSchema.pick({ province: true, city: true }).parse({
          province: formData.province,
          city: formData.city,
        });
      }
      setErrors({});
      return true;
    } catch (error: any) {
      if (error && error.formErrors && error.formErrors.fieldErrors) {
        const formattedErrors: FormErrors = {};
        const fieldErrors = error.formErrors.fieldErrors;
        for (const key in fieldErrors) {
          if (fieldErrors[key]?.[0]) {
            formattedErrors[key as keyof FormData] = fieldErrors[key][0];
          }
        }
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleValueChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://movemates.co.za";
      const response = await fetch(`${baseUrl}/api/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    submitted,
    errors,
    submitError,
    step,
    totalSteps,
    isSubmitting,
    setFormData, // Needed for specific custom buttons
    nextStep,
    prevStep,
    handleChange,
    handleValueChange,
    handleSubmit,
  };
}
