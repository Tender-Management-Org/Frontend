import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const BRAND_NAME = "tenderkhoj";

const WORDMARK = {
  onLight: { src: "/brand/logo-wordmark-light.png", width: 815, height: 187 },
  onDark: { src: "/brand/logo-wordmark-dark.png", width: 815, height: 187 },
} as const;

type WordmarkVariant = keyof typeof WORDMARK;

export function BrandMark({
  size = 32,
  className,
  alt = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn("rounded-lg object-cover", className)}
    />
  );
}

export function BrandWordmark({
  variant = "onLight",
  height = 36,
  className,
  priority = false,
}: {
  variant?: WordmarkVariant;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const asset = WORDMARK[variant];
  const width = Math.round((asset.width / asset.height) * height);
  return (
    <Image
      src={asset.src}
      alt="tenderkhoj"
      width={width}
      height={height}
      priority={priority}
      className={cn("select-none object-contain object-left", className)}
      style={{ height, width: "auto" }}
    />
  );
}

export function BrandHomeLink({
  variant = "onLight",
  wordmarkHeight = 36,
  className,
  priority = false,
  href = "/",
}: {
  variant?: WordmarkVariant;
  wordmarkHeight?: number;
  className?: string;
  priority?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500",
        className
      )}
      aria-label="tenderkhoj home"
    >
      <BrandWordmark variant={variant} height={wordmarkHeight} priority={priority} />
    </Link>
  );
}
