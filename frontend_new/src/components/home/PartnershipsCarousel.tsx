import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const partners = [
  { name: 'Harfece Bakliyat', logo: '/assets/images/harfece.png', brand: 'harfece-bakliyat' },
  { name: 'Kalbak Bakliyat', logo: '/assets/images/kalbak.png', brand: 'kalbak-bakliyat' },
  { name: 'Mert Küp Şeker', logo: '/assets/images/mertküpseker.jpg', brand: 'mert-kup-seker' },
  { name: 'Turna Yağ', logo: '/assets/images/turna-logo.png', brand: 'turna-yag' },
  { name: 'Çağdaş Bulgur', logo: '/assets/images/cagdas-bulgur.png', brand: 'cagdas-bulgur' },
  { name: 'Arbel Bulgur', logo: '/assets/images/arbel-bulgur-bakliyat.png', brand: 'arbel-bulgur' },
  { name: 'Türkiye Şeker Fab', logo: '/assets/images/turkseker-logo.webp', brand: 'turkiye-seker' },
  { name: 'Er Mis Salça', logo: '/assets/images/ermis_logo.jpg', brand: 'er-mis-salca' },
  { name: 'Ovella Makarna', logo: '/assets/images/ovella.png', brand: 'ovella-makarna' },
  { name: 'Beypazarı', logo: '/assets/images/beypazarı.png', brand: 'beypazari' },
  { name: 'Çaykur', logo: '/assets/images/caykur-logo.png', brand: 'caykur' },
];

const PartnershipsCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= track.scrollWidth / 2) {
        scrollAmount = 0;
      }
      track.style.transform = `translateX(-${scrollAmount}px)`;
      requestAnimationFrame(scroll);
    };

    const animation = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animation);
  }, []);

  const handlePartnerClick = (brand: string) => {
    navigate(`/products?brand=${brand}`);
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
          <div
            ref={trackRef}
            className="flex gap-8 md:gap-12"
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
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
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

