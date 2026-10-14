"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart, type ResolvedLine } from "./CartProvider";
import { price } from "@/lib/format";
import { store } from "@/lib/config";
import { ArrowIcon, SparkIcon } from "./ui/Icons";
import SectionLabel from "./ui/SectionLabel";
import { CheckoutSkeleton } from "./skeletons";
import { customerSchema, fieldErrors, type Customer, type CustomerField, type OrderRequest, type OrderResponse, type PaymentMethod } from "@/lib/validation";

type Method = PaymentMethod;
type Form = Customer;
type Order = { id: string; method: Method; total: number; lines: { name: string; size: string; qty: number }[]; firstName: string; phone: string };

const EMPTY: Form = { name: "", phone: "", email: "", address: "", city: "", notes: "" };
const MAX: Record<CustomerField, number> = { name: 80, phone: 20, email: 120, address: 200, city: 60, notes: 300 };

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  textarea,
  optional,
  className,
}: {
  label: string;
  name: keyof Form;
  value: string;
  onChange: (k: keyof Form, v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  optional?: boolean;
  className?: string;
}) {
  const common = {
    id: name,
    name,
    value,
    maxLength: MAX[name],
    autoComplete,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${name}-err` : undefined,
    placeholder: " ",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(name, e.target.value),
    className: `peer w-full rounded-2xl border bg-ivory px-4 pb-2.5 pt-6 text-[16px] outline-none transition-colors focus:border-ink ${
      error ? "border-[#a23b2a]" : "border-ink/15"
    }`,
  };
  return (
    <div className={`relative ${className ?? ""}`}>
      {textarea ? <textarea rows={3} {...common} /> : <input type={type} {...common} />}
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 top-4 origin-left text-[15px] text-ink/50 transition-all duration-300 peer-focus:top-2 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
      >
        {label}
        {optional && <span className="text-ink/40"> (optional)</span>}
      </label>
      {error && (
        <p id={`${name}-err`} className="mt-1.5 pl-1 text-xs text-[#a23b2a]">
          {error}
        </p>
      )}
    </div>
  );
}

function Summary({ lines, subtotal, delivery, total }: { lines: ResolvedLine[]; subtotal: number; delivery: number; total: number }) {
  return (
    <div>
      <ul className="space-y-4">
        {lines.map((l) => (
          <li key={l.slug + l.size} className="flex items-center gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-sand">
              <Image src={l.product.images[0]} alt="" fill sizes="64px" className="object-cover" />
              <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] text-ivory">{l.qty}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="display truncate text-xl leading-tight">{l.product.name}</p>
              <p className="text-xs text-ink/55">
                {l.product.colour} · {l.size}
              </p>
            </div>
            <p className="text-sm">{price(l.total)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
        <div className="flex justify-between text-ink/70">
          <dt>Subtotal</dt>
          <dd>{price(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-ink/70">
          <dt>Delivery</dt>
          <dd>{delivery === 0 ? "Complimentary" : price(delivery)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
          <dt className="eyebrow text-[10px]">Total</dt>
          <dd className="display text-3xl">{price(total)}</dd>
        </div>
      </dl>
    </div>
  );
}

function BankDetails({ reference }: { reference?: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const rows = [
    ["Bank", `${store.bank.bankName}, ${store.bank.branch}`],
    ["Account name", store.bank.accountName],
    ["Account number", store.bank.accountNumber],
    ...(reference ? [["Reference", reference]] : []),
  ];
  return (
    <dl className="space-y-2.5 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-3">
          <dt className="text-ink/55">{k}</dt>
          <dd className="flex items-center gap-2 text-right font-medium">
            {v}
            {(k === "Account number" || k === "Reference") && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(v.replace(/\s/g, ""));
                  setCopied(k);
                  setTimeout(() => setCopied(null), 1500);
                }}
                className="eyebrow rounded-full border border-ink/15 px-2 py-1 text-[8px]"
              >
                {copied === k ? "Copied" : "Copy"}
              </button>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function Checkout() {
  const { lines, items, subtotal, delivery, total, clear, hydrated } = useCart();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<CustomerField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [method, setMethod] = useState<Method>("cod");
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const update = (k: keyof Form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const showErrors = (e: Partial<Record<CustomerField, string>>) => {
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(first)?.focus();
  };

  const place = async (e: React.FormEvent) => {
    e.preventDefault();
    if (placing) return;
    setFormError(null);
    const check = customerSchema.safeParse(form);
    if (!check.success) return showErrors(fieldErrors(check.error));

    setPlacing(true);
    const body: OrderRequest = { customer: form, method, items, website: honeypot };
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json()) as OrderResponse;
      if (!data.ok) {
        if (data.fields) showErrors(data.fields);
        setFormError(data.error);
        return;
      }
      setOrder({
        id: data.id,
        method: data.method,
        total: data.total,
        lines: lines.map((l) => ({ name: l.product.name, size: l.size, qty: l.qty })),
        firstName: check.data.name.split(" ")[0],
        phone: check.data.phone,
      });
      clear();
      window.scrollTo({ top: 0 });
    } catch {
      setFormError("We couldn't reach the studio. Please check your connection and try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (order) return <Confirmation order={order} />;
  if (!hydrated) return <CheckoutSkeleton />;

  if (hydrated && lines.length === 0) {
    return (
      <div className="grid min-h-[80svh] place-items-center bg-cream px-6 pt-[var(--header-h)] text-center">
        <div>
          <p className="display text-6xl italic">Your bag is empty.</p>
          <p className="mt-4 text-ink/60">Add a piece or two, then come back to place your order.</p>
          <Link href="/shop" className="eyebrow mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-ivory">
            Explore the collection <ArrowIcon size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream pb-20 pt-[calc(var(--header-h)+1.5rem)] md:pt-[calc(var(--header-h)+3rem)]">
      <div className="container-x">
        <p className="eyebrow text-brown">Checkout</p>
        <h1 className="display mt-3 text-[14vw] md:text-[6vw]">
          Almost <span className="italic">yours.</span>
        </h1>

        {/* Mobile order summary */}
        <div className="mt-6 rounded-[20px] bg-ivory md:hidden">
          <button onClick={() => setSummaryOpen(!summaryOpen)} className="flex w-full items-center justify-between p-5" aria-expanded={summaryOpen}>
            <span className="eyebrow text-[10px]">
              {summaryOpen ? "Hide" : "Show"} order summary ({lines.reduce((s, l) => s + l.qty, 0)})
            </span>
            <span className="display text-2xl">{price(total)}</span>
          </button>
          <AnimatePresence initial={false}>
            {summaryOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-5">
                  <Summary lines={lines} subtotal={subtotal} delivery={delivery} total={total} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 grid gap-12 md:mt-14 md:grid-cols-12">
          <form onSubmit={place} noValidate className="md:col-span-7">
            <fieldset>
              <legend>
                <SectionLabel kicker="Delivery details" sub="Where shall we send your story?" reveal={false} />
              </legend>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Field label="Full name" name="name" value={form.name} onChange={update} error={errors.name} autoComplete="name" />
                <Field label="Mobile (WhatsApp)" name="phone" type="tel" value={form.phone} onChange={update} error={errors.phone} autoComplete="tel" />
                <Field label="Email" name="email" type="email" value={form.email} onChange={update} error={errors.email} autoComplete="email" optional className="sm:col-span-2" />
                <Field label="Address" name="address" value={form.address} onChange={update} error={errors.address} autoComplete="street-address" className="sm:col-span-2" />
                <Field label="City" name="city" value={form.city} onChange={update} error={errors.city} autoComplete="address-level2" />
                <Field label="Delivery notes" name="notes" value={form.notes} onChange={update} optional />
              </div>
            </fieldset>

            <fieldset className="mt-12">
              <legend>
                <SectionLabel kicker="Payment" sub="Pay in person, or by bank transfer" reveal={false} />
              </legend>
              <div className="mt-6 grid gap-3" role="radiogroup">
                {(
                  [
                    ["cod", "Cash on delivery", "Pay the courier in cash when your parcel arrives. Most popular."],
                    ["bank", "Bank transfer", "Transfer the total and send us the slip on WhatsApp. We dispatch once it's received."],
                  ] as const
                ).map(([id, title, desc]) => {
                  const on = method === id;
                  return (
                    <label
                      key={id}
                      className={`relative block cursor-pointer rounded-[20px] border p-5 transition-all duration-300 md:p-6 ${on ? "border-ink bg-ivory shadow-[0_8px_30px_-12px_rgba(31,21,14,.25)]" : "border-ink/15 hover:border-ink/40"}`}
                    >
                      <input type="radio" name="method" value={id} checked={on} onChange={() => setMethod(id)} className="sr-only" />
                      <div className="flex items-start gap-4">
                        <span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${on ? "border-ink" : "border-ink/30"}`}>
                          <motion.span animate={{ scale: on ? 1 : 0 }} className="h-2.5 w-2.5 rounded-full bg-ink" />
                        </span>
                        <div className="flex-1">
                          <p className="display text-2xl md:text-3xl">{title}</p>
                          <p className="mt-1 text-sm text-ink/65">{desc}</p>
                        </div>
                      </div>
                      <AnimatePresence initial={false}>
                        {on && id === "bank" && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="ml-9 mt-5 rounded-2xl bg-cream p-4">
                              <BankDetails />
                              <p className="mt-3 text-xs text-ink/60">You&apos;ll get an order number to use as your transfer reference.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Honeypot: invisible to people and screen readers, tempting to bots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            {formError && (
              <p role="alert" className="mt-8 rounded-2xl bg-[#a23b2a]/10 px-5 py-4 text-sm text-[#7d2c1f]">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={placing || lines.length === 0}
              className="group mt-10 flex w-full items-center justify-between rounded-full bg-ink px-6 py-5 md:px-8 text-ivory transition-colors hover:bg-brown disabled:opacity-60"
            >
              <span className="eyebrow whitespace-nowrap">
                {placing ? (
                  "Placing your order…"
                ) : (
                  <>
                    Place order<span className="hidden md:inline"> · {price(total)}</span>
                  </>
                )}
              </span>
              {placing ? (
                <span className="h-4 w-4 animate-spin rounded-full border border-ivory border-t-transparent" />
              ) : (
                <span className="flex items-center gap-3">
                  <span className="whitespace-nowrap text-sm tracking-wide md:hidden">{price(total)}</span>
                  <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </button>
            <p className="mt-4 text-center text-xs text-ink/55">We&apos;ll confirm your order personally on WhatsApp before dispatch.</p>
          </form>

          <aside className="hidden md:col-span-4 md:col-start-9 md:block">
            <div className="sticky top-[calc(var(--header-h)+1.5rem)] rounded-[24px] bg-ivory p-7">
              <p className="eyebrow mb-6 text-[10px]">Your order</p>
              <Summary lines={lines} subtotal={subtotal} delivery={delivery} total={total} />
              <ul className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-xs text-ink/65">
                {[`Delivered ${store.deliveryArea} in ${store.dispatchDays}`, "7-day exchanges", "Gift wrapped as standard"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <SparkIcon size={8} className="text-gold" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Confirmation({ order }: { order: Order }) {
  return (
    <div className="bg-cream pb-24 pt-[calc(var(--header-h)+3rem)]">
      <div className="container-x mx-auto max-w-2xl text-center">
        <motion.svg viewBox="0 0 80 80" className="mx-auto h-20 w-20 text-brown" initial="hidden" animate="show">
          <motion.circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="1.2" variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1 } } }} />
          <motion.path d="M26 41l9 9 19-20" fill="none" stroke="currentColor" strokeWidth="1.6" variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.6, delay: 0.8 } } }} />
        </motion.svg>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <p className="eyebrow mt-8 text-brown">Order {order.id}</p>
          <h1 className="display mt-4 text-[14vw] md:text-[6vw]">
            Thank you, <span className="italic">{order.firstName}.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-7 text-ink/70">
            Your story is being wrapped. We&apos;ll message you on <strong className="font-medium">{order.phone}</strong> shortly to confirm the details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-[24px] bg-ivory p-6 text-left md:p-8"
        >
          {order.method === "bank" ? (
            <>
              <p className="display text-3xl">Complete your bank transfer</p>
              <p className="mt-2 text-sm text-ink/65">
                Transfer <strong className="font-medium text-ink">{price(order.total)}</strong> using your order number as the reference, then send the slip to{" "}
                {store.contact.whatsapp} on WhatsApp.
              </p>
              <div className="mt-5 rounded-2xl bg-cream p-4">
                <BankDetails reference={order.id} />
              </div>
            </>
          ) : (
            <>
              <p className="display text-3xl">Cash on delivery</p>
              <p className="mt-2 text-sm text-ink/65">
                Please keep <strong className="font-medium text-ink">{price(order.total)}</strong> ready for the courier. Delivery {store.deliveryArea} in {store.dispatchDays}.
              </p>
            </>
          )}
          <ul className="mt-6 space-y-1 border-t border-ink/10 pt-5 text-sm text-ink/70">
            {order.lines.map((l) => (
              <li key={l.name + l.size} className="flex justify-between">
                <span>
                  {l.name} · {l.size}
                </span>
                <span>× {l.qty}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <Link href="/shop" className="eyebrow mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-ivory">
          Continue shopping <ArrowIcon size={14} />
        </Link>
      </div>
    </div>
  );
}
