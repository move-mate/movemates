import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../../../libs/utils";

interface WaitlistSidebarProps {
  step: number;
}

export function WaitlistSidebar({ step }: WaitlistSidebarProps) {
  return (
    <div className="md:w-[320px] bg-secondary p-8 text-white hidden md:flex flex-col">
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-2">MoveMates</h2>
        <p className="text-gray-400 text-sm mb-12">Early Access Waitlist</p>

        <div className="space-y-8">
          {[
            { s: 1, t: "Information", d: "Personal details" },
            { s: 2, t: "Preferences", d: "Role & Discovery" },
            { s: 3, t: "Location", d: "Service area" },
          ].map((item) => (
            <div key={item.s} className="flex gap-4">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  step === item.s
                    ? "border-primary bg-primary text-white"
                    : step > item.s
                      ? "border-primary/50 bg-primary/20 text-primary"
                      : "border-gray-700 text-gray-500",
                )}
              >
                {step > item.s ? <CheckCircle2 size={16} /> : item.s}
              </div>
              <div>
                <p
                  className={cn(
                    "font-semibold text-sm",
                    step >= item.s ? "text-white" : "text-gray-600",
                  )}
                >
                  {item.t}
                </p>
                <p className="text-xs text-gray-500">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-gray-800">
        <p className="text-xs text-gray-500 italic">
          &quot;Making moves seamless across South Africa.&quot;
        </p>
      </div>
    </div>
  );
}
