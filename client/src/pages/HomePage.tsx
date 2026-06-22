import HomeNavbar from '../components/home/HomeNavbar';
import HeroSection from '../components/home/HeroSection';
import FeatureHighlights from '../components/home/FeatureHighlights';
import MemeWall from '../components/home/MemeWall';
import FeaturePreview from '../components/home/FeaturePreview';
import '../components/home/home.css';

export function HomePage() {
  return (
    <div className="min-h-screen bg-bg-page">
      <HomeNavbar />
      <main className="fullscreen-container pt-14">
        <HeroSection />
        <FeatureHighlights />
        <MemeWall />
        <FeaturePreview />
      </main>
    </div>
  );
}

export default HomePage;
