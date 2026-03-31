import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { CrownIcon, Target, Users, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const features = [
    {
      icon: <Target className="w-8 h-8 text-[#FFD166]" />,
      title: "AI-Powered Learning",
      description:
        "Hone your skills with our advanced puzzle engine and personalized learning paths designed by grandmasters.",
    },
    {
      icon: <Users className="w-8 h-8 text-[#3A6FF7]" />,
      title: "Global Community",
      description:
        "Connect with players from around the world, join clubs, and participate in exclusive tournaments.",
    },
    {
      icon: <Zap className="w-8 h-8 text-[#EF476F]" />,
      title: "Real-time Analysis",
      description:
        "Improve your game with instant move evaluation and deep engine analysis of your matches.",
    },
    {
      icon: <Shield className="w-8 h-8 text-[#06D6A0]" />,
      title: "Fair Play",
      description:
        "Our state-of-the-art anti-cheat system ensures a level playing field for everyone.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0A0F2C] text-white overflow-x-hidden">
      <div className="sparkle-background">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <CrownIcon className="w-4 h-4 text-[#FFD166]" />
              <span className="text-sm font-medium text-[#FFD166]">
                The Future of Chess
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Where Strategy <br /> Meets Royalty
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#C9CAD9] max-w-2xl mx-auto leading-relaxed"
            >
              Knightly is a premium chess platform dedicated to elevating your
              game through world-class technology and a vibrant community.
            </motion.p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-6 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3A6FF7]/10 blur-[120px] rounded-full -z-10" />
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#1E2548] to-[#0A0F2C] border border-white/10 overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C] via-transparent to-transparent" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-4xl font-bold mb-6"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Our Mission
              </h2>
              <p className="text-lg text-[#C9CAD9] mb-6 leading-relaxed">
                At Knightly, we believe chess is more than just a game—it's a
                pursuit of excellence. Our mission is to provide players of all
                levels with the tools, community, and inspiration to unlock
                their full potential.
              </p>
              <p className="text-lg text-[#C9CAD9] leading-relaxed">
                We combine the timeless traditions of chess with cutting-edge AI
                and social features to create an experience that is both elegant
                and empowering.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-4xl font-bold mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Why Knightly?
              </h2>
              <p className="text-[#C9CAD9]">
                Experience chess like never before with our premium features.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-[#1E2548]/40 border border-white/10 backdrop-blur-sm hover:border-[#FFD166]/50 transition-colors group"
                >
                  <div className="mb-6 transform group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-[#C9CAD9] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Active Players", value: "50K+" },
                { label: "Puzzles Solved", value: "1M+" },
                { label: "Daily Matches", value: "10K+" },
                { label: "Grandmasters", value: "100+" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl md:text-4xl font-bold text-[#FFD166] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[#C9CAD9] text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
