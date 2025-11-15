import { Link } from 'react-router-dom';

const AboutPreview = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hakkımızda
          </h2>
          <p className="text-lg text-gray-600">
            Hakgida olarak misyonumuz ve vizyonumuz
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Bizim Hikayemiz
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Hakgida, 2010 yılında kurulan ve gıda sektöründe teknoloji ile kaliteyi buluşturan öncü bir firmadır. 
              İnovatif yaklaşımımız ve geleneksel lezzetlerimizle müşteri memnuniyetini ön planda tutmaktayız.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Modern üretim tesislerimizde baklagil ürünlerinin üretimini yapıp kaliteli ürünlerin 
              toptan satış yapmaktayız. 
            </p>
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-3 bg-[#D47800] text-white rounded-lg font-semibold hover:bg-[#B8660A] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Devamını Oku
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/images/hakgida-duvar.jpeg"
                alt="Hakgida Üretim Duvarı"
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-100 rounded-full -z-10"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-100 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;

