import weddingOutdoor from "@/assets/wedding-outdoor.jpg";
import weddingIndoor from "@/assets/wedding-indoor.jpg";
import bridalPortrait from "@/assets/bridal-portrait.jpg";
import graduationPortrait from "@/assets/graduation-portrait.jpg";
import chefPortrait from "@/assets/chef-portrait.jpg";
import fashionPortrait from "@/assets/fashion-portrait.jpg";
import redSuitPink from "@/assets/red-suit-pink.jpg";

export type Experience = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  image: string;
  cta: string;
  kind: "photo" | "film";
};

export const experiences: Experience[] = [
  {
    id: "photography",
    name: "Photography",
    tagline: "Cinematic portraiture for weddings, brands and milestones.",
    price: 120,
    duration: "2 – 4 hours",
    image: fashionPortrait,
    cta: "View sample gallery",
    kind: "photo",
  },
  {
    id: "videography",
    name: "Videography",
    tagline: "Event highlights and cinematic films, graded in-house.",
    price: 350,
    duration: "4 – 8 hours",
    image: redSuitPink,
    cta: "Watch showreel",
    kind: "film",
  },
  {
    id: "wedding-package",
    name: "Wedding Package",
    tagline: "Full-day photo and film coverage with two artists.",
    price: 1200,
    duration: "Full day",
    image: weddingOutdoor,
    cta: "View sample gallery",
    kind: "photo",
  },
  {
    id: "portrait-session",
    name: "Portrait Session",
    tagline: "Studio or location portraiture, styled around you.",
    price: 280,
    duration: "90 minutes",
    image: bridalPortrait,
    cta: "View sample gallery",
    kind: "photo",
  },
  {
    id: "commercial-shoot",
    name: "Commercial Shoot",
    tagline: "Brand and product imagery built for launch day.",
    price: 950,
    duration: "Half day",
    image: chefPortrait,
    cta: "View sample gallery",
    kind: "photo",
  },
  {
    id: "graduation",
    name: "Graduation",
    tagline: "Celebrate the milestone with timeless frames.",
    price: 220,
    duration: "60 minutes",
    image: graduationPortrait,
    cta: "View sample gallery",
    kind: "photo",
  },
  {
    id: "event-coverage",
    name: "Event Coverage",
    tagline: "Atmosphere captured quietly, as it happens.",
    price: 480,
    duration: "3 – 6 hours",
    image: weddingIndoor,
    cta: "Watch showreel",
    kind: "film",
  },
];

export const timeSlots = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:30 PM",
  "04:00 PM",
  "06:00 PM",
];

/** Deterministic mock availability — frontend only. */
export const slotsForDate = (date: Date) => {
  const seed = date.getDate() + date.getMonth();
  return timeSlots.map((time, i) => ({
    time,
    available: (seed + i * 3) % 4 !== 0,
  }));
};

export const isDateBooked = (date: Date) => (date.getDate() + date.getMonth()) % 7 === 3;

export const eventTypes = [
  "Wedding",
  "Portrait",
  "Graduation",
  "Corporate / Brand",
  "Concert or Event",
  "Other",
];
