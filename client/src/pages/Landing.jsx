import LandingNavbar from "../components/landing/LandingNavbar";
import Hero from "../components/landing/Hero";
import FeatureStrip from "../components/landing/FeatureStrip";
import BookDiscovery from "../components/landing/BookDiscovery";
import ReadingStats from "../components/landing/ReadingStats";
import Testimonials from "../components/landing/Testimonials";
import CtaBanner from "../components/landing/CtaBanner";
import LandingFooter from "../components/landing/LandingFooter";

// Landing page: just composes the sections in the order shown in the mockup
export default function Landing() {
  return (
    <div className="min-h-screen bg-rl-bg text-rl-text">
      <LandingNavbar />
      <main>
        <Hero />
        <FeatureStrip />
        <BookDiscovery />
        <ReadingStats />
        <Testimonials />
        <CtaBanner />
      </main>
      <LandingFooter />
    </div>
  );
}