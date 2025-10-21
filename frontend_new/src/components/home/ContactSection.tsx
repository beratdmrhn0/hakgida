const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            İletişim
          </h2>
          <p className="text-lg text-gray-600">
            Bizimle iletişime geçin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              İletişim Bilgileri
            </h3>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-[#D47800] text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Adres</h4>
                <p className="text-gray-600">
                  Kırıkhan/Hatay - Cumhuriyet, Çevreyolu Cd. No:63, 31440
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-phone text-[#D47800] text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Telefon</h4>
                <a
                  href="tel:+905332907994"
                  className="text-gray-600 hover:text-[#D47800] transition-colors duration-200"
                >
                  +90 533 290 79 94
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-envelope text-[#D47800] text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">E-posta</h4>
                <a
                  href="mailto:info@hakgida.com"
                  className="text-gray-600 hover:text-[#D47800] transition-colors duration-200"
                >
                  info@hakgida.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-clock text-[#D47800] text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Çalışma Saatleri</h4>
                <p className="text-gray-600">
                  Pazartesi - Cumartesi: 08:00 - 17:00
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Contact */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl border-2 border-green-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
                <i className="fab fa-whatsapp text-white text-4xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                WhatsApp ile İletişim
              </h3>
              <p className="text-gray-600">
                WhatsApp üzerinden bize ulaşın, sorularınızı hızla yanıtlayalım
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="https://wa.me/905554443322?text=Merhaba%20Hakgida%2C%20ürünleriniz%20hakkında%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 text-white py-4 px-6 rounded-lg font-semibold text-center hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp'ta Sohbet Et
              </a>
              <a
                href="tel:+905554443322"
                className="block w-full bg-white text-gray-900 py-4 px-6 rounded-lg font-semibold text-center hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
              >
                <i className="fas fa-phone mr-2"></i>
                Hemen Ara
              </a>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block bg-white p-4 rounded-lg shadow-md">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/905554443322?text=Merhaba%20Hakgida%2C%20ürünleriniz%20hakkında%20bilgi%20almak%20istiyorum."
                  alt="WhatsApp QR Kodu"
                  className="w-32 h-32"
                />
                <p className="text-sm text-gray-600 mt-3">
                  QR kodu tarayarak WhatsApp'ta bize ulaşabilirsiniz
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

