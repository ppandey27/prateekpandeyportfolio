import { useEffect, useState, useRef } from "react";
import "./App.css";

const PROFILE_IMAGE = "my-photo.jpg";
const RESUME_FILE = "my-resume.pdf";

// Roles ko component ke bahar shift kiya gaya hai taaki unnecessary re-creations na ho
const ROLES = [
  "Full Stack Developer",
  "React Native App Builder",
  "React Specialist",
  "Django Architect",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);

  const canvasRef = useRef(null);

  // Typing effect loop
  useEffect(() => {
    let index = 0;
    let deleting = false;
    let timeout;

    const type = () => {
      const word = ROLES[roleIndex];

      if (!deleting) {
        setTypedText(word.substring(0, index + 1));
        index++;

        if (index === word.length) {
          deleting = true;
          timeout = setTimeout(type, 1600);
          return;
        }
      } else {
        setTypedText(word.substring(0, index - 1));
        index--;

        if (index === 0) {
          deleting = false;
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }

      timeout = setTimeout(type, deleting ? 45 : 90);
    };

    type();

    return () => clearTimeout(timeout);
  }, [roleIndex]);

  // Full-page dynamic canvas animation background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;

      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
      ctx.strokeStyle = "rgba(59, 130, 246, 0.08)";
      ctx.lineWidth = 1;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];

          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Reveal observer for sections
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  // Mouse coordinate tracker for cursor highlight glow
  useEffect(() => {
    const mouseMove = (e) => {
      document.documentElement.style.setProperty(
        "--mouse-x",
        `${e.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${e.clientY}px`
      );
    };

    window.addEventListener("mousemove", mouseMove);

    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMenuOpen(false);
  };

  const skills = [
    {
      name: "React / React Native",
      level: "92%",
      width: "92%",
      icon: "⚛",
    },
    {
      name: "JavaScript / ES6+",
      level: "90%",
      width: "90%",
      icon: "JS",
    },
    {
      name: "Python",
      level: "88%",
      width: "88%",
      icon: "PY",
    },
    {
      name: "Django",
      level: "85%",
      width: "85%",
      icon: "DJ",
    },
    {
      name: "MySQL",
      level: "82%",
      width: "82%",
      icon: "🗄",
    },
    {
      name: "PostgreSQL",
      level: "80%",
      width: "80%",
      icon: "🐘",
    },
  ];

  return (
    <div className="portfolio">
      <canvas
        ref={canvasRef}
        className="animated-bg-canvas"
      ></canvas>

      <div className="cursor-glow"></div>

      {/* ================= HEADER ================= */}

      <header className="navbar">
        <div className="nav-inner">

          <div
            className="brand"
            onClick={() => scrollTo("home")}
          >
            <div className="brand-mark">PP</div>

            <div className="brand-name">
              <strong>Prateek Pandey</strong>
              <span>FULL STACK & MOBILE DEVELOPER</span>
            </div>
          </div>

          <nav
            className={
              menuOpen
                ? "nav-links active"
                : "nav-links"
            }
          >
            <button onClick={() => scrollTo("home")}>
              Home
            </button>

            <button onClick={() => scrollTo("about")}>
              About
            </button>

            <button onClick={() => scrollTo("skills")}>
              Skills
            </button>

            <button onClick={() => scrollTo("projects")}>
              Projects
            </button>

            <button onClick={() => scrollTo("contact")}>
              Contact
            </button>
          </nav>

          <div className="header-actions">

            <a
              href={`/${RESUME_FILE}`}
              download={RESUME_FILE}
              className="resume-btn-header"
            >
              ↓ Download Resume
            </a>

            <button
              className="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "×" : "☰"}
            </button>

          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section
        className="hero section"
        id="home"
      >

        <div className="hero-left">

          <p className="section-tag">
            WELCOME TO MY PORTFOLIO
          </p>

          <h1>
            Building Web Apps & Mobile Apps as{" "}
            <span className="highlight-text">
              Prateek Pandey
            </span>
          </h1>

          <div className="typing-line">
            <span>
              Specialized as a {typedText}
            </span>

            <b className="cursor-blink">|</b>
          </div>

          <p className="hero-description">
            I engineer clean, responsive, and high-performance
            applications across web platforms and cross-platform
            mobile environments using React Native.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => scrollTo("projects")}
            >
              View My Projects <span>↗</span>
            </button>

            <a
              href={`/${RESUME_FILE}`}
              download={RESUME_FILE}
              className="secondary-btn"
            >
              ↓ Download Resume (PDF)
            </a>

          </div>

          <div className="hero-mini-data">

            <div>
              <strong>4+</strong>
              <span>Production Systems</span>
            </div>

            <div>
              <strong>Mobile</strong>
              <span>React Native Expert</span>
            </div>

            <div>
              <strong>MSc</strong>
              <span>IT Scholar</span>
            </div>

          </div>

        </div>

        {/* HERO VISUAL */}

        <div className="hero-right">

          <div className="profile-area">

            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="profile-card">

              <div className="profile-header">
                <span>PORTFOLIO / 2026</span>
                <span>VERIFIED</span>
              </div>

             <div className="profile-image">

              <img
                src={`/${PROFILE_IMAGE}`}
                alt="Prateek Pandey"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <div className="image-overlay"></div>

             </div>

              <div className="profile-info">
                <strong>Prateek Pandey</strong>
                <span>Full Stack & Mobile Dev</span>
              </div>

            </div>

            <div className="floating-card floating-react">

              <div className="floating-icon">
                ⚛
              </div>

              <div>
                <strong>React</strong>
                <small>Frontend Core</small>
              </div>

            </div>

            <div className="floating-card floating-native">

              <div className="floating-icon">
                📱
              </div>

              <div>
                <strong>React Native</strong>
                <small>Mobile Apps</small>
              </div>

            </div>

            <div className="floating-card floating-django">

              <div className="floating-icon">
                DJ
              </div>

              <div>
                <strong>Django</strong>
                <small>Backend Core</small>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ================= TECH TICKER ================= */}

      <div className="tech-strip">

        <div className="tech-track">

          <span>REACT NATIVE</span>
          <i>✦</i>

          <span>REACT.JS</span>
          <i>✦</i>

          <span>JAVASCRIPT</span>
          <i>✦</i>

          <span>PYTHON</span>
          <i>✦</i>

          <span>DJANGO</span>
          <i>✦</i>

          <span>MYSQL</span>
          <i>✦</i>

          <span>POSTGRESQL</span>
          <i>✦</i>

          <span>MOBILE APP BUILDER</span>
          <i>✦</i>

          <span>REACT NATIVE</span>
          <i>✦</i>

          <span>PYTHON</span>
          <i>✦</i>

        </div>
      </div>

      {/* ================= ABOUT ================= */}

      <section
        className="section about-section reveal"
        id="about"
      >

        <div className="section-header-box">

          <span className="section-tag">
           ABOUT ME
          </span>

          <h2 className="section-title">
            Engineering code for{" "}
            <span className="highlight-text">
              web and mobile devices.
            </span>
          </h2>

          <p className="section-desc">
            Dedicated to delivering software solutions that
            combine high performance with clean
            cross-platform architecture.
          </p>

        </div>

        <div className="about-grid">

          <div className="about-text-content">

            <p className="about-highlight-text">
              I am an aspiring Full Stack and Mobile App
              Developer focused on building robust
              applications that solve real-world industry
              requirements.
            </p>

            <p>
              Along with building responsive web interfaces,
              I specialize in creating native mobile apps
              using <strong>React Native</strong>, allowing
              smooth deployment across Android and iOS devices.
            </p>

            <p>
              My backend scope spans Python, Django, MySQL,
              and PostgreSQL, ensuring secure data handling
              and robust API integration.
            </p>

          </div>

          <div className="highlight-grid">

            <div className="highlight-card">
              <span className="highlight-icon">📱</span>

              <div>
                <strong>React Native</strong>
                <small>Mobile App Builder</small>
              </div>
            </div>

            <div className="highlight-card">
              <span className="highlight-icon">⚡</span>

              <div>
                <strong>Practical Execution</strong>
                <small>Production Apps</small>
              </div>
            </div>

            <div className="highlight-card">
              <span className="highlight-icon">⚙</span>

              <div>
                <strong>Optimized Logic</strong>
                <small>Scalable Backends</small>
              </div>
            </div>

            <div className="highlight-card">
              <span className="highlight-icon">📈</span>

              <div>
                <strong>Continuous Growth</strong>
                <small>Adapting Tech</small>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SKILLS ================= */}

      <section
        className="section skills-section reveal"
        id="skills"
      >

        <div className="section-header-box">

          <span className="section-tag">
            TECHNICAL EXPERTISE
          </span>

          <h2 className="section-title">
            Core technologies that{" "}
            <span className="highlight-text">
              power applications.
            </span>
          </h2>

          <p className="section-desc">
            The proven programming languages and frameworks
            equipped with icon integration.
          </p>

        </div>

        <div className="skills-grid-container">

          {skills.map((skill, index) => (

            <div
              className="skill-card-box"
              key={skill.name}
            >

              <div className="skill-top-info">

                <div className="skill-identity">

                  <span className="skill-badge-icon">
                    {skill.icon}
                  </span>

                  <strong>
                    {skill.name}
                  </strong>

                </div>

                <span className="skill-score">
                  {skill.level}
                </span>

              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    "--progress": skill.width,
                    animationDelay: `${index * 0.1}s`,
                  }}
                ></div>

              </div>

            </div>

          ))}

        </div>

        <div className="tech-badges-grid">

          <div className="tech-badge-item">
            <span>📱</span> React Native Apps
          </div>

          <div className="tech-badge-item">
            <span>C</span> C Programming
          </div>

          <div className="tech-badge-item">
            <span>C++</span> C++ Builder
          </div>

          <div className="tech-badge-item">
            <span>☕</span> Java
          </div>

          <div className="tech-badge-item">
            <span>🌐</span> HTML5 / CSS3
          </div>

          <div className="tech-badge-item">
            <span>🗂️</span> DBMS Architecture
          </div>

          <div className="tech-badge-item">
            <span>⚡</span> RESTful APIs
          </div>

          <div className="tech-badge-item">
            <span>🐙</span> Git & GitHub
          </div>

        </div>

      </section>

      {/* ================= PROJECTS ================= */}

      <section
        className="section projects-section reveal"
        id="projects"
      >

        <div className="section-header-box">

          <span className="section-tag">
            SELECTED PROJECTS
          </span>

          <h2 className="section-title">
            Web systems &{" "}
            <span className="highlight-text">
              mobile applications.
            </span>
          </h2>

          <p className="section-desc">
            Detailed overview of cross-platform mobile apps
            and web platforms.
          </p>

        </div>

        <div className="projects-grid">

          <article className="project-card">

            <div className="project-number">
              01
            </div>

            <div className="project-visual mobileapp">

              <div className="mobile-ui">

                <div className="mobile-notch"></div>

                <div className="mobile-screen">
                  <i></i>
                  <b></b>
                  <b></b>
                </div>

              </div>

            </div>

            <div className="project-content">

              <div className="project-tags">
                <span>React Native</span>
                <span>JavaScript</span>
                <span>Mobile</span>
              </div>

              <h3>
                Cross-Platform Mobile App
              </h3>

              <p>
                Custom mobile application built using React
                Native featuring smooth UI transitions,
                responsive navigation, and state management.
              </p>

              <div className="project-footer">
                <span>Mobile Application</span>
                <b>↗</b>
              </div>

            </div>

          </article>

          <article className="project-card">

            <div className="project-number">
              02
            </div>

            <div className="project-visual management">

              <div className="dashboard-ui">

                <div className="ui-top">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="ui-content">

                  <div className="ui-sidebar">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>

                  <div className="ui-main">

                    <div className="ui-title"></div>

                    <div className="ui-stats">
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>

                    <div className="ui-chart">
                      <b></b>
                      <b></b>
                      <b></b>
                      <b></b>
                      <b></b>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="project-content">

              <div className="project-tags">
                <span>React</span>
                <span>Django</span>
                <span>PostgreSQL</span>
              </div>

              <h3>
                Industry Management System
              </h3>

              <p>
                Specialized enterprise software solution
                developed to handle operational workflows
                for a transformer manufacturing industry.
              </p>

              <div className="project-footer">
                <span>Production System</span>
                <b>↗</b>
              </div>

            </div>

          </article>

          <article className="project-card">

            <div className="project-number">
              03
            </div>

            <div className="project-visual ecommerce">

              <div className="store-ui">

                <div className="store-nav">
                  <strong>STORE</strong>
                  <span>⌕</span>
                </div>

                <div className="store-products">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

              </div>

            </div>

            <div className="project-content">

              <div className="project-tags">
                <span>React</span>
                <span>JavaScript</span>
                <span>Database</span>
              </div>

              <h3>
                College E-Commerce Portal
              </h3>

              <p>
                Structured e-commerce application featuring
                comprehensive catalog management and
                interactive shopping loops.
              </p>

              <div className="project-footer">
                <span>Academic Application</span>
                <b>↗</b>
              </div>

            </div>

          </article>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section
        className="section contact-section reveal"
        id="contact"
      >

        <div className="section-header-box">

          <span className="section-tag">
             GET IN TOUCH
          </span>

          <h2 className="section-title">
            Open for professional{" "}
            <span className="highlight-text">
              opportunities.
            </span>
          </h2>

          <p className="section-desc">
            Connect directly through professional channels
            or direct messaging.
          </p>

        </div>

        <div className="contact-direct-wrapper">

          <h2>
            Let's start a conversation.
          </h2>

          <p>
            Whether you are offering an engineering role,
            have an interesting web or mobile app contract,
            or want to connect regarding tech, my lines are active.
          </p>

          <div className="contact-grid-cards">

            <a
              href="mailto:prateekpandey252@gmail.com"
              className="contact-card-item"
            >
              <div className="contact-card-icon">
                @
              </div>

              <small>EMAIL ADDRESS</small>

              <strong>
                prateekpandey252@gmail.com
              </strong>
            </a>

            <a
              href="tel:8602373876"
              className="contact-card-item"
            >
              <div className="contact-card-icon">
                ☎
              </div>

              <small>PHONE / WHATSAPP</small>

              <strong>
                +91 8602373876
              </strong>
            </a>

            <a
              href="https://instagram.com/mr._prateek_027"
              target="_blank"
              rel="noreferrer"
              className="contact-card-item"
            >
              <div className="contact-card-icon">
                ◎
              </div>

              <small>INSTAGRAM</small>

              <strong>
                @mr._prateek_027
              </strong>
            </a>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="professional-footer">

        <div className="footer-inner-modern">

          <div className="footer-brand-row">

            <div className="footer-brand-mark">
              PP
            </div>

            <div className="footer-brand-info">

              <h3>
                Prateek Pandey
              </h3>

              <p>
                FULL STACK & MOBILE APP DEVELOPER
              </p>

            </div>

          </div>

          <div className="footer-social-links">

            <a
              href="mailto:prateekpandey252@gmail.com"
              className="footer-social-pill"
            >
              <span>@</span>
              Email Me
            </a>

            <a
              href="tel:8602373876"
              className="footer-social-pill"
            >
              <span>☎</span>
              WhatsApp / Call
            </a>

            <a
              href="https://instagram.com/mr._prateek_027"
              target="_blank"
              rel="noreferrer"
              className="footer-social-pill"
            >
              <span>◎</span>
              Instagram
            </a>

          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom-row">

            <span>
              © 2026{" "}
              <strong>
                Prateek Pandey
              </strong>
              . All rights reserved.
            </span>

            <button
              className="back-to-top-btn"
              onClick={() => scrollTo("home")}
            >
              Back to top ↑
            </button>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;
