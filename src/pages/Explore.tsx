import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumVideoPlayer } from "@/components/ui/premium-video-player";
import { CollectionSection } from "@/components/portfolio/collection-section";
import { CategoryFilters } from "@/components/portfolio/category-filters";

// Portrait images
import weddingOutdoor from "@/assets/wedding-outdoor.jpg";
import weddingIndoor from "@/assets/wedding-indoor.jpg";
import chefPortrait from "@/assets/chef-portrait.jpg";
import fashionPortrait from "@/assets/fashion-portrait.jpg";
import fashionJewelry from "@/assets/fashion-jewelry.jpg";
import redDressRose from "@/assets/red-dress-rose.jpg";
import graduationPortrait from "@/assets/graduation-portrait.jpg";
import blueHatFashion from "@/assets/blue-hat-fashion.jpg";
import redSuitPink from "@/assets/red-suit-pink.jpg";
import mysteryHat from "@/assets/mystery-hat.jpg";
import bridalPortrait from "@/assets/bridal-portrait.jpg";
import lifestylePortrait from "@/assets/lifestyle-portrait.jpg";

// Videos
import cinematic1 from "@/assets/videos/cinematic-1.mov";
import cinematic2 from "@/assets/videos/cinematic-2.mov";
import cinematic3 from "@/assets/videos/cinematic-3.mov";

// Curated collections with supporting images
const curatedCollections = [
  {
    title: "Weddings",
    category: "Weddings",
    description: "Timeless moments of love and celebration captured with cinematic precision. Every frame tells the story of two souls coming together.",
    frameCount: 48,
    featuredImage: weddingOutdoor,
    supportingImages: [
      { src: weddingIndoor, title: "Elegant Reception", size: "medium" as const },
      { src: bridalPortrait, title: "Radiant Bride", size: "small" as const },
      { src: redDressRose, title: "Romantic Details", size: "small" as const },
    ],
  },
  {
    title: "Fashion & Editorial",
    category: "Fashion",
    description: "Bold, artistic, and captivating fashion photography that celebrates style and personality. Our editorial work pushes creative boundaries.",
    frameCount: 52,
    featuredImage: fashionPortrait,
    supportingImages: [
      { src: blueHatFashion, title: "Bold Vision", size: "large" as const },
      { src: fashionJewelry, title: "Luxury Details", size: "small" as const },
      { src: redSuitPink, title: "Power & Elegance", size: "small" as const },
    ],
  },
  {
    title: "Lifestyle & Portraits",
    category: "Lifestyle",
    description: "Authentic moments that reveal the essence of life. From personal milestones to everyday beauty, we capture what makes each person unique.",
    frameCount: 35,
    featuredImage: lifestylePortrait,
    supportingImages: [
      { src: graduationPortrait, title: "Milestone Achievement", size: "medium" as const },
      { src: mysteryHat, title: "Artistic Mystery", size: "small" as const },
      { src: chefPortrait, title: "Professional Pride", size: "small" as const },
    ],
  },
];

const videoShowcase = [
  { id: 1, src: cinematic1, title: "Timeless Love Stories", description: "Cinematic wedding films that capture emotion and grace" },
  { id: 2, src: cinematic2, title: "Fashion in Motion", description: "Dynamic editorial videography that brings style to life" },
  { id: 3, src: cinematic3, title: "Brand Narratives", description: "Commercial storytelling that resonates and inspires" },
];

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCollections = 
    activeCategory === "All"
      ? curatedCollections
      : curatedCollections.filter(c => c.category === activeCategory);

  const categories = [...new Set(curatedCollections.map(c => c.category))];

  const handleViewCollection = () => {
    // Placeholder for collection view action
    console.log("View collection clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Editorial Hero Section */}
      <section className="py-32 md:py-48 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <span className="eyebrow mb-6 block">Portfolio</span>
            <h1 className="display mb-8">Explore Our Creative Work</h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
              A curated collection of our finest cinematic moments. From intimate celebrations to bold editorial visions, each frame is a testament to our craft.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const element = document.getElementById("collections");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
              >
                View All Collections
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <Link to="/booking">
                <button className="px-8 py-4 border border-primary/30 text-foreground rounded-full hover:bg-primary/10 transition-all duration-300 font-semibold">
                  Start Your Project
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Video Showreel */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="eyebrow mb-4 block">Featured Showreel</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cinematic Excellence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Experience our videography at its finest. A celebration of motion, emotion, and storytelling.
            </p>
          </div>

          {/* Premium Video Player */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <PremiumVideoPlayer
              src={videoShowcase[0].src}
              title={videoShowcase[0].title}
              description={videoShowcase[0].description}
              className="max-w-5xl mx-auto"
            />
          </div>

          {/* Additional Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {videoShowcase.slice(1).map((video, index) => (
              <div
                key={video.id}
                className="group rounded-2xl overflow-hidden animate-fade-in"
                style={{ 
                  aspectRatio: "16/9",
                  animationDelay: `${0.3 + (index + 1) * 0.1}s` 
                }}
              >
                <div className="relative w-full h-full">
                  <video
                    src={video.src}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2">{video.title}</h3>
                    <p className="text-muted-foreground">{video.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="mb-24 animate-fade-in">
            <CategoryFilters
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              className="mb-16"
            />
          </div>

          {/* Curated Collections */}
          <div className="space-y-0">
            {filteredCollections.map((collection, index) => (
              <CollectionSection
                key={collection.title}
                title={collection.title}
                category={collection.category}
                description={collection.description}
                frameCount={collection.frameCount}
                featuredImage={collection.featuredImage}
                supportingImages={collection.supportingImages}
                onViewCollection={handleViewCollection}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 md:py-32 bg-secondary/50 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: "500+", label: "Projects Delivered" },
              { number: "12+", label: "Years of Excellence" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "25+", label: "Awards & Recognition" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <p className="text-muted-foreground text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 md:py-48 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="display mb-8">Ready to Create Something Extraordinary?</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Let's collaborate to bring your vision to life with cinematic excellence and artistic vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full">
                  Book a Session
                </Button>
              </Link>
              <Link to="/#contact">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-primary/30 hover:bg-primary/10">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Afriframe Pictures. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Explore;
