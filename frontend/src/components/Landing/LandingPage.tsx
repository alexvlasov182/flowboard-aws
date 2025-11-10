import LandingHeader from './LandingHeader';
import FeaturesSection from './FeaturesSection';
import HeroSection from './HeroSection';
import FeatureImagesSection from './FeatureImagesSection';
import CTASection from './CTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LandingHeader />
      <HeroSection />
      <FeatureImagesSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
