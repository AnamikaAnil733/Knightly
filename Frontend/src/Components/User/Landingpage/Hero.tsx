import { useRef, useEffect } from "react";
import { Navbar } from "../Common/Navbar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const navigate = useNavigate();
  const kingRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  /* ── Hero text entrance ── */
  useEffect(() => {
    const h1 = document.querySelector(".hero-heading");
    const p = document.querySelector(".hero-subtext");
    const btn = document.querySelector(".hero-button");

    gsap.set([h1, p], { y: 80, opacity: 0 });
    gsap.set(btn, { y: 80, opacity: 0 });

    gsap.to(h1, {
      y: 0,
      opacity: 1,
      delay: 0.5,
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(p, {
      y: 0,
      opacity: 1,
      delay: 0.8,
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(btn, {
      y: 0,
      opacity: 1,
      delay: 1.1,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  /* ── Section 1 scroll animation ── */
  useEffect(() => {
    const heading = document.querySelector(".section1-heading");
    const para = document.querySelector(".section1-para");
    if (!heading || !para || !section1Ref.current) return;

    gsap.set([heading, para], { opacity: 0, x: 100 });

    const triggerOpts = {
      trigger: section1Ref.current,
      start: "top 70%",
      toggleActions: "play none none none",
    };
    gsap.to(heading, {
      scrollTrigger: triggerOpts,
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(para, {
      scrollTrigger: triggerOpts,
      opacity: 1,
      x: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  /* ── Section 2 scroll animation ── */
  useEffect(() => {
    const heading = document.querySelector(".section2-heading");
    const para = document.querySelector(".section2-para");
    if (!heading || !para || !section2Ref.current) return;

    gsap.set([heading, para], { opacity: 0, y: 60 });

    const triggerOpts = {
      trigger: section2Ref.current,
      start: "top 70%",
      toggleActions: "play none none none",
    };
    gsap.to(heading, {
      scrollTrigger: triggerOpts,
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(para, {
      scrollTrigger: triggerOpts,
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.2,
      ease: "power3.out",
    });
  }, []);

  /* ── Section 3 scroll animation ── */
  useEffect(() => {
    const overlay = document.querySelector(".section3-overlay");
    const h1 = overlay?.querySelector("h1");
    const p = overlay?.querySelector("p");
    const btn = overlay?.querySelector("button");
    if (!overlay || !h1 || !p || !btn || !section3Ref.current) return;

    const showOverlay = gsap.timeline({ paused: true });
    showOverlay.to(overlay, { opacity: 1, duration: 1, pointerEvents: "auto" });
    showOverlay.to([h1, p, btn], {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    ScrollTrigger.create({
      trigger: section3Ref.current,
      start: "top center",
      end: "bottom top",
      onEnter: () => showOverlay.play(),
      onLeaveBack: () => {
        gsap.to(overlay, { opacity: 0, duration: 0.5, pointerEvents: "none" });
        gsap.set([h1, p, btn], { opacity: 0, y: 80 });
        showOverlay.pause(0);
      },
    });
  }, []);

  /* ── King scroll path ── */
  useEffect(() => {
    const heroImg = kingRef.current;
    const section1 = section1Ref.current;
    const section3 = section3Ref.current;
    if (!heroImg || !section1 || !section3) return;

    gsap.set(heroImg, {
      opacity: 0,
      x: "-20vw",
      y: "30vh",
      scale: 0.8,
      rotate: 20,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section1,
        start: "top 80%",
        endTrigger: section3,
        end: "bottom bottom",
        scrub: 1.5,
        onLeave: () => gsap.to(heroImg, { opacity: 0, duration: 0.3 }),
        onEnterBack: () => gsap.to(heroImg, { opacity: 1, duration: 0.3 }),
      },
    });

    tl.to(heroImg, {
      opacity: 1,
      x: "10vw",
      y: "25vh",
      scale: 1,
      rotate: 10,
      ease: "power1.out",
      duration: 1,
    });
    tl.to(heroImg, {
      x: "55vw",
      y: "50vh",
      scale: 1.1,
      rotate: -10,
      ease: "none",
      duration: 1.5,
    });
    tl.to(heroImg, {
      x: "72vw",
      y: "60vh",
      scale: 1.3,
      rotate: 5,
      ease: "power2.out",
      duration: 1.5,
    });
  }, []);

  return (
    <div className="relative">
      {/* ══ Hero Section ══ */}
      <div
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden"
        style={{ backgroundColor: "#0B1437" }}
      >
        <Navbar />

        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ backgroundColor: "#0B1437" }}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark radial overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(11,20,55,0.7), #0B1437)",
          }}
        />

        {/* Hero content */}
        <div
          className="relative z-10 text-white text-center px-8"
          style={{ top: "45%", transform: "translateY(-50%)" }}
        >
          <Tilt
            className="tilt-wrapper"
            tiltMaxAngleX={20}
            tiltMaxAngleY={20}
            scale={1.03}
            gyroscope={true}
            transitionSpeed={2000}
            perspective={2000}
            style={{ width: "fit-content", margin: "0 auto" }}
          >
            <h1 className="hero-heading text-6xl mb-6  md:text-8xl font-cinzel font-bold tracking-tighter text-white">
              Where Strategy Meets
              <span className="text-gold italic block ">Royalty</span>
            </h1>

            <p
              className="hero-subtext text-2xl mb-10 font-light tracking-wider"
              style={{
                fontFamily: "'Poppins', sans-serif",
                color: "#E2E8F0",
                textShadow: "0 2px 10px rgba(0,0,0,0.9)",
              }}
            >
              Command the board. Master the game. Experience the royal pursuit
              of excellence.
            </p>
            <button
              className="hero-button inline-flex items-center gap-3 cursor-pointer rounded-full px-12 py-5 text-lg font-bold tracking-widest transition-all duration-[400ms]"
              style={{
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: "#0B1437",
                backgroundImage:
                  "linear-gradient(to bottom right, rgba(255,209,102,0.1), transparent)",
                border: "2px solid #FFD166",
                color: "#FFD166",
                boxShadow:
                  "0 15px 40px rgba(0,0,0,0.6), 0 0 25px rgba(255,209,102,0.2)",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget;
                b.style.transform = "scale(1.05) translateY(-2px)";
                b.style.backgroundColor = "#FFD166";
                b.style.color = "#0B1437";
                b.style.boxShadow =
                  "0 20px 50px rgba(255,209,102,0.4), 0 0 35px rgba(255,209,102,0.3)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget;
                b.style.transform = "scale(1) translateY(0)";
                b.style.backgroundColor = "#0B1437";
                b.style.color = "#FFD166";
                b.style.boxShadow =
                  "0 15px 40px rgba(0,0,0,0.6), 0 0 25px rgba(255,209,102,0.2)";
              }}
              onClick={() => navigate("/play")}
            >
              <Sparkles className="w-5 h-5" />
              Begin Your Reign
            </button>
          </Tilt>
        </div>
      </div>

      {/* ── Animated King (scroll-driven) ── */}
      <div className="static pointer-events-none">
        <img
          src="/images/king.png"
          alt="Animated King"
          ref={kingRef}
          className="fixed top-0 left-0 w-[380px] h-[380px] object-contain pointer-events-none z-[99] will-change-transform"
          style={{ filter: "drop-shadow(0 0 30px rgba(109,93,246,0.4))" }}
        />
      </div>

      {/* ══ Section 1 ══ */}
      <div
        ref={section1Ref}
        className="relative z-0 flex items-center justify-center overflow-hidden text-white border-t border-white/5"
        style={{
          height: "700px",
          padding: "6rem 3rem",
          gap: "10rem",
          background: "radial-gradient(circle at center, #1A1F4F, #0B1437)",
        }}
      >
        <div>{/* left placeholder */}</div>
        <div className="max-w-[520px]">
          <h1
            className="section1-heading text-[3.5rem] mb-6"
            style={{ color: "#4F7CFF", fontFamily: "'Cinzel', serif" }}
          >
            Master Every Move
          </h1>
          <p
            className="section1-para text-xl leading-relaxed font-light"
            style={{ color: "#AAB3D1" }}
          >
            In the world of chess, every move matters. Whether you're opening
            strong or defending with grace, each piece tells a story. <br />
            <br />
            At Knightly, we help you decode those stories — from timeless
            tactics to modern strategies — so you're never just playing; you're
            commanding.
          </p>
        </div>
      </div>

      {/* ══ Section 2 ══ */}
      <div
        ref={section2Ref}
        className="relative flex flex-col justify-center text-center min-h-screen"
        style={{ backgroundColor: "#0B1437", padding: "120px 20px" }}
      >
        <div className="flex justify-center items-center gap-16 mb-16">
          <img
            src="/images/section2.png"
            alt="Silver Piece"
            className="w-[350px] h-[350px] object-contain"
            style={{
              transform: "rotate(-20deg)",
              filter: "drop-shadow(0 0 30px rgba(109,93,246,0.2))",
            }}
          />
        </div>
        <h1
          className="section2-heading text-5xl text-white mb-6"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          The Battle Begins
        </h1>
        <p
          className="section2-para text-xl mx-auto leading-relaxed max-w-[700px]"
          style={{ color: "#AAB3D1" }}
        >
          A timeless clash of strategy and elegance—where power meets precision,
          and every move counts.
        </p>
      </div>

      {/* ══ Section 3 ══ */}
      <div
        ref={section3Ref}
        className="relative w-full flex justify-center items-center overflow-visible"
        style={{ height: "110vh", backgroundColor: "#0B1437" }}
      >
        <img
          src="/images/section3-1.png"
          alt="Chess Background"
          className="h-full w-full object-cover opacity-30"
        />

        {/* Overlay (revealed by GSAP) */}
        <div
          className="section3-overlay absolute inset-0 flex flex-col justify-center items-center text-center text-white opacity-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(circle at center, rgba(11,20,55,0.8), #0B1437)",
          }}
        >
          <Tilt
            className="tilt-wrapper"
            tiltMaxAngleX={20}
            tiltMaxAngleY={20}
            scale={1.03}
            gyroscope={true}
            transitionSpeed={2000}
            perspective={2000}
            style={{ width: "fit-content", margin: "0 auto" }}
          >
            <h1
              className="text-[4.5rem] tracking-widest"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#4F7CFF",
                textShadow: "0 0 40px rgba(109,93,246,0.4)",
              }}
            >
              Checkmate is Inevitable
            </h1>
            <p
              className="text-2xl mt-6 font-light"
              style={{ color: "#AAB3D1" }}
            >
              Even the mightiest fall when strategy is supreme.
            </p>
            <button
              className="mt-12 w-60 h-[60px] rounded-full text-base font-bold text-white cursor-pointer border-none transition-all duration-300"
              style={{
                background: "linear-gradient(to right, #4F7CFF, #6D5DF6)",
                boxShadow: "0 10px 20px rgba(109,93,246,0.3)",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget;
                b.style.transform = "scale(1.05)";
                b.style.boxShadow = "0 15px 30px rgba(109,93,246,0.5)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget;
                b.style.transform = "scale(1)";
                b.style.boxShadow = "0 10px 20px rgba(109,93,246,0.3)";
              }}
              onClick={() => navigate("/play")}
            >
              Play Your Game
            </button>
          </Tilt>
        </div>
      </div>
    </div>
  );
}
