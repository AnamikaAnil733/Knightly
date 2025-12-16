import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { Hero } from "../../components/landingpage/hero";
import { LearningZone } from "../../components/landingpage/learningZone";
import { LiveMatches } from "../../components/landingpage/liveMatches";
import { TopPlayers } from "../../components/landingpage/topPlayers";
import { CommunityNews } from "../../components/landingpage/commununtitynews";



export function LandingPage(){
    return(
        <div className="w-full min-h-screen bg-[#0A0F2C] text-white overflow-x-hidden">
      <div className="sparkle-background">
        <Navbar/>
        <Hero/>
        <TopPlayers/>
        <LearningZone/>
        <LiveMatches/>
        <CommunityNews/>
        <Footer/>
      </div>
      </div>
    )
}
