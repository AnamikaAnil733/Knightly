import { useRef, useEffect } from "react";
import "../../../styles/Hero.css";
import { Navbar } from "../Common/Navbar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const navigate = useNavigate();
  const kingRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h1 = document.querySelector(".hero-heading");
    const p = document.querySelector(".hero-subtext");
    const btn = document.querySelector(".hero-button");

    gsap.set([h1, p], { y: 80, opacity: 0 });
    gsap.set(btn, { y: 80, opacity: 0 });

    gsap.to(h1, {
      y: 0,
      opacity: 1,
      delay: 0.5, // Reduced from 3 to 0.5 for better DX
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

  useEffect(() => {
    const heading = document.querySelector(".section1-heading");
    const para = document.querySelector(".section1-para");

    if (!heading || !para || !section1Ref.current) return;

    gsap.set([heading, para], { opacity: 0, x: 100 });

    gsap.to(heading, {
      scrollTrigger: {
        trigger: section1Ref.current,
        start: "top 70%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.to(para, {
      scrollTrigger: {
        trigger: section1Ref.current,
        start: "top 70%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      x: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const heading = document.querySelector(".section2-heading");
    const para = document.querySelector(".section2-para");

    if (!heading || !para || !section2Ref.current) return;

    gsap.set([heading, para], { opacity: 0, y: 60 });

    gsap.to(heading, {
      scrollTrigger: {
        trigger: section2Ref.current,
        start: "top 70%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.to(para, {
      scrollTrigger: {
        trigger: section2Ref.current,
        start: "top 70%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.2,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const overlay = document.querySelector(".section3-overlay");
    const h1 = overlay?.querySelector("h1");
    const p = overlay?.querySelector("p");
    const btn = overlay?.querySelector("button");

    if (!overlay || !h1 || !p || !btn || !section3Ref.current) return;

    const showOverlay = gsap.timeline({ paused: true });

    showOverlay.to(overlay, {
      opacity: 1,
      duration: 1,
      pointerEvents: "auto",
    });

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
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.5,
          pointerEvents: "none",
        });
        gsap.set([h1, p, btn], {
          opacity: 0,
          y: 80,
        });
        showOverlay.pause(0);
      },
    });
  }, []);

  useEffect(() => {
    const heroImg = kingRef.current;
    const section1 = section1Ref.current;
    const section3 = section3Ref.current;

    if (!heroImg || !section1 || !section3) return;

    // Set initial state: king is off-screen left, mid-height
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

    // Step 1: Fade in on left as section1 enters
    tl.to(heroImg, {
      opacity: 1,
      x: "10vw",
      y: "25vh",
      scale: 1,
      rotate: 10,
      ease: "power1.out",
      duration: 1,
    });

    // Step 2: Drift to center-right through section2
    tl.to(heroImg, {
      x: "55vw",
      y: "50vh",
      scale: 1.1,
      rotate: -10,
      ease: "none",
      duration: 1.5,
    });

    // Step 3: Land on the far RIGHT side of section3
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
      <div className="hero-container" ref={heroRef}>
        <Navbar />
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
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
            <h1 className="hero-heading">Where Strategy Meets Royalty</h1>
            <p className="hero-subtext">
              Command the board. Master the game. Experience the royal pursuit
              of excellence.
            </p>
            <button className="hero-button" onClick={() => navigate("/play")}>
              Begin Your Reign
            </button>
          </Tilt>
        </div>
      </div>

      <div className="hero-model1">
        <img
          src="/images/king.png"
          alt="Animated King"
          className="hero-img"
          ref={kingRef}
        />
      </div>

      <div className="section1" ref={section1Ref}>
        <div className="section1-left">
          {/* Placeholder for left content if needed */}
        </div>
        <div className="section1-right">
          <h1 className="section1-heading">Master Every Move</h1>
          <p className="section1-para">
            In the world of chess, every move matters. Whether you're opening
            strong or defending with grace, each piece tells a story. <br />
            <br />
            At Knightly, we help you decode those stories — from timeless
            tactics to modern strategies — so you’re never just playing; you're
            commanding.
          </p>
        </div>
      </div>

      <div className="section2" ref={section2Ref}>
        <div className="section2-top">
          <img
            src="/images/section2.png"
            alt="Silver Piece"
            className="king-img"
          />
        </div>
        <h1 className="section2-heading">The Battle Begins</h1>
        <p className="section2-para">
          A timeless clash of strategy and elegance—where power meets precision,
          and every move counts.
        </p>
      </div>

      <div className="section3" ref={section3Ref}>
        <img
          src="/images/section3-1.png"
          alt="Chess Background"
          className="section3-img"
        />
        <div className="section3-overlay">
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
            <h1>Checkmate is Inevitable</h1>
            <p>Even the mightiest fall when strategy is supreme.</p>
            <button onClick={() => (window.location.href = "/play")}>
              Play Your First Game
            </button>
          </Tilt>
        </div>
      </div>
    </div>
  );
}
