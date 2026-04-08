import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Shield, Cpu, ArrowRight } from "lucide-react";
import "../../landing.css";

export default function LandingPage() {
  const navigate = useNavigate();

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
      ".fade-in, .fade-in-up, .fade-in-right"
    );
    animateElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-body">
      {/* Header Navigation */}
      <header className="landing-header">
        <div className="landing-container header-container">
          <div className="landing-logo">
            <div className="logo-icon"></div>
            <span>Aura-Sit</span>
          </div>
          <nav className="landing-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <button onClick={() => navigate("/login")} className="nav-cta" style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero glass-element">
        <div className="hero-bg-gradient"></div>
        <div className="landing-container">
          <h1 className="hero-title fade-in-up">
            Fix Your Posture.<br />Effortlessly.
          </h1>
          <p className="hero-subtitle fade-in-up delay-1">
            Aura-Sit uses real-time sensing and intelligent feedback to improve your sitting habits without the hassle of wearables or cameras.
          </p>
          <div className="hero-ctas fade-in-up delay-2">
            <button onClick={() => navigate("/login")} className="landing-btn btn-primary">
              Get Started
            </button>
            <a href="#demo" className="landing-btn btn-secondary">
              View Demo <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Visual / Demo Section */}
      <section id="demo" className="visual-section fade-in">
        <div className="landing-container">
          <div className="visual-wrapper glass-panel">
            <div className="visual-content">
              <div className="posture-illustration">
                <div className="spine-container">
                  <div className="spine-dot dot-1"></div>
                  <div className="spine-dot dot-2"></div>
                  <div className="spine-dot dot-3"></div>
                  <div className="spine-dot dot-4"></div>
                  <div className="spine-dot dot-5"></div>
                </div>
                <div className="status-indicator">
                  <div className="pulse-ring"></div>
                  <span className="status-text">Perfect Alignment</span>
                </div>
              </div>
            </div>
            <div className="visual-bg"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="landing-container">
          <div className="section-header fade-in">
            <h2>Designed for Wellness</h2>
            <p>Everything you need to maintain a healthy back.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card glass-panel fade-in-up">
              <div className="feature-icon icon-blue">
                <Activity size={24} />
              </div>
              <h3>Real-Time Monitoring</h3>
              <p>Continuous millimeter-precise tracking of your spinal curve ensures instant detection of slouching and immediate correction prompts.</p>
            </div>

            <div className="feature-card glass-panel fade-in-up delay-1">
              <div className="feature-icon icon-green">
                <Shield size={24} />
              </div>
              <h3>Privacy-First</h3>
              <p>No cameras. No cloud processing of images. Aura-Sit relies entirely on ultrasonic distance sensors, ensuring your environment remains private.</p>
            </div>

            <div className="feature-card glass-panel fade-in-up delay-2">
              <div className="feature-icon icon-purple">
                <Cpu size={24} />
              </div>
              <h3>Smart Feedback</h3>
              <p>The decentralized Posture Engine actively tracks fatigue and micro-adjustments, recommending active stretches exactly when your body needs them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="landing-container">
          <div className="section-header fade-in">
            <h2>How It Works</h2>
          </div>

          <div className="timeline">
            <div className="timeline-item fade-in-right">
              <div className="timeline-marker">1</div>
              <div className="timeline-content glass-panel">
                <h4>Sensing Environment</h4>
                <p>Our unobtrusive hardware uses precise distance measurements to map your seating position in real-time.</p>
              </div>
            </div>

            <div className="timeline-item fade-in-right delay-1">
              <div className="timeline-marker">2</div>
              <div className="timeline-content glass-panel">
                <h4>Edge Processing</h4>
                <p>A NodeMCU microcontroller packages this raw data and beams it wirelessly and securely directly to your device.</p>
              </div>
            </div>

            <div className="timeline-item fade-in-right delay-2">
              <div className="timeline-marker">3</div>
              <div className="timeline-content glass-panel">
                <h4>Intelligent Feedback</h4>
                <p>The Aura-Sit Dashboard contextualizes the data seamlessly into a beautiful interface, empowering you to adjust naturally.</p>
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
              <h2>Aura-Sit</h2>
              <p>Project A</p>
            </div>
            <div className="footer-credits">
              <p>Built by Soham Malpure</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
