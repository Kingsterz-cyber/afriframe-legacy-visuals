import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const bookingSteps = [
  "Choose Service",
  "Select Date",
  "Your Details",
  "Review",
  "Confirmed",
];

const BookingProgress = ({ current }: { current: number }) => (
  <nav aria-label="Booking progress" className="w-full">
    <ol className="flex items-center justify-between gap-1 md:gap-3">
      {bookingSteps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 md:gap-3">
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
              <motion.span
                animate={{
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`numeric grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs transition-colors duration-500 md:h-9 md:w-9 ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                      ? "border-primary text-primary shadow-[0_0_0_5px_hsl(var(--gold)/0.12)]"
                      : "border-border text-muted-foreground"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </motion.span>
              <span
                className={`hidden text-[11px] uppercase tracking-[0.18em] transition-colors duration-500 lg:inline ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < bookingSteps.length - 1 && (
              <span className="relative h-px flex-1 overflow-hidden bg-border">
                <motion.span
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 origin-left bg-primary"
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
    <p className="mt-3 text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground lg:hidden">
      Step {current + 1} — {bookingSteps[current]}
    </p>
  </nav>
);

export default BookingProgress;
