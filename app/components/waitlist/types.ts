import { FormData } from "@/schema/schema";

export type FormErrors = {
  [K in keyof FormData]?: string;
};

export interface WaitlistStepProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onValueChange?: (name: string, value: string) => void;
  submitError?: string;
}
