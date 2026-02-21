import React from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

import { useWaitlistForm } from "./waitlist/useWaitlistForm";
import { WaitlistSidebar } from "./waitlist/WaitlistSidebar";
import { WaitlistInformationStep } from "./waitlist/WaitlistInformationStep";
import { WaitlistPreferencesStep } from "./waitlist/WaitlistPreferencesStep";
import { WaitlistLocationStep } from "./waitlist/WaitlistLocationStep";
import { WaitlistSuccess } from "./waitlist/WaitlistSuccess";

interface EnhancedWaitlistFormProps {
  onClose: () => void;
}

export default function EnhancedWaitlistForm({
  onClose,
}: EnhancedWaitlistFormProps) {
  const {
    formData,
    submitted,
    errors,
    submitError,
    step,
    totalSteps,
    isSubmitting,
    nextStep,
    prevStep,
    handleChange,
    handleValueChange,
    handleSubmit,
    setFormData,
  } = useWaitlistForm();

  if (submitted) {
    return <WaitlistSuccess onClose={onClose} />;
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <WaitlistInformationStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <WaitlistPreferencesStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onValueChange={handleValueChange}
            onTypeSelect={(type) => setFormData((prev) => ({ ...prev, type }))}
          />
        );
      case 3:
        return (
          <WaitlistLocationStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onValueChange={handleValueChange}
            submitError={submitError}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = {
    1: "Tell us about yourself",
    2: "How can we help?",
    3: "Where are you based?",
  };

  return (
    <div className="fixed inset-0 bg-secondary/80 backdrop-blur-md overflow-y-auto h-full w-full p-4 z-[100] flex items-center justify-center">
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl flex flex-col md:flex-row min-h-[600px] overflow-hidden">
        <WaitlistSidebar step={step} />

        <div className="flex-1 p-8 md:p-12 relative">
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 h-auto text-gray-400 hover:text-secondary rounded-full border-none"
          >
            <X size={20} />
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto h-full flex flex-col"
            >
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-secondary mb-2">
                  {stepTitles[step as keyof typeof stepTitles]}
                </h3>
                <p className="text-gray-500">
                  Step {step} of {totalSteps}
                </p>
              </div>

              <div className="flex-1">{renderStepContent()}</div>

              <div className="pt-10 flex gap-4 mt-auto">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="flex-1 h-12 rounded-xl border-gray-200"
                  >
                    <ChevronLeft size={18} className="mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={step === totalSteps ? handleSubmit : nextStep}
                  disabled={isSubmitting}
                  className="flex-[2] h-12 rounded-xl shadow-lg shadow-primary/20"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : step === totalSteps
                      ? "Secure Access"
                      : "Continue"}
                  {!isSubmitting && step !== totalSteps && (
                    <ChevronRight size={18} className="ml-2" />
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
