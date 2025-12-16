
import {
  CrownIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
} from 'lucide-react'
export function Footer() {
  return (
    <footer className="bg-[#0A0F2C] border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CrownIcon className="w-6 h-6 text-[#FFD166]" />
              <span
                className="text-xl font-bold text-[#FFD166]"
                style={{
                  fontFamily: 'Cinzel, serif',
                }}
              >
                Knightly
              </span>
            </div>
            <p className="text-[#C9CAD9] text-sm">
              Where strategy meets royalty. Join the ultimate chess platform.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Play Now
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Tournaments
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Leaderboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Learn
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 mb-4">
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9CAD9] hover:text-[#FFD166] transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFD166]/20 transition-colors"
              >
                <FacebookIcon className="w-4 h-4 text-[#C9CAD9]" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFD166]/20 transition-colors"
              >
                <TwitterIcon className="w-4 h-4 text-[#C9CAD9]" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFD166]/20 transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-[#C9CAD9]" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFD166]/20 transition-colors"
              >
                <YoutubeIcon className="w-4 h-4 text-[#C9CAD9]" />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-[#C9CAD9] text-sm">
            © 2025 Knightly. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
