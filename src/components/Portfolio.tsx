import { useState, useEffect } from "react";
import Preloader from "./Preloader";
import Navigation from "./Navigation";
import Hero from "./Hero";
import About from "./About";
import Certificates from "./Certificates";
import Contact from "./Contact";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Lock / unlock scroll safely
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLoading]);

  // Called when preloader finishes
  const handleLoadingComplete = () => {
    setIsLoading(false);

    // 🔥 Wait for DOM paint before refreshing GSAP
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });
    });
  };

  return (
    <div className="relative">
      {isLoading && <Preloader onComplete={handleLoadingComplete} />}

      <div
        className={`transition-opacity duration-1000 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navigation />

        <main>
          <Hero />
          <About />
          <Certificates />
          <Contact />
          <Chatbot />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Portfolio;