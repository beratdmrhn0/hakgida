import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const slides = [
  {
    image: '/assets/images/harfece-kalbak-urun-resimleri.png',
    title: '',
    subtitle: '',
    description: '',
    buttons: [],
  },
  {
    image: '/assets/images/fabrika-resimleri/resim1.webp',
    title: 'Toptan Gıda Çözüm Ortağınız',
    subtitle: 'Güvenilir Tedarik, Kaliteli Ürünler',
    description: 'Geniş ürün yelpazesi ile işletmenizin ihtiyaç duyduğu tüm gıda ürünlerini tek noktadan temin edebilirsiniz.',
    buttons: [
      { text: 'Ürünlerimiz', link: '/products', primary: true },
      { text: 'Hakkımızda', link: '/about', primary: false },
    ],
  },
  {
    image: '/assets/images/fabrika-resimleri/resim5.webp',
    title: 'Çay, Bakliyat, Makarna ve Daha Fazlası',
    subtitle: 'Geniş Ürün Yelpazesi',
    description: 'Seçkin markalarla çalışıyor, kendi üretimimiz Harfece ve Kalbak bakliyat ürünleri ile hizmet veriyoruz.',
    buttons: [
      { text: 'Ürünleri Keşfet', link: '/products', primary: true },
      { text: 'İletişim', link: '/#contact', primary: false },
    ],
  },
  {
    image: '/assets/images/caykur/resim1.jpg',
    title: 'Kaliteli Markaların Tedarikçisi',
    subtitle: 'Çaykur, Beypazarı, Türk Şeker ve Daha Fazlası',
    description: 'Tanınmış markaların distribütörü olarak, işletmenize güvenilir tedarik sağlıyoruz.',
    buttons: [
      { text: 'Markalarımız', link: '/products', primary: true },
      { text: 'İletişim', link: '/#contact', primary: false },
    ],
  },
  {
    image: '/assets/images/fabrika-resimleri/resim2.webp',
    title: '',
    subtitle: '',
    description: '',
    buttons: [],
  },
  {
    image: '/assets/images/fabrika-resimleri/resim7.webp',
    title: '',
    subtitle: '',
    description: '',
    buttons: [],
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();

  const handleScroll = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide]);

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          {slide.title && (
            <div className="relative z-20 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl text-white animate-fade-in">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl font-semibold mb-4 text-blue-200">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {slide.buttons.map((button, btnIndex) => {
                      // İletişim butonunu özel olarak handle et
                      if (button.text === 'İletişim') {
                        return (
                          <button
                            key={btnIndex}
                            onClick={() => handleScroll('contact')}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                              button.primary
                                ? 'bg-[#D47800] text-white hover:bg-[#B8660A] shadow-lg hover:shadow-xl'
                                : 'bg-white/10 text-white border-2 border-white hover:bg-white hover:text-gray-900 backdrop-blur-sm'
                            }`}
                          >
                            {button.text}
                          </button>
                        );
                      }
                      
                      // Diğer butonlar için Link kullan
                      return (
                        <Link
                          key={btnIndex}
                          to={button.link}
                          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                            button.primary
                              ? 'bg-[#D47800] text-white hover:bg-[#B8660A] shadow-lg hover:shadow-xl'
                              : 'bg-white/10 text-white border-2 border-white hover:bg-white hover:text-gray-900 backdrop-blur-sm'
                          }`}
                        >
                          {button.text}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 flex items-center justify-center group"
        aria-label="Önceki Slide"
      >
        <i className="fas fa-chevron-left group-hover:scale-110 transition-transform"></i>
      </button>
      <button
        onClick={nextSlide}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 flex items-center justify-center group"
        aria-label="Sonraki Slide"
      >
        <i className="fas fa-chevron-right group-hover:scale-110 transition-transform"></i>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-white'
                : 'w-3 h-3 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className={`h-full bg-blue-600 transition-all ${
            isPaused ? 'pause' : ''
          }`}
          style={{
            animation: isPaused ? 'none' : 'progress 5s linear infinite',
            animationDelay: '0s',
          }}
        ></div>
      </div>

      <style>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;

