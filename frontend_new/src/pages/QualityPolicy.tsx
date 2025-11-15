import React from 'react';

const QualityPolicy = () => {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-[rgba(212,120,0,0.963)] text-white py-16 backdrop-blur-[20px]" style={{
        boxShadow: '0 20px 40px rgba(212, 120, 0, 0.931), 0 2px 8px rgba(212, 120, 0, 0.2)'
      }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kalite Politikamız</h1>
          <p className="text-xl opacity-90">Kalite standartlarımız, politikalarımız ve taahhütlerimiz</p>
        </div>
      </section>

      {/* Content */}
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#D47800] mt-8 mb-4">Kapsamımız</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Entegre Yönetim Sistemleri olarak; <strong>BRC Food, FSSC 22000, ISO 9001</strong> Kalite Yönetim Sistemi, <strong>ISO 22000</strong> Gıda Güvenliği Yönetim Sistemi, <strong>ISO 14001</strong> Çevre Yönetim Sistemi ve İş Sağlığı ve Güvenliği uygulamalarını kapsar. Sistem; üretimden sevkiyata, depolama ve dağıtıma kadar tüm süreçlerdeki ticari ürünleri kapsar.
            </p>

            <h2 className="text-2xl font-bold text-[#D47800] mt-8 mb-4">Vizyonumuz &amp; Misyonumuz</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Markalarımızı sürekli gelişim gösteren, yenilikçi ve katılımcı bir anlayışla büyütmeyi hedefliyoruz. Müşteri memnuniyetini temel hedef kabul ediyor; kalite ve gıda güvenliğini artırmak için bilimi ve teknolojideki gelişmeleri yakından takip ediyoruz.
            </p>

            <h2 className="text-2xl font-bold text-[#D47800] mt-8 mb-4">Politikamız</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Ürün güvenilirliğini sürekli izler, lezzet ve kalite dengesini koruruz.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Potansiyel tehlikeleri tespit eder, kritik kontrol noktalarını etkin biçimde yönetiriz.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Yasal ve müşteri şartlarını eksiksiz karşılamayı taahhüt ederiz.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Bilimsel/teknolojik gelişmeleri izler, yenilikleri süreçlerimize dahil ederiz.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Sürdürülebilir yönetim anlayışıyla kaliteyi kurum kültürü haline getiririz.</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#D47800] mt-8 mb-4">Taahhütlerimiz</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Yasal şartlara ve müşteri beklentilerine tam uyum.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Ürün güvenliği risklerini azaltmaya yönelik proaktif yaklaşım ve sürekli iyileştirme.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Çalışan sağlığı ve güvenliği için gerekli tüm tedbirlerin alınması.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Kaliteli hammadde temini, izlenebilirlik ve şeffaf tedarik zinciri yönetimi.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Doğaya ve topluma saygılı üretim; kaynakların verimli kullanımı.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#D47800] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 leading-relaxed">Ulusal/uluslararası standartlarla tam uyum ve bağımsız denetimlerle doğrulama.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QualityPolicy;
