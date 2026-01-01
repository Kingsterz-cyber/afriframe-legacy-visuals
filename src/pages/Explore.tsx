import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const portraitGallery = [
  { id: 1, image: fashionPortrait, title: "Editorial Portrait", category: "Fashion" },
  { id: 2, image: redDressRose, title: "Romantic Elegance", category: "Creative" },
  { id: 3, image: graduationPortrait, title: "Milestone Achievement", category: "Lifestyle" },
  { id: 4, image: blueHatFashion, title: "Bold Fashion", category: "Fashion" },
  { id: 5, image: mysteryHat, title: "Artistic Mystery", category: "Creative" },
  { id: 6, image: lifestylePortrait, title: "Natural Beauty", category: "Lifestyle" },
  { id: 7, image: chefPortrait, title: "Culinary Artist", category: "Commercial" },
  { id: 8, image: bridalPortrait, title: "Radiant Bride", category: "Bridal" },
  { id: 9, image: redSuitPink, title: "Power & Style", category: "Fashion" },
  { id: 10, image: fashionJewelry, title: "Luxury Accessories", category: "Commercial" },
  { id: 11, image: weddingOutdoor, title: "Golden Hour", category: "Weddings" },
  { id: 12, image: weddingIndoor, title: "Elegant Reception", category: "Weddings" },
];

const videoShowcase = [
  { id: 1, src: cinematic1, title: "Wedding Film", description: "Cinematic love story captured in motion" },
  { id: 2, src: cinematic2, title: "Fashion Reel", description: "Dynamic editorial videography" },
  { id: 3, src: cinematic3, title: "Brand Story", description: "Commercial storytelling at its finest" },
];

const Explore = () => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const handleVideoHover = (id: number, isHovering: boolean) => {
    setHoveredVideo(isHovering ? id : null);
    const video = videoRefs.current[id];
    if (video) {
      if (isHovering) {
        video.play();
      } else if (activeVideo !== id) {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  const toggleVideoPlay = (id: number) => {
    const video = videoRefs.current[id];
    if (video) {
      if (activeVideo === id) {
        video.pause();
        setActiveVideo(null);
      } else {
        // Pause any currently playing video
        Object.values(videoRefs.current).forEach(v => v?.pause());
        video.play();
        setActiveVideo(id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="max-w-3xl animate-fade-in">
            <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">
              Explore Our Work
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Portraits & <br />
              <span className="text-primary">Videography</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover the artistry behind every frame. From intimate portraits to cinematic 
              videography, explore Afriframe's creative portfolio.
            </p>
          </div>
        </div>
      </header>

      {/* Portrait Gallery Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">
              Portrait Gallery
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Premium Photography</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each portrait tells a unique story, capturing the essence and personality of every subject.
            </p>
          </div>

          {/* Masonry-style Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {portraitGallery.map((item, index) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer animate-fade-in ${
                  index % 5 === 0 ? "md:row-span-2" : ""
                }`}
                style={{ 
                  animationDelay: `${0.1 + index * 0.05}s`,
                  aspectRatio: index % 5 === 0 ? "3/4" : "1/1"
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold mt-1">{item.title}</h3>
                  </div>
                </div>

                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videography Section */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">
              Videography
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cinematic Motion</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience our cinematic approach to storytelling through motion. Hover or tap to preview.
            </p>
          </div>

          {/* Interactive Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {videoShowcase.map((video, index) => (
              <div
                key={video.id}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                onMouseEnter={() => handleVideoHover(video.id, true)}
                onMouseLeave={() => handleVideoHover(video.id, false)}
              >
                {/* Rotating Video Card */}
                <div
                  className={`relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-700 ease-out cursor-pointer ${
                    hoveredVideo === video.id || activeVideo === video.id
                      ? "transform-gpu rotate-y-0 scale-105 shadow-2xl shadow-primary/20"
                      : "transform-gpu rotate-y-6 hover:rotate-y-0"
                  }`}
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                    transform: hoveredVideo === video.id || activeVideo === video.id 
                      ? "rotateY(0deg) scale(1.05)" 
                      : `rotateY(${index % 2 === 0 ? "-6" : "6"}deg)`,
                  }}
                  onClick={() => toggleVideoPlay(video.id)}
                >
                  <video
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    src={video.src}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                  />

                  {/* Play/Pause Overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredVideo === video.id ? "opacity-100" : "opacity-0"
                  }`}>
                    <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-primary/30 transition-transform duration-300 hover:scale-110">
                      {activeVideo === video.id ? (
                        <Pause className="w-6 h-6 text-primary" />
                      ) : (
                        <Play className="w-6 h-6 text-primary ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold mb-1">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>

                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-500 ${
                    hoveredVideo === video.id || activeVideo === video.id
                      ? "border-primary/50 shadow-lg shadow-primary/20"
                      : "border-transparent"
                  }`} />
                </div>

                {/* Reflection Effect */}
                <div 
                  className="absolute -bottom-4 left-4 right-4 h-20 rounded-3xl opacity-20 blur-xl transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(to bottom, hsl(var(--primary) / 0.3), transparent)",
                    opacity: hoveredVideo === video.id ? 0.4 : 0.2
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create <span className="text-primary">Your Story</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's bring your vision to life with stunning visuals that capture every moment.
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
