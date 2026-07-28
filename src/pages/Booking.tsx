import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingProgress from "@/components/booking/BookingProgress";
import ServiceCard from "@/components/booking/ServiceCard";
import LuxuryCalendar from "@/components/booking/LuxuryCalendar";
import TimeSlotSelector from "@/components/booking/TimeSlotSelector";
import {
  FloatingInput,
  FloatingSelect,
  FloatingTextarea,
} from "@/components/booking/FloatingField";
import {
  experiences,
  eventTypes,
  isDateBooked,
  slotsForDate,
} from "@/data/booking";

type Details = {
  name: string;
  email: string;
  phone: string;
  location: string;
  eventType: string;
  description: string;
  notes: string;
};

const emptyDetails: Details = {
  name: "",
  email: "",
  phone: "",
  location: "",
  eventType: "",
  description: "",
  notes: "",
};

const stepHeadings = [
  { title: "Choose Your Experience", sub: "Select the service that best matches your vision." },
  { title: "Select Date & Time", sub: "Choose the moment we reserve exclusively for you." },
  { title: "Tell Us About Your Project", sub: "A few details so we can prepare properly." },
  { title: "Review Your Booking", sub: "Everything in one place before we begin." },
  { title: "Booking Confirmed", sub: "" },
];

const SectionHeading = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-10 text-center">
    <h2 className="font-display text-3xl text-foreground md:text-5xl">
      {title.split(" ").slice(0, -1).join(" ")}{" "}
      <span className="italic gold-text">{title.split(" ").slice(-1)}</span>
    </h2>
    {sub && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{sub}</p>}
  </div>
);

const Confetti = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        delay: (i % 12) * 0.12,
        size: 4 + (i % 4) * 2,
        duration: 3.2 + (i % 5) * 0.5,
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: "110%", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ delay: p.delay, duration: p.duration, ease: "easeIn" }}
          className="absolute rounded-[2px] bg-primary"
          style={{ left: p.left, width: p.size, height: p.size * 2 }}
        />
      ))}
    </div>
  );
};

const Booking = () => {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [serviceId, setServiceId] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<string>();
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const touchStart = useRef<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const service = experiences.find((s) => s.id === serviceId);
  const slots = date ? slotsForDate(date) : [];

  const set = (k: keyof Details) => (v: string) => {
    setDetails((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validateDetails = () => {
    const next: Partial<Record<keyof Details, string>> = {};
    if (!details.name.trim()) next.name = "Please tell us your name";
    if (!/^\S+@\S+\.\S+$/.test(details.email)) next.email = "Enter a valid email address";
    if (details.phone.trim().length < 7) next.phone = "Enter a reachable phone number";
    if (!details.eventType) next.eventType = "Choose an event type";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const canAdvance = () => {
    if (step === 0) return !!serviceId;
    if (step === 1) return !!date && !!slot;
    if (step === 2) return validateDetails();
    return true;
  };

  const go = (delta: number) => {
    if (delta > 0 && !canAdvance()) {
      if (step !== 2) toast.error("Please complete this step to continue.");
      return;
    }
    setDir(delta);
    setStep((s) => Math.min(4, Math.max(0, s + delta)));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const confirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setReference(
      `AFR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    );
    setSubmitting(false);
    setDir(1);
    setStep(4);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reset = () => {
    setStep(0);
    setServiceId(undefined);
    setDate(undefined);
    setSlot(undefined);
    setDetails(emptyDetails);
    setErrors({});
    setReference("");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (step === 4) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const dateLabel = date
    ? date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60, filter: "blur(10px)", scale: 0.98 }),
    center: { opacity: 1, x: 0, filter: "blur(0px)", scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d * -60, filter: "blur(10px)", scale: 0.98 }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main
        className="relative overflow-hidden"
        onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStart.current === null || step === 4) return;
          const delta = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 80) go(delta < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(70%_60%_at_50%_0%,hsl(var(--gold)/0.12),transparent_70%)]" />

        {/* Booking hero */}
        <section ref={topRef} className="lux-container relative pb-8 pt-32 text-center md:pt-36">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="eyebrow"
          >
            Afriframe Studio — Reservations
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-display text-4xl text-foreground md:text-6xl"
          >
            Reserve Your <span className="italic gold-text">Session</span>
          </motion.h1>
          <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
            A guided, five-step reservation — one considered decision at a time.
          </p>
        </section>

        <div className="lux-container sticky top-24 z-30 py-4">
          <div className="glass rounded-[20px] px-5 py-4 md:px-8">
            <BookingProgress current={step} />
          </div>
        </div>

        <section className="lux-container relative pb-40 pt-8 md:pb-32">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {step !== 4 && (
                <SectionHeading
                  title={stepHeadings[step].title}
                  sub={stepHeadings[step].sub}
                />
              )}

              {/* STEP 1 */}
              {step === 0 && (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {experiences.map((s, i) => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      index={i}
                      selected={serviceId === s.id}
                      dimmed={!!serviceId && serviceId !== s.id}
                      onSelect={() => setServiceId(s.id)}
                    />
                  ))}
                </div>
              )}

              {/* STEP 2 */}
              {step === 1 && (
                <div className="grid items-start gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
                  <div className="flex justify-center">
                    <LuxuryCalendar
                      value={date}
                      isBooked={isDateBooked}
                      onSelect={(d) => {
                        setDate(d);
                        setSlot(undefined);
                      }}
                    />
                  </div>
                  <div className="lux-card p-6 md:p-9">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {service?.name}
                    </p>
                    <p className="mt-2 font-display text-2xl text-foreground">{dateLabel}</p>
                    <div className="gold-rule my-7" />
                    {date ? (
                      <TimeSlotSelector slots={slots} value={slot} onSelect={setSlot} />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Select a date to reveal available times.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 2 && (
                <div className="mx-auto grid max-w-3xl gap-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <FloatingInput
                      label="Full Name"
                      required
                      index={0}
                      value={details.name}
                      onChange={set("name")}
                      error={errors.name}
                    />
                    <FloatingInput
                      label="Email"
                      type="email"
                      required
                      index={1}
                      value={details.email}
                      onChange={set("email")}
                      error={errors.email}
                    />
                    <FloatingInput
                      label="Phone Number"
                      type="tel"
                      required
                      index={2}
                      value={details.phone}
                      onChange={set("phone")}
                      error={errors.phone}
                    />
                    <FloatingInput
                      label="Preferred Location"
                      index={3}
                      value={details.location}
                      onChange={set("location")}
                    />
                  </div>
                  <FloatingSelect
                    label="Event Type"
                    required
                    index={4}
                    options={eventTypes}
                    value={details.eventType}
                    onChange={set("eventType")}
                    error={errors.eventType}
                  />
                  {errors.eventType && (
                    <p className="-mt-3 pl-1 text-xs text-destructive">{errors.eventType}</p>
                  )}
                  <FloatingTextarea
                    label="Short Description"
                    index={5}
                    value={details.description}
                    onChange={set("description")}
                  />
                  <FloatingTextarea
                    label="Optional Notes"
                    index={6}
                    rows={3}
                    value={details.notes}
                    onChange={set("notes")}
                  />
                </div>
              )}

              {/* STEP 4 */}
              {step === 3 && (
                <div className="mx-auto max-w-3xl">
                  <div className="lux-card overflow-hidden p-0">
                    <div className="flex items-center justify-between border-b border-border px-7 py-6">
                      <div>
                        <p className="eyebrow">Afriframe Studio</p>
                        <p className="mt-1 font-display text-2xl text-foreground">
                          Reservation Summary
                        </p>
                      </div>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>

                    <dl className="divide-y divide-border">
                      {[
                        ["Experience", service?.name ?? "—", 0],
                        ["Date", dateLabel, 1],
                        ["Time", slot ?? "—", 1],
                        ["Estimated Duration", service?.duration ?? "—", 0],
                        ["Full Name", details.name, 2],
                        ["Email", details.email, 2],
                        ["Phone", details.phone, 2],
                        ["Location", details.location || "To be confirmed", 2],
                        ["Event Type", details.eventType, 2],
                        ["Project Notes", details.description || details.notes || "—", 2],
                      ].map(([label, value, editStep]) => (
                        <div
                          key={label as string}
                          className="flex items-start justify-between gap-6 px-7 py-4"
                        >
                          <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            {label}
                          </dt>
                          <dd className="flex items-center gap-4 text-right text-sm text-foreground">
                            <span className="max-w-sm">{value as string}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setDir(-1);
                                setStep(editStep as number);
                              }}
                              className="text-[11px] uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline"
                            >
                              Edit
                            </button>
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="flex items-center justify-between bg-muted/50 px-7 py-6">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        Estimated Price
                      </span>
                      <span className="numeric text-3xl font-semibold text-primary">
                        ${service?.price ?? 0}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Final pricing is confirmed after our creative team reviews your request.
                  </p>
                </div>
              )}

              {/* STEP 5 */}
              {step === 4 && (
                <div className="relative mx-auto max-w-2xl text-center">
                  {!reduce && <Confetti />}
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 14 }}
                    className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_20px_60px_hsl(var(--gold)/0.4)]"
                  >
                    <Check className="h-10 w-10" strokeWidth={2.5} />
                  </motion.div>

                  <h2 className="mt-9 font-display text-3xl text-foreground md:text-5xl">
                    Your Booking Request
                    <span className="block italic gold-text">Has Been Received</span>
                  </h2>
                  <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
                    Thank you for choosing Afriframe Studio. Our creative team will review your
                    request and you will receive confirmation shortly.
                  </p>

                  <div className="lux-card mt-10 grid gap-px overflow-hidden bg-border text-left sm:grid-cols-2">
                    {[
                      ["Booking Number", reference],
                      ["Experience", service?.name ?? "—"],
                      ["Date", dateLabel],
                      ["Time", slot ?? "—"],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-card px-6 py-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {l}
                        </p>
                        <p className="numeric mt-1 text-sm text-foreground">{v}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-xs text-muted-foreground">
                    A confirmation email is on its way to {details.email}.
                  </p>

                  <div className="mt-10 flex flex-wrap justify-center gap-3">
                    <Link
                      to="/"
                      className="inline-flex h-12 items-center rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      Return Home
                    </Link>
                    <Link
                      to="/explore"
                      className="inline-flex h-12 items-center rounded-2xl border border-border px-6 text-sm transition-colors duration-300 hover:border-primary hover:text-primary"
                    >
                      Explore Portfolio
                    </Link>
                    <Link
                      to="/explore#showreel"
                      className="inline-flex h-12 items-center rounded-2xl border border-border px-6 text-sm transition-colors duration-300 hover:border-primary hover:text-primary"
                    >
                      Watch Our Showreel
                    </Link>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex h-12 items-center rounded-2xl border border-border px-6 text-sm transition-colors duration-300 hover:border-primary hover:text-primary"
                    >
                      Book Another Experience
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Sticky navigation */}
        {step < 4 && (
          <div className="fixed inset-x-0 bottom-0 z-40">
            <div className="lux-container pb-5">
              <div className="glass flex items-center justify-between gap-4 rounded-[20px] px-5 py-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={step === 0}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border px-5 text-sm transition-all duration-300 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <p className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground md:block">
                  {service ? service.name : "No experience selected"}
                  {slot ? ` · ${slot}` : ""}
                </p>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="group inline-flex h-12 items-center gap-3 rounded-2xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_hsl(var(--gold)/0.35)]"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={confirm}
                    disabled={submitting}
                    className="inline-flex h-12 items-center gap-3 rounded-2xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_hsl(var(--gold)/0.35)] disabled:opacity-70"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? "Reserving…" : "Confirm Booking"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
