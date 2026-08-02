import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Experience } from "@/data/booking";

const ServiceCard = ({
  service,
  index,
  onSelect,
}: {
  service: Experience;
  index: number;
  onSelect: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };

  const featured = service.featured;

  return (
    <motion.button
      ref={ref}
      type="button"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: 0.07 * index, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.985 }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={onSelect}
      className={`group relative flex min-h-[420px] w-full flex-col overflow-hidden rounded-[26px] border text-left transition-[box-shadow,border-color] duration-500 ${
        featured
          ? "border-primary/40 shadow-[0_24px_70px_hsl(var(--gold)/0.22)] hover:border-primary"
          : "border-border hover:border-primary/60 hover:shadow-[0_26px_70px_hsl(0_0%_0%/0.22)]"
      }`}
    >
      {/* Media / background */}
      <div className="absolute inset-0 overflow-hidden">
        {featured ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(150deg,hsl(240_3%_4%),hsl(0_0%_11%)_55%,hsl(240_3%_6%))]" />
            <motion.div
              aria-hidden
              className="absolute inset-0"
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(60% 45% at 30% 20%, hsl(var(--gold)/0.28), transparent 70%), radial-gradient(50% 40% at 80% 80%, hsl(var(--gold)/0.18), transparent 70%)",
              }}
            />
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute h-1 w-1 rounded-full bg-primary/70"
                style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
                animate={{ y: [0, -26, 0], opacity: [0.15, 0.9, 0.15] }}
                transition={{
                  duration: 5 + (i % 5),
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut",
                }}
              />
            ))}
            <motion.span
              aria-hidden
              className="absolute -left-1/3 top-0 h-full w-1/3 bg-[linear-gradient(100deg,transparent,hsl(var(--gold)/0.18),transparent)]"
              animate={{ x: ["0%", "420%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
          </>
        ) : (
          <>
            <motion.img
              src={service.image}
              alt={`${service.name} photography by Afriframe Studio`}
              loading="lazy"
              animate={{ x: tilt.x * -14, y: tilt.y * -14, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.16]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(240_3%_4%/0.35)_0%,hsl(240_3%_4%/0.55)_45%,hsl(240_3%_4%/0.92)_100%)]" />
          </>
        )}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 [background:radial-gradient(45%_35%_at_50%_100%,hsl(var(--gold)/0.28),transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative mt-auto flex flex-col gap-4 p-7 md:p-8">
        {featured && (
          <span className="w-fit rounded-full border border-primary/40 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-primary">
            By Invitation
          </span>
        )}
        <h3 className="font-display text-[1.75rem] leading-tight text-white md:text-3xl">
          {service.name}
        </h3>
        <p className="max-w-[46ch] text-sm leading-relaxed text-white/70">
          {featured ? service.description.split(". ").slice(0, 2).join(". ") + "." : service.description}
        </p>

        {featured && (
          <ul className="flex flex-wrap gap-2">
            {service.includes.slice(0, 4).map((x) => (
              <li
                key={x}
                className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/60"
              >
                {x}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary">
          Explore &amp; Book
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </motion.button>
  );
};

export default ServiceCard;
