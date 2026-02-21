import React from "react";
import { cn } from "../../../libs/utils";
import { SelectField, SelectItem } from "../ui/select";
import { WaitlistStepProps } from "./types";

interface ExtendedWaitlistStepProps extends WaitlistStepProps {
  onTypeSelect: (type: "customer" | "driver") => void;
}

export function WaitlistPreferencesStep({
  formData,
  onValueChange,
  onTypeSelect,
}: ExtendedWaitlistStepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="text-xs font-bold text-secondary/50 uppercase tracking-wide ml-1">
          Joining as
        </label>
        <div className="grid grid-cols-1 gap-3">
          {([
            {
              id: "customer",
              label: "A Customer",
              desc: "I need to move items",
            },
            {
              id: "driver",
              label: "A Partner",
              desc: "I have a vehicle to move items",
            },
          ] as const).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTypeSelect(t.id)}
              className={cn(
                "flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left outline-none focus:outline-none focus:ring-0 focus:ring-transparent select-none",
                formData.type === t.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-100 hover:border-gray-200",
              )}
            >
              <span className="font-bold text-secondary">{t.label}</span>
              <span className="text-xs text-gray-500">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <SelectField
        label="Discovery"
        placeholder="Where did you hear about us?"
        value={formData.social}
        onValueChange={(val) => onValueChange!("social", val)}
        required
      >
        <SelectItem value="facebook">Facebook</SelectItem>
        <SelectItem value="twitter">Twitter</SelectItem>
        <SelectItem value="instagram">Instagram</SelectItem>
        <SelectItem value="linkedin">LinkedIn</SelectItem>
        <SelectItem value="referral">Word of Mouth</SelectItem>
      </SelectField>
    </div>
  );
}
