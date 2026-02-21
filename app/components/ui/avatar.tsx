import * as React from "react";
import Image from "next/image";
import { cn } from "../../../libs/utils";

export interface AvatarProps {
  role?: "bot" | "user";
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

const Avatar = ({
  role = "bot",
  src,
  alt,
  size = 32,
  className,
}: AvatarProps) => {
  const defaultSrc =
    role === "bot" ? "/assets/images/bot.png" : "/assets/images/user.png";
  const defaultAlt = role === "bot" ? "Assistant" : "User";

  return (
    <Image
      src={src || defaultSrc}
      alt={alt || defaultAlt}
      width={size}
      height={size}
      className={cn(
        "rounded-full shadow-sm object-cover",
        role === "bot"
          ? "border-2 border-[#FE6912] bg-white"
          : "border-2 border-slate-200 bg-white",
        className,
      )}
    />
  );
};

export { Avatar };
