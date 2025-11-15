import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const partners = [
  { name: 'Harfece Bakliyat', logo: '/assets/images/harfece.png', brand: 'Harfece' },
  { name: 'Kalbak Bakliyat', logo: '/assets/images/kalbak.png', brand: 'Kalbak' },
  { name: 'Mert Küp Şeker', logo: '/assets/images/mgs-logo.jpg', brand: 'MGS' },
  { name: 'Turna Yağ', logo: '/assets/images/turna-logo.png', brand: 'Turna' },
  { name: 'Çağdaş Bulgur', logo: '/assets/images/cagdas-bulgur.png', brand: 'Çağdaş Bulgur' },
  { name: 'Arbel Bulgur', logo: '/assets/images/arbel-bulgur-bakliyat.png', brand: 'Arbel Bulgur' },
  { name: 'Türkiye Şeker Fab', logo: '/assets/images/turkseker-logo.webp', brand: 'Türk Şeker' },
  { name: 'ER MİS Salça', logo: '/assets/images/ermis_logo.jpg', brand: 'ER MİS' },
  { name: 'Ovella Makarna', logo: '/assets/images/ovella.png', brand: 'Ovella' },
  { name: 'Beypazarı', logo: '/assets/images/beypazarı.png', brand: 'Beypazarı' },
  { name: 'Çaykur', logo: '/assets/images/caykur-logo.png', brand: 'Çaykur' },
];

const PartnershipsCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const itemWidth = 192; // w-40 + gap-8 = 160 + 32 = 192px

  useEffect(() => {
    if (!isAutoScrolling) return;
    
    const track = trackRef.current;
    if (!track) return;

    const scrollSpeed = 1.2; // Kaydırma Hızı 

    const scroll = () => {
      setScrollAmount(prev => {
        const newAmount = prev + scrollSpeed;
        if (newAmount >= track.scrollWidth / 2) {
          return 0;
        }
        return newAmount;
      });
      requestAnimationFrame(scroll);
    };

    const animation = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animation);
  }, [isAutoScrolling]);

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.style.transform = `translateX(-${scrollAmount}px)`;
    }
  }, [scrollAmount]);

  const handlePartnerClick = (brand: string) => {
    navigate(`/products?brand=${brand}`);
  };

  const smoothScrollTo = (targetAmount: number) => {
    const track = trackRef.current;
    if (!track || isAnimating) return;

    setIsAnimating(true);
    const startAmount = scrollAmount;
    const distance = targetAmount - startAmount;
    const duration = 500; // 500ms animasyon süresi
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAmount = startAmount + (distance * easeOut);
      
      setScrollAmount(currentAmount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const scrollLeft = () => {
    setIsAutoScrolling(false);
    const track = trackRef.current;
    if (!track) return;
    
    const currentScroll = scrollAmount;
    const newScroll = Math.max(0, currentScroll - itemWidth);
    smoothScrollTo(newScroll);
    
    // 3 saniye sonra otomatik kaydırmaya devam et
    setTimeout(() => setIsAutoScrolling(true), 3000);
  };

  const scrollRight = () => {
    setIsAutoScrolling(false);
    const track = trackRef.current;
    if (!track) return;
    
    const currentScroll = scrollAmount;
    const maxScroll = track.scrollWidth / 2;
    const newScroll = currentScroll + itemWidth >= maxScroll ? 0 : currentScroll + itemWidth;
    smoothScrollTo(newScroll);
    
    // 3 saniye sonra otomatik kaydırmaya devam et
    setTimeout(() => setIsAutoScrolling(true), 3000);
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            İş Birliklerimiz
          </h2>
          <p className="text-lg text-gray-600">
            Güvenilir markalarla birlikte çalışıyoruz
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-[#D47800] hover:bg-[#D47800] hover:text-white group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Önceki"
          >
            <i className="fas fa-chevron-left text-lg group-hover:scale-110 transition-transform"></i>
          </button>
          
          <button
            onClick={scrollRight}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-[#D47800] hover:bg-[#D47800] hover:text-white group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sonraki"
          >
            <i className="fas fa-chevron-right text-lg group-hover:scale-110 transition-transform"></i>
          </button>

          <div
            ref={trackRef}
            className="flex gap-8 md:gap-12 px-16 transition-transform duration-500 ease-out"
            style={{ width: 'fit-content' }}
          >
            {/* Duplicate partners for seamless loop */}
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                onClick={() => handlePartnerClick(partner.brand)}
                className="flex-shrink-0 w-32 md:w-40 h-24 md:h-28 flex items-center justify-center bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group p-4"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <p className="text-center mt-8 text-sm text-gray-500">
          Marka logolarına tıklayarak ürünleri görüntüleyebilirsiniz
        </p>
      </div>
    </section>
  );
};

export default PartnershipsCarousel;

