import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

type Props = {
  value?: Date;
  onSelect: (d: Date) => void;
  isBooked?: (d: Date) => boolean;
};

const LuxuryCalendar = ({ value, onSelect, isBooked }: Props) => {
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(
    new Date((value ?? today).getFullYear(), (value ?? today).getMonth(), 1)
  );
  const [dir, setDir] = useState(1);

  const move = (delta: number) => {
    setDir(delta);
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  };

  const firstWeekday = cursor.getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)
    ),
  ];

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="lux-card w-full max-w-[440px] p-5 md:p-7" role="group" aria-label="Booking calendar">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous month"
          className="grid h-10 w-10 place-items-center rounded-full border border-border transition-all duration-300 hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={monthLabel}
              initial={{ opacity: 0, y: dir * 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dir * -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-lg text-foreground"
            >
              {monthLabel}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next month"
          className="grid h-10 w-10 place-items-center rounded-full border border-border transition-all duration-300 hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {w}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthLabel}
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-7 gap-1"
        >
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const past = d < today;
            const booked = !past && (isBooked?.(d) ?? false);
            const disabled = past || booked;
            const selected = value && startOfDay(value).getTime() === d.getTime();
            const isToday = d.getTime() === today.getTime();

            return (
              <motion.button
                key={d.toISOString()}
                type="button"
                disabled={disabled}
                whileHover={disabled ? undefined : { scale: 1.08 }}
                whileTap={disabled ? undefined : { scale: 0.94 }}
                onClick={() => onSelect(d)}
                aria-label={d.toDateString() + (booked ? " (fully booked)" : "")}
                aria-pressed={selected}
                className={`numeric relative aspect-square rounded-xl border text-sm transition-colors duration-300 ${
                  selected
                    ? "border-primary bg-primary font-semibold text-primary-foreground shadow-[0_10px_28px_hsl(var(--gold)/0.35)]"
                    : past
                      ? "border-transparent text-muted-foreground/35"
                      : booked
                        ? "border-transparent bg-muted text-muted-foreground/60 line-through"
                        : "border-primary/25 text-foreground hover:border-primary hover:bg-primary/10"
                } ${isToday && !selected ? "ring-1 ring-primary/60" : ""}`}
              >
                {d.getDate()}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md border border-primary/50" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-primary" /> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-muted" /> Booked
        </span>
      </div>
    </div>
  );
};

export default LuxuryCalendar;
