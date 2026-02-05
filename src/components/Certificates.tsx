import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "phosphor-react";

gsap.registerPlugin(ScrollTrigger);

const Certificates = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const certificates = [
    {
      id: 1,
      title: "People and Soft Skills for Professional and Personal Success",
      issuer: "Coursera (IBM Skills Network)",
      year: "Sep 2025",
      verify:
        "https://coursera.org/verify/specialization/0AJ4I2LSXL4L",
    },
    {
      id: 2,
      title: "Generative AI Literacy",
      issuer: "FutureSkills Prime (NASSCOM)",
      year: "Sep 2025",
      file: "/Images/Certificates/generative-ai.pdf",
    },
    {
      id: 3,
      title: "AI Tools Workshop",
      issuer: "Be10X",
      year: "Jan 2026",
      file: "/Images/Certificates/ai-tools-workshop.pdf",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        titleRef.current?.children || [],
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Cards animation (stable)
      gsap.fromTo(
        containerRef.current?.children || [],
        { y: 60, autoAlpha: 0, scale: 0.96 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    ScrollTrigger.refresh(true);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className="relative py-20 px-6 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Heading */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
            My <span className="text-primary-glow">Certificates</span>
          </h2>

          <div className="w-20 h-1 bg-gradient-primary rounded-full mx-auto mb-6" />

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated collection of industry-recognized certifications
            demonstrating my expertise in AI, cloud systems, and modern
            technology practices.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative rounded-2xl p-6 min-h-[220px]
                         flex flex-col justify-between
                         bg-white/5 backdrop-blur-xl border border-white/10
                         transition-transform duration-500
                         hover:-translate-y-2 hover:scale-[1.03]
                         hover:border-primary/40"
            >
              {/* Glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl
                           bg-gradient-to-r from-primary/40 to-secondary/40
                           opacity-0 group-hover:opacity-30 blur-3xl
                           transition-opacity duration-500"
                style={{ zIndex: -1 }}
              />

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2
                               group-hover:text-primary-glow transition-colors">
                  {cert.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {cert.issuer} • {cert.year}
                </p>
              </div>

              <a
                href={cert.verify || cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium
                           text-primary-glow hover:text-primary transition-colors"
              >
                {cert.verify ? "Verify Certificate" : "View Certificate"}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Background blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2" />
    </section>
  );
};

export default Certificates;