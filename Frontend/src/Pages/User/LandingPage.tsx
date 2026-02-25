import { Navbar } from "../../Components/user/common/navbar";
import { Footer } from "../../Components/user/common/footer";
import { Hero } from "../../Components/user/landingpage/hero";
import { LearningZone } from "../../Components/user/landingpage/learningZone";
import { LiveMatches } from "../../Components/user/landingpage/liveMatches";
import { TopPlayers } from "../../Components/user/landingpage/topPlayers";
import { CommunityNews } from "../../Components/user/landingpage/commununtitynews";



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
