import { twMerge } from "tailwind-merge";
import { Label } from "./Typography";
import { Input } from "./Input";

export function LoginInput({ label, placeholder, type = "text", value, onChange, className }) {
  return (
    <div className={twMerge("flex flex-col gap-1.5 w-full", className)}>
      <Label size="sm" className="text-gray-800 font-bold">
        {label}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
