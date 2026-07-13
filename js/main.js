document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Initialize Lenis for Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smooth: true
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 2. SCENE 1: The Hook (Parallax & Fade)
  const hookTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scene-hook",
      start: "top top",
      end: "+=100%",
      scrub: 1, // Smooth scrub
      pin: true
    }
  });

  hookTl.to(".hero-bg", {
    scale: 1.3,
    filter: "blur(4px)",
    ease: "none"
  }, 0)
  .to(".fade-element, .title-element", {
    opacity: 0,
    y: -50,
    scale: 1.1,
    stagger: 0.1,
    ease: "none"
  }, 0);


  // 3. SCENE 2: The Context (Text Scrubbing)
  // Split the text for scrubbing
  const storyHeading = document.getElementById('story-heading');
  if(storyHeading) {
    const text = storyHeading.innerText;
    storyHeading.innerHTML = '';
    const words = text.split(' ');
    words.forEach((word) => {
      const span = document.createElement('span');
      span.innerText = word;
      storyHeading.appendChild(span);
      storyHeading.appendChild(document.createTextNode(' '));
    });

    gsap.fromTo(storyHeading.querySelectorAll('span'), 
      { backgroundPosition: "100% 0" },
      {
        backgroundPosition: "0% 0",
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".scene-context",
          start: "top 60%",
          end: "bottom 80%",
          scrub: 0.5
        }
      }
    );
  }

  // 4. SCENE 3: The Journey (Horizontal Scroll Hijack)
  const journeySection = document.querySelector(".scene-journey");
  const horizontalContainer = document.querySelector(".horizontal-container");

  if(journeySection && horizontalContainer && window.innerWidth > 900) {
    
    // Calculate how far to move left
    let scrollWidth = horizontalContainer.scrollWidth - window.innerWidth;

    gsap.to(horizontalContainer, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: journeySection,
        start: "top top",
        end: () => "+=" + scrollWidth,
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });
  }

  // 5. SCENE 4: The Climax (Review Cards Fade Up)
  gsap.from(".review-item", {
    y: 100,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".scene-climax",
      start: "top 60%"
    }
  });

  // 6. Magnetic Button Micro-interaction
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;

      gsap.to(btn, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

});
