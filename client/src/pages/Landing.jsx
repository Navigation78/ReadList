import LandingNavbar from "./LandingPage/LandingNavbar";
import Hero from "./LandingPage/Hero";
import FeatureStrip from "./LandingPage/FeatureStrip";
import BookDiscovery from "./LandingPage/BookDiscovery";
import ReadingStats from "./LandingPage/ReadingStats";
import Testimonials from "./LandingPage/Testimonials";
import CtaBanner from "./LandingPage/CtaBanner";
import LandingFooter from "./LandingPage/LandingFooter";

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