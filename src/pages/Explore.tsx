import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, X, RotateCcw, RotateCw } from "lucide-react";
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
  const [modalVideo, setModalVideo] = useState<typeof videoShowcase[0] | null>(null);
  const [modalRotation, setModalRotation] = useState(0);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

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

  const openVideoModal = (video: typeof videoShowcase[0]) => {
    setModalVideo(video);
    setModalRotation(0);
    // Pause all grid videos
    Object.values(videoRefs.current).forEach(v => v?.pause());
    setActiveVideo(null);
  };

  const closeVideoModal = () => {
    setModalVideo(null);
    setModalRotation(0);
  };

  const rotateVideo = (direction: 'left' | 'right') => {
    setModalRotation(prev => prev + (direction === 'left' ? -15 : 15));
  };

  const toggleModalVideoPlay = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play();
      } else {
        modalVideoRef.current.pause();
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-3xl mx-auto px-2">
            {videoShowcase.map((video, index) => (
              <div
                key={video.id}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                onMouseEnter={() => handleVideoHover(video.id, true)}
                onMouseLeave={() => handleVideoHover(video.id, false)}
              >
                {/* Video Card */}
                <div
                  className={`relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-700 ease-out cursor-pointer ${
                    hoveredVideo === video.id
                      ? "scale-105 shadow-2xl shadow-primary/20"
                      : ""
                  }`}
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                    transform: hoveredVideo === video.id
                      ? "rotateY(0deg) scale(1.05)" 
                      : `rotateY(${index % 2 === 0 ? "-4" : "4"}deg)`,
                  }}
                  onClick={() => openVideoModal(video)}
                >
                  <video
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    src={video.src}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                  />

                  {/* Play Overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredVideo === video.id ? "opacity-100" : "opacity-0"
                  }`}>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 text-primary ml-0.5" />
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold mb-0.5">{video.title}</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">{video.description}</p>
                  </div>

                  {/* Border Glow */}
                  <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border-2 transition-all duration-500 ${
                    hoveredVideo === video.id
                      ? "border-primary/50 shadow-lg shadow-primary/20"
                      : "border-transparent"
                  }`} />
                </div>
              </div>
            ))}
          </div>

          {/* Video Modal */}
          {modalVideo && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in"
              onClick={closeVideoModal}
            >
              <div 
                className="relative max-w-lg w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[40vw]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeVideoModal}
                  className="absolute -top-12 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Rotate Controls */}
                <div className="absolute -top-12 left-0 flex gap-2 z-10">
                  <button
                    onClick={() => rotateVideo('left')}
                    className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => rotateVideo('right')}
                    className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>

                {/* Video Container with Rotation */}
                <div
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-primary/30 transition-transform duration-500 ease-out"
                  style={{
                    transform: `perspective(1000px) rotateY(${modalRotation}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <video
                    ref={modalVideoRef}
                    src={modalVideo.src}
                    className="w-full h-full object-cover"
                    loop
                    autoPlay
                    playsInline
                    onClick={toggleModalVideoPlay}
                  />

                  {/* Play/Pause Overlay */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={toggleModalVideoPlay}
                  >
                    <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                      <Play className="w-6 h-6 text-primary ml-1" />
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                    <h3 className="text-xl font-bold mb-1">{modalVideo.title}</h3>
                    <p className="text-sm text-muted-foreground">{modalVideo.description}</p>
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary/30" />
                </div>

                {/* Reflection */}
                <div 
                  className="absolute -bottom-6 left-4 right-4 h-16 rounded-2xl opacity-30 blur-xl"
                  style={{
                    background: "linear-gradient(to bottom, hsl(var(--primary) / 0.4), transparent)",
                  }}
                />
              </div>
            </div>
          )}
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
