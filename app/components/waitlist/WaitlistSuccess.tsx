import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

interface WaitlistSuccessProps {
  onClose: () => void;
}

export function WaitlistSuccess({ onClose }: WaitlistSuccessProps) {
  return (
    <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-3">
          Awesome! You&apos;re on the list.
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          We&apos;ve saved your spot. You&apos;ll be the first to know when we
          launch in your area.
        </p>
        <Button onClick={onClose} className="w-full h-12 rounded-xl">
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
