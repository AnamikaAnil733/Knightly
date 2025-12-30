import { Navbar } from "../../components/user/common/navbar";
import { Footer } from "../../components/user/common/footer";
import { Hero } from "../../components/user/landingpage/hero";
import { LearningZone } from "../../components/user/landingpage/learningZone";
import { LiveMatches } from "../../components/user/landingpage/liveMatches";
import { TopPlayers } from "../../components/user/landingpage/topPlayers";
import { CommunityNews } from "../../components/user/landingpage/commununtitynews";



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
