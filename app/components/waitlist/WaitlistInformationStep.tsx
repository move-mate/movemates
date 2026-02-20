import React from "react";
import { Input } from "../ui/input";
import { WaitlistStepProps } from "./types";

export function WaitlistInformationStep({
  formData,
  errors,
  onChange,
}: WaitlistStepProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        placeholder="e.g. John Doe"
        value={formData.name}
        onChange={onChange}
        required
      />
      {errors.name && (
        <p className="text-xs text-red-500 ml-1 mt-1 font-medium">
          {errors.name}
        </p>
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="hello@example.com"
        value={formData.email}
        onChange={onChange}
        required
      />
      {errors.email && (
        <p className="text-xs text-red-500 ml-1 mt-1 font-medium">
          {errors.email}
        </p>
      )}

      <Input
        label="Phone Number"
        name="phone"
        placeholder="072 123 4567"
        value={formData.phone}
        onChange={onChange}
        required
      />
      {errors.phone && (
        <p className="text-xs text-red-500 ml-1 mt-1 font-medium">
          {errors.phone}
        </p>
      )}
    </div>
  );
}
