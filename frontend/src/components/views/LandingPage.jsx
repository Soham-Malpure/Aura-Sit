import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Shield, Cpu, ArrowRight, Zap } from "lucide-react";
import "../../landing.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const glowRef = useRef(null);
  const ambientLightRef = useRef(null);

  const handleDemoClick = (e) => {
    e.preventDefault();
    const demoSection = document.getElementById("demo");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (videoRef.current) {
      setTimeout(() => videoRef.current.play(), 600); // Wait for scroll
    }
  };

  useEffect(() => {
    // Scroll Animation Observer Setup
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
      ".fade-in, .fade-in-up, .fade-in-right, .pop-in"
    );
    animateElements.forEach((el) => {
      observer.observe(el);
    });

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let animationFrameId;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animateGlow = () => {
      // Lerp (Linear Interpolation) for that smooth spring/jitter effect
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(calc(${currentX}px - 50%), calc(${currentY}px - 50%), 0)`;
      }
      animationFrameId = requestAnimationFrame(animateGlow);
    };

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigate("/login");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    animateGlow();

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="landing-body">
      <div className="ambient-scroll-light" ref={ambientLightRef}></div>
      <div className="cursor-glow" ref={glowRef}></div>
      {/* Header Navigation */}
      <header className="landing-header">
        <div className="landing-container header-container">
          <div className="landing-logo">
            <div className="logo-icon"></div>
            <span>VerteX</span>
          </div>
          <nav className="landing-nav">
            <a href="#features">Features</a>
            <a href="#demo" onClick={handleDemoClick}>How it Works</a>
            <button onClick={() => navigate("/login")} className="nav-cta" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="landing-container">
          <h1 className="hero-title pop-in">
            Fix Your Posture.<br />Effortlessly.
          </h1>
          <p className="hero-subtitle pop-in delay-1">
            VerteX uses real-time sensing and intelligent feedback to improve your sitting habits without the hassle of wearables or cameras.
          </p>
          <div className="hero-ctas pop-in delay-2">
            <button onClick={() => navigate("/login")} className="landing-btn btn-primary">
              Get Started 
            </button>
          </div>

        </div>
      </section>

      {/* Video Section */}
      <section id="demo" className="video-section">
        <div className="landing-container">
          <div className="hero-visual glass-panel pop-in delay-2">
            <video
              ref={videoRef}
              src="/demo_vid.mp4"
              controls
              autoPlay
              muted
              loop
              playsInline
              style={{ width: "100%", height: "100%", borderRadius: "var(--border-radius-lg)", objectFit: "cover", backgroundColor: "#000" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section id="features" className="features-section">
        <div className="landing-container">
          <div className="section-header fade-in">
            <h2>Everything you need <br />To fix your Posture.</h2>
          </div>

          <div className="bento-grid">
            <div className="bento-item bento-large pop-in">
              <div className="bento-icon-wrapper">
                <Activity size={26} className="bento-icon" />
              </div>
              <div className="bento-content">
                <h3>Real-Time Monitoring</h3>
                <p>Continuous millimeter-precise tracking of your spinal curve ensures instant detection of slouching and immediate correction prompts.</p>
              </div>
            </div>

            <div className="bento-item bento-small pop-in delay-1">
              <div className="bento-icon-wrapper">
                <Shield size={26} className="bento-icon" />
              </div>
              <div className="bento-content">
                <h3>Privacy-First</h3>
                <p>No cameras. No cloud processing. Everything stays on the edge.</p>
              </div>
            </div>

            <div className="bento-item bento-small pop-in delay-2">
              <div className="bento-icon-wrapper">
                <Cpu size={26} className="bento-icon" />
              </div>
              <div className="bento-content">
                <h3>Sensing Environment</h3>
                <p>Unobtrusive hardware uses ultrasonic distance measurements to map your seating position in real-time.</p>
              </div>
            </div>

            <div className="bento-item bento-large pop-in delay-2">
              <div className="bento-icon-wrapper">
                <Zap size={26} className="bento-icon" />
              </div>
              <div className="bento-content">
                <h3>Intelligent Feedback</h3>
                <p>The decentralized Posture Engine actively tracks fatigue and micro-adjustments, recommending active stretches exactly when your body needs them.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h2>VerteX</h2>
            </div>
            <div className="footer-credits">
              <p>Built by Soham Malpure</p><br />
              <p>+91 8208836121</p><br />
              <p>soham.malpure2509@gmail.com</p><br />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
