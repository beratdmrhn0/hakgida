import HeroCarousel from '../components/home/HeroCarousel';
import PartnershipsCarousel from '../components/home/PartnershipsCarousel';
import AboutPreview from '../components/home/AboutPreview';
import ContactSection from '../components/home/ContactSection';

const Home = () => {
  return (
    <div>
      <HeroCarousel />
      <PartnershipsCarousel />
      <AboutPreview />
      <ContactSection />
    </div>
  );
};

export default Home;

