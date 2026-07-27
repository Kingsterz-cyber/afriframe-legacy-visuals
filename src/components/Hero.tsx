import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import cameraImage from "@/assets/camera.jpg";

const headline = [["Every", "Frame"], ["Tells"], ["A", "Story."]];

const badges = [
  { label: "Client Satisfaction", value: "98%", star: true },
  { label: "Projects Delivered", value: "500+" },
  { label: "Years of Craft", value: "7+" },
];

const Hero = () => {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPointer({
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reduce]);

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 2 + ((i * 7) % 5),
        delay: (i % 10) * 1.4,
        duration: 12 + (i % 6) * 2.5,
      })),
    []
  );

  const bokeh = useMemo(
    () =>
      [
        { size: 260, x: "8%", y: "18%", o: 0.1 },
        { size: 180, x: "72%", y: "12%", o: 0.12 },
        { size: 320, x: "58%", y: "62%", o: 0.09 },
        { size: 120, x: "30%", y: "78%", o: 0.11 },
      ] as const,
    []
  );

  let wordIndex = 0;

  return (
    <section
      ref={sectionRef}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-background pt-28 pb-16 md:pt-24"
    >
      {/* Layer 1 — cinematic gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_45%,hsl(var(--gold)/0.14),transparent_60%),radial-gradient(80%_60%_at_10%_10%,hsl(var(--accent)/0.07),transparent_60%)]" />

      {/* Layer 3 — bokeh */}
      {bokeh.map((b, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-primary blur-3xl"
          style={{ width: b.size, height: b.size, left: b.x, top: b.y, opacity: b.o }}
          animate={reduce ? undefined : { y: [0, -18, 0], x: [0, 12, 0] }}
          transition={{ duration: 18 + i * 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Layer 4 — gold dust */}
      {!reduce &&
        particles.map((p) => (
          <span
            key={p.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-primary/70 blur-[1px] animate-drift"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

      <div className="lux-container relative z-10 grid items-center gap-16 lg:grid-cols-[minmax(0,47%)_minmax(0,53%)]">
        {/* LEFT — editorial typography */}
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="eyebrow"
          >
            Afriframe Studio — Photography &amp; Cinematic Storytelling
          </motion.p>

          <h1 className="display mt-6 font-medium text-foreground">
            {headline.map((line, li) => (
              <span key={li} className="block overflow-hidden">
                {line.map((word) => {
                  const d = 0.35 + wordIndex++ * 0.11;
                  return (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: "0.5em" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: d, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className={`inline-block ${li === 2 ? "italic gold-text pr-2" : "pr-4"}`}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            We transform weddings, portraits, brands and unforgettable moments into timeless
            visual stories through premium photography and cinematic filmmaking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              to="/booking"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-sm font-medium tracking-wide text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_hsl(var(--gold)/0.35)]"
            >
              Book Your Session
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/explore"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-border px-8 text-sm font-medium tracking-wide text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
            >
              Explore Our Portfolio
            </Link>
          </motion.div>

          {/* Trust indicators — floating badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.9 }}
            className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5"
          >
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                {b.star && <Star className="h-4 w-4 fill-primary text-primary" />}
                <span className="numeric text-xl font-semibold text-foreground">{b.value}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {b.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — the camera as the composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative -mr-6 lg:-mr-24 xl:-mr-32"
          style={{
            transform: reduce
              ? undefined
              : `rotateY(${pointer.x * 4}deg) rotateX(${-pointer.y * 3}deg)`,
            transformStyle: "preserve-3d",
            perspective: 1200,
          }}
        >
          {/* Layer 2 — champagne radial glow behind the lens */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[110px]" />

          <div className="animate-float relative">
            <img
              src={cameraImage}
              alt="Luxury black and gold camera lens illuminated by warm studio light"
              className="camera-mask w-full select-none object-contain drop-shadow-[0_40px_80px_hsl(0_0%_0%/0.5)]"
            />
            {/* Reflection */}
            <div
              aria-hidden
              className="camera-mask pointer-events-none absolute inset-x-0 top-[86%] h-40 scale-y-[-1] opacity-[0.08] blur-md"
              style={{
                backgroundImage: `url(${cameraImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>

          {/* Lens flare */}
          <div className="pointer-events-none absolute left-[46%] top-[38%] h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border border-foreground/25">
          <span className="mt-2 h-2.5 w-1 animate-pulse rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
