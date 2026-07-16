document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Initialize Lenis for Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smooth: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Custom Difference Cursor
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.innerWidth > 900) {
    // GSAP quickTo is highly performant for cursor tracking
    let xTo = gsap.quickTo(cursor, "x", {duration: 0.4, ease: "power3"});
    let yTo = gsap.quickTo(cursor, "y", {duration: 0.4, ease: "power3"});

    window.addEventListener("mousemove", e => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Add snap & expand effect when hovering links or buttons
    const interactables = document.querySelectorAll('a, button, .magnetic-btn');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // Helper function: Simple Text Splitter for 3D effect
  function splitTextToChars(element) {
    if(!element) return;
    const text = element.innerText;
    element.innerHTML = '';
    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      const chars = word.split('');
      chars.forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.classList.add('char');
        charSpan.innerText = char;
        wordSpan.appendChild(charSpan);
      });
      
      element.appendChild(wordSpan);
      
      // Add normal space after word
      if (wordIndex < words.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
  }

  // Split the Hero Text
  const heroHeading = document.getElementById('main-heading');
  splitTextToChars(heroHeading);

  // 3. Cinematic Preloader Sequence
  const preloader = document.querySelector('.preloader');
  const counter = document.querySelector('.preloader-counter');
  
  let loadProgress = { val: 0 };
  
  // Stop scrolling while loading
  lenis.stop();

  const tlPreloader = gsap.timeline({
    onComplete: () => {
      lenis.start();
    }
  });

  tlPreloader
    .to(loadProgress, {
      val: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if(counter) counter.innerText = Math.round(loadProgress.val);
      }
    })
    .to(counter, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: "power2.in"
    })
    .to(preloader, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut"
    }, "-=0.2")
    // Trigger the 3D Text Reveal
    .fromTo(".char", {
      opacity: 0,
      y: 50,
      rotateX: -90,
      rotateY: 30
    }, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      stagger: 0.05,
      duration: 1,
      ease: "back.out(1.7)"
    }, "-=0.5")
    .fromTo(".fade-element", {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 1
    }, "-=0.5");


  // 4. SCENE 1: The Hook (Parallax Scrub)
  const hookTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scene-hook",
      start: "top top",
      end: "+=100%",
      scrub: 1,
      pin: true
    }
  });

  hookTl.to(".hero-bg", {
    scale: 1.3,
    filter: "blur(6px)",
    ease: "none"
  }, 0)
  .to(".fade-element, .char", { // scrub the individual characters
    opacity: 0,
    y: -50,
    stagger: 0.02,
    ease: "none"
  }, 0);


  // 5. SCENE 2: The Context (Text Scrubbing)
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

  // 6. SCENE 3: The Journey (Horizontal Scroll & Internal Parallax)
  let mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", () => {
    const journeySection = document.querySelector(".scene-journey");
    const horizontalContainer = document.querySelector(".horizontal-container");
    const parallaxImages = document.querySelectorAll(".panel-img-parallax");

    if(journeySection && horizontalContainer) {
      
      let scrollWidth = horizontalContainer.scrollWidth - window.innerWidth;

      // The main horizontal container timeline
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

      // Internal Image Parallax within the horizontal scroll
      parallaxImages.forEach(img => {
        gsap.to(img, {
          xPercent: 20, // Moves 20% to the right internally
          ease: "none",
          scrollTrigger: {
            trigger: journeySection,
            start: "top top",
            end: () => "+=" + scrollWidth,
            scrub: 1
          }
        });
      });
    }
  });

  // 7. SCENE 4: The Climax (Review Cards Fade Up)
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

  // 8. Magnetic Button Micro-interaction (Fallback for both Desktop & Mobile)
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
