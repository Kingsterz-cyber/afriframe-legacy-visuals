import { motion } from "framer-motion";
import { Camera, Video, Check } from "lucide-react";
import type { Experience } from "@/data/booking";

const ServiceCard = ({
  service,
  selected,
  dimmed,
  index,
  onSelect,
}: {
  service: Experience;
  selected: boolean;
  dimmed: boolean;
  index: number;
  onSelect: () => void;
}) => {
  const Icon = service.kind === "film" ? Video : Camera;

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: dimmed ? 0.45 : 1,
        y: 0,
        scale: selected ? 1.02 : 1,
      }}
      transition={{ delay: 0.05 * index, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.985 }}
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative overflow-hidden rounded-[24px] border bg-card text-left transition-shadow duration-500 ${
        selected
          ? "border-primary shadow-[0_24px_70px_hsl(var(--gold)/0.28)]"
          : "border-border hover:border-primary/50 hover:shadow-[0_20px_50px_hsl(0_0%_0%/0.18)]"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={service.image}
          alt={`${service.name} sample frame by Afriframe Studio`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,hsl(240_3%_4%/0.72)_100%)]" />
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
          <Icon className="h-4 w-4" />
        </span>
        {selected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Check className="h-4 w-4" />
          </motion.span>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-display text-2xl text-foreground">{service.name}</h3>
        <p className="mt-2 text-sm italic text-muted-foreground">{service.tagline}</p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Starting from
            </p>
            <p className="numeric text-2xl font-semibold text-primary">${service.price}</p>
            <p className="numeric mt-1 text-xs text-muted-foreground">{service.duration}</p>
          </div>
          <span
            className={`inline-flex h-11 items-center rounded-full px-6 text-sm font-medium transition-colors duration-300 ${
              selected
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground group-hover:border-primary group-hover:text-primary"
            }`}
          >
            {selected ? "Selected" : "Select"}
          </span>
        </div>

        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 group-hover:text-primary group-hover:underline">
          {service.cta}
        </p>
      </div>
    </motion.button>
  );
};

export default ServiceCard;
