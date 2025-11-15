
const PrivacyPolicy = () => {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-[rgba(212,120,0,0.963)] text-white py-16 backdrop-blur-[20px]" style={{
        boxShadow: '0 20px 40px rgba(212, 120, 0, 0.931), 0 2px 8px rgba(212, 120, 0, 0.2)'
      }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-xl opacity-90">Hakgida'nın gizlilik ve telif hakları yaklaşımı</p>
        </div>
      </section>

      {/* Content */}
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Hakgida bu sitenin ve sitedeki tüm materyallerin sahibidir.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Hakgida web sitesinin tüm içeriğinde yer alan bilgiler, grafikler, logolar, resimler, şekiller, teknik ve bilimsel çizimler, yazılımlar, dış görünüm, dizayn, sistem ve teknik unsurlar, yorum ve tavsiyeler ile buradan yapılan tüm bağlantılar yalnızca kullanıcıya bilgi vermek amacıyla sunulmuştur. Endüstriyel tasarım da dahil ancak bunlarla sınırlı olmamak üzere, bunlara bağlı telif ve her türlü haklar Hakgida'ya aittir ve yürürlükteki tüm T.C. mevzuatı ile uluslararası telif hakkı ve marka yasaları ile uluslararası sözleşmeler kapsamında korunmaktadır.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Hakgida, internette yer alan web sitesindeki bilgilerin güncel ve doğru olması için makul tüm gayreti göstermiştir. Sitede yer alan bilgilerin revizesi ya da düzeltilmesi ile ilgili olarak Hakgida önceden haber vermeksizin, dilediği zaman sitedeki bilgileri revize etme, değiştirme, düzeltme veya kaldırma yetkisine sahiptir. Bu sitede kullanılan bazı ifadeler ileriye dönük olarak hazırlanmış olabileceğinden, çeşitli risk ve belirsizlikler içerebilir. Muhtelif nedenlerden dolayı gerçek sonuç ve gelişmeler, bu ifadelerde belirtilen veya ima edilenlerden somut biçimde farklı olabilir.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Kullanıcılar bilgi ve dokümanları yalnızca bilgi edinmek amacıyla kullanabilir. Yukarıda sayılan unsurların Hakgida'nın yazılı izni olmaksızın kısmen veya tamamen; doğrudan veya dolaylı olarak, aynen ya da farklı bir biçimde kullanılması, iktibası, kopyalanması, çoğaltılması, değiştirilmesi, depolanması, başka bir bilgisayara yüklenmesi, postalanması, dağıtılması, nakledilmesi, tekrar yayınlanması, teşhir edilmesi, uyarlanması, işlenmesi, temsili, ticari amaçla elde bulundurulması ve satılması veya bu fiillerin teşvik edilmesi ya da yapılmasının kolaylaştırılması yasaktır. Bu site veya herhangi bir parçasının kopyalanması, satılması veya ticari amaçla istismar edilmesi yasaktır.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Bu sitede yer alan herhangi bir bilgiyi herhangi bir şekilde tahrif etmek; her türlü cezai ve hukuki takibata neden olacaktır.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Sitede yer alan bilgilerin çeşitli nedenlerle güncel olmaması; revizelerde gecikme, sitede olası yanlışlık veya eksiklik ya da değişikliklerden ötürü Hakgida hiçbir nam altında sorumluluk üstlenmez. Güncellemeye ilişkin tarih bulunması, aksi belirtilmedikçe Hakgida'yı herhangi bir yükümlülük altına sokmaz.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Site ve içeriğindeki bilgilerin kullanımından doğabilecek ihtilaflarda Türkçe metin esas alınır ve böyle bir durumda Hakgida tüm yasal haklarını kullanacağını taahhüt eder.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              İletişim: <a href="mailto:info@hakgida.com" className="text-[#D47800] hover:text-[#B8660A] transition-colors">info@hakgida.com</a> | <a href="/#contact" className="text-[#D47800] hover:text-[#B8660A] transition-colors">iletişim sayfası</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
