import React from "react";
import { Input } from "../ui/input";
import { SelectField, SelectItem } from "../ui/select";
import { WaitlistStepProps } from "./types";

export function WaitlistLocationStep({
  formData,
  errors,
  onChange,
  onValueChange,
  submitError,
}: WaitlistStepProps) {
  return (
    <div className="space-y-6">
      <SelectField
        label="Province"
        placeholder="Select your province"
        value={formData.province}
        onValueChange={(val) => onValueChange!("province", val)}
        required
      >
        <SelectItem value="gauteng">Gauteng</SelectItem>
        <SelectItem value="western-cape">Western Cape</SelectItem>
        <SelectItem value="kwazulu-natal">KwaZulu-Natal</SelectItem>
      </SelectField>

      <Input
        label="City"
        name="city"
        placeholder="e.g. Johannesburg"
        value={formData.city}
        onChange={onChange}
        required
      />
      {errors.city && (
        <p className="text-xs text-red-500 ml-1 mt-1 font-medium">
          {errors.city}
        </p>
      )}

      {submitError && (
        <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm font-medium border border-red-100">
          {submitError}
        </div>
      )}
    </div>
  );
}
