import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[90svh] place-items-center bg-cream px-6 text-center">
      <div>
        <p className="eyebrow text-brown">404</p>
        <h1 className="display mt-4 text-[16vw] md:text-[8vw]">
          A page <span className="italic">unwritten.</span>
        </h1>
        <Link href="/" className="eyebrow mt-8 inline-block rounded-full bg-ink px-7 py-4 text-ivory">
          Back to the story
        </Link>
      </div>
    </div>
  );
}
