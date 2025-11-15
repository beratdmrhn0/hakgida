import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating to a different page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleScroll = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-[rgba(212,120,0,0.98)] border-[rgba(212,120,0,0.9)]' 
          : 'bg-[rgba(212,120,0,0.963)] border-[rgba(212,120,0,0.8)]'
      } backdrop-blur-[20px]`}
      style={{
        boxShadow: isScrolled 
          ? '0 6px 25px rgba(212, 120, 0, 0.5), 0 4px 12px rgba(212, 120, 0, 0.3)'
          : '0 20px 40px rgba(212, 120, 0, 0.931), 0 2px 8px rgba(212, 120, 0, 0.2)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-32">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/assets/images/hakgida-logo-isimsiz.png" 
              alt="Hakgida Logo" 
              className="h-[220px] md:h-56 sm:h-[180px] max-sm:h-[160px] w-auto max-w-[500px] object-contain transition-all duration-300 group-hover:scale-105 brightness-0 invert mr-4"
              style={{
                filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
                imageRendering: 'crisp-edges'
              }}
            />
            <div className="flex flex-col items-start justify-center -ml-[1.25cm] md:-ml-[1.25cm] sm:-ml-[0.8cm] max-sm:-ml-[0.6cm]">
              <div 
                className="text-[3rem] md:text-[3rem] sm:text-[1.5rem] max-sm:text-[1.25rem] font-black text-white leading-[0.9] tracking-wider"
                style={{
                  textShadow: '0 1px 0 rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.28), 0 8px 18px rgba(0, 0, 0, 0.20)',
                  WebkitTextStroke: '0.6px rgba(0, 0, 0, 0.25)',
                  fontWeight: '1000'
                }}
              >
                HAK
              </div>
              <div 
                className="text-[3rem] md:text-[3rem] sm:text-[1.5rem] max-sm:text-[1.25rem] font-black text-white leading-[0.9] tracking-wider"
                style={{
                  textShadow: '0 1px 0 rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.28), 0 8px 18px rgba(0, 0, 0, 0.20)',
                  WebkitTextStroke: '0.6px rgba(0, 0, 0, 0.25)',
                  fontWeight: '1000'
                }}
              >
                GIDA
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <Link 
                to="/" 
                className={`text-[1.275rem] font-semibold transition-all duration-200 hover:scale-105 ${
                  location.pathname === '/' 
                    ? 'text-white drop-shadow-md' 
                    : 'text-white/90 hover:text-white hover:drop-shadow-md'
                }`}
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
              >
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                className={`text-[1.275rem] font-semibold transition-all duration-200 hover:scale-105 ${
                  location.pathname.startsWith('/product') 
                    ? 'text-white drop-shadow-md' 
                    : 'text-white/90 hover:text-white hover:drop-shadow-md'
                }`}
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
              >
                Ürünler
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`text-[1.275rem] font-semibold transition-all duration-200 hover:scale-105 ${
                  location.pathname === '/about' 
                    ? 'text-white drop-shadow-md' 
                    : 'text-white/90 hover:text-white hover:drop-shadow-md'
                }`}
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <button
                onClick={() => handleScroll('contact')}
                className="text-[1.275rem] font-semibold text-white/90 hover:text-white hover:drop-shadow-md transition-all duration-200 hover:scale-105"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
              >
                İletişim
              </button>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
            aria-expanded="false"
          >
            <span className="sr-only">Menüyü aç</span>
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></span>
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></span>
            </div>
          </button>
        </div>
      </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[rgba(212,120,0,0.95)] backdrop-blur-sm border-t border-[rgba(212,120,0,0.8)] shadow-lg">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-[1.275rem] font-semibold ${
              location.pathname === '/'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            Ana Sayfa
          </Link>
          <Link
            to="/products"
            className={`block px-3 py-2 rounded-md text-[1.275rem] font-semibold ${
              location.pathname.startsWith('/product')
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            Ürünler
          </Link>
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md text-[1.275rem] font-semibold ${
              location.pathname === '/about'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            Hakkımızda
          </Link>
          <button
            onClick={() => handleScroll('contact')}
            className="block w-full text-left px-3 py-2 rounded-md text-[1.275rem] font-semibold text-white/90 hover:bg-white/10 hover:text-white"
          >
            İletişim
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

