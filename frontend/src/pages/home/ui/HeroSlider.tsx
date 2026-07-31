import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: (
      <>
        Yeni Teknoloji,
        <br />
        Yeni Heyecan
      </>
    ),
    desc: "Akıllı telefonlardan dizüstü bilgisayarlara en yeni ürünler NovaStore'da.",
    buttonText: "İncele",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80",
    link: "/search?category=cat-1"
  },
  {
    id: 2,
    title: (
      <>
        Giyimde Tarzınızı
        <br />
        Yansıtın
      </>
    ),
    desc: "En trend giyim ürünleri ve aksesuarlarla modayı yakından takip edin.",
    buttonText: "Keşfet",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&auto=format&fit=crop&q=80",
    link: "/search?category=cat-2"
  },
  {
    id: 3,
    title: (
      <>
        Evinize Şıklık
        <br />
        Katın
      </>
    ),
    desc: "Modern tasarımlı mobilyalar ve dekorasyon ürünleriyle yaşam alanınızı yenileyin.",
    buttonText: "Alışverişe Başla",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&auto=format&fit=crop&q=80",
    link: "/search?category=cat-3"
  }
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleButtonClick = () => {
    navigate(slides[currentSlide].link);
  };

  return (
    <section className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-[#030712] shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <img
            src={slides[currentSlide].image}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
            >
              {slides[currentSlide].title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm md:text-base text-gray-200 mb-8 max-w-md"
            >
              {slides[currentSlide].desc}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button
                onClick={handleButtonClick}
                className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-lg active:scale-95 cursor-pointer z-20"
              >
                {slides[currentSlide].buttonText}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LEFT & RIGHT NAVIGATION ARROWS */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/10 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Önceki Slayt"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/10 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Sonraki Slayt"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slider Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === idx 
                ? 'w-6 h-2 bg-[#2563EB] ring-2 ring-[#2563EB] ring-offset-2 ring-offset-black/50' 
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
