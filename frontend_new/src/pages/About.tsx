const About = () => {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-[rgba(212,120,0,0.963)] text-white py-16 backdrop-blur-[20px]" style={{
        boxShadow: '0 20px 40px rgba(212, 120, 0, 0.931), 0 2px 8px rgba(212, 120, 0, 0.2)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl text-orange-100">
            Hakgida'nın hikayesi, misyonu ve vizyonu
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Hakkımızda</h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
             
            
            </div>

            {/* Values Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-orange-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-[#D47800] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bullseye text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Misyonumuz</h3>
                <p className="text-gray-600">
                  Kaliteli ürünlerle müşteri memnuniyetini en üst seviyede tutmak
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-eye text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Vizyonumuz</h3>
                <p className="text-gray-600">
                  Sektörde lider konumda, yenilikçi ve güvenilir bir marka olmak
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Değerlerimiz</h3>
                <p className="text-gray-600">
                  Dürüstlük, kalite, müşteri odaklılık ve sürekli gelişim
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

