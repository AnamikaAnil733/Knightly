
export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F2C] via-[#1B1452] to-[#0A0F2C]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#FFD166] bg-clip-text text-transparent"
              style={{
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Where Strategy Meets Royalty
            </h1>
            <p
              className="text-xl text-[#C9CAD9] mb-8"
              style={{
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Play chess with players worldwide. Join tournaments, track your
              progress, and rise to the top.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#3A6FF7] to-[#6B2EFF] text-white font-semibold glow-button">
                Play Now
              </button>
              <button className="px-8 py-3 rounded-full border-2 border-[#6B2EFF] text-white font-semibold hover:bg-[#6B2EFF]/10 transition-all">
                Learn Chess
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="glow-container">
              <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/uFh31Gu1yw2CHDo1PoSi4S/Gemini_Generated_Image_ohqtm6ohqtm6ohqt.png"
                alt="Luxury Chess Pieces"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
