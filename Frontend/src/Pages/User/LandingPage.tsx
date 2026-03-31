import { Footer } from "../../Components/User/Common/Footer";
import { Hero } from "../../Components/User/Landingpage/Hero";
import { LearningZone } from "../../Components/User/Landingpage/LearningZone";
import { LiveMatches } from "../../Components/User/Landingpage/LiveMatches";
import { TopPlayers } from "../../Components/User/Landingpage/TopPlayers";
import { CommunityNews } from "../../Components/User/Landingpage/Commununtitynews";

export function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-[#0B1437] text-white overflow-x-hidden">
      <div className="sparkle-background">
        <Hero />
        <TopPlayers />
        <LearningZone />
        <LiveMatches />
        <CommunityNews />
        <Footer />
      </div>
    </div>
  );
}
