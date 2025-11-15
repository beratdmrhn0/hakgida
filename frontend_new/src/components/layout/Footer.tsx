import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
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

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/assets/images/hakgida-logo-isimsiz.png"
                alt="Hakgida Logo"
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed">
              Modern teknoloji ve geleneksel lezzetleri bir araya getirerek en kaliteli ürünleri sunuyoruz.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-[#D47800] transition-colors duration-200"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-[#D47800] transition-colors duration-200"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-[#D47800] transition-colors duration-200"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-[#D47800] transition-colors duration-200"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Ürün Kategorileri</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=caylar" className="hover:text-white transition-colors duration-200">Çaylar</Link></li>
              <li><Link to="/products?category=bakliyat" className="hover:text-white transition-colors duration-200">Bakliyat</Link></li>
              <li><Link to="/products?category=bulgur" className="hover:text-white transition-colors duration-200">Bulgur</Link></li>
              <li><Link to="/products?category=baharat" className="hover:text-white transition-colors duration-200">Baharat</Link></li>
              <li><Link to="/products?category=salca" className="hover:text-white transition-colors duration-200">Salça</Link></li>
              <li><Link to="/products?category=makarna" className="hover:text-white transition-colors duration-200">Makarna</Link></li>
              <li><Link to="/products?category=seker" className="hover:text-white transition-colors duration-200">Şeker</Link></li>
              <li><Link to="/products?category=yag" className="hover:text-white transition-colors duration-200">Yağ</Link></li>
              <li><Link to="/products?category=icecek" className="hover:text-white transition-colors duration-200">İçecek</Link></li>
              <li><Link to="/products?category=organik" className="hover:text-white transition-colors duration-200">Organik</Link></li>
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors duration-200">Hakkımızda</Link></li>
              <li><button onClick={() => handleScroll('contact')} className="hover:text-white transition-colors duration-200 text-left">İletişim</button></li>
              <li><Link to="/products" className="hover:text-white transition-colors duration-200">Ürünlerimiz</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-blue-500"></i>
                <span className="text-sm">Kırıkhan/Hatay</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-phone mt-1 text-blue-500"></i>
                <a href="tel:+905332907994" className="text-sm hover:text-white transition-colors duration-200">
                  +90 533 290 79 94
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-envelope mt-1 text-blue-500"></i>
                <a href="mailto:info@hakgida.com" className="text-sm hover:text-white transition-colors duration-200">
                  info@hakgida.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>
            &copy; {currentYear} Hakgida. Tüm hakları saklıdır.
            {' | '}
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">Gizlilik Politikası</Link>
            {' | '}
            <Link to="/quality-policy" className="hover:text-white transition-colors duration-200">Kalite Politikası</Link>
            {' | '}
            <Link to="/kvkk-policy" className="hover:text-white transition-colors duration-200">KVKK Metni</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

