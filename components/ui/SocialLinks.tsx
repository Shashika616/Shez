import { store } from "@/lib/config";

type IconProps = { size?: number };

const InstagramIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.9.3-1.5 1.6-1.5h1.6V4.3a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.2H7.7v3h2.6V21h3.2Z" />
  </svg>
);

const TikTokIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v3.1a7.4 7.4 0 0 1-3.8-1.1v6.2c0 3.2-2.5 5.9-5.8 5.9a5.8 5.8 0 0 1-1-11.5v3.2a2.7 2.7 0 1 0 1.9 2.6V3h4.8Z" />
  </svg>
);

const MailIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const SOCIALS = [
  { label: "Instagram", href: store.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: store.social.facebook, Icon: FacebookIcon },
  { label: "TikTok", href: store.social.tiktok, Icon: TikTokIcon },
  { label: "Email", href: `mailto:${store.contact.email}`, Icon: MailIcon },
] as const;

/** Round icon buttons for Shez's social accounts. External links open in a new tab, safely. */
export default function SocialLinks({ tone = "dark", size = 44, className }: { tone?: "dark" | "light"; size?: number; className?: string }) {
  const style =
    tone === "dark"
      ? "border-cream/25 text-cream hover:bg-cream hover:text-ink"
      : "border-ink/20 text-ink hover:bg-ink hover:text-ivory";
  return (
    <ul className={`flex gap-2.5 ${className ?? ""}`}>
      {SOCIALS.map(({ label, href, Icon }) => {
        const external = href.startsWith("http");
        return (
          <li key={label}>
            <a
              href={href}
              aria-label={`Shez on ${label}`}
              title={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`grid place-items-center rounded-full border transition-colors duration-300 ${style}`}
              style={{ width: size, height: size }}
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
