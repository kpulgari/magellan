(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function initSpotlights() {
    if (prefersReducedMotion) return;
    document.querySelectorAll("[data-spotlight]").forEach((el) => {
      el.addEventListener(
        "pointermove",
        (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          el.style.setProperty("--sx", `${x}px`);
          el.style.setProperty("--sy", `${y}px`);
        },
        { passive: true }
      );
      el.addEventListener("pointerleave", () => {
        el.style.removeProperty("--sx");
        el.style.removeProperty("--sy");
      });
    });
  }

  function initHeroParallax() {
    const hero = document.querySelector(".hero");
    const inner = document.querySelector(".hero__parallax");
    if (!hero || !inner || prefersReducedMotion) return;

    function tick() {
      const scrollY = window.scrollY;
      const heroTopDoc = hero.getBoundingClientRect().top + scrollY;
      const scrollInHero = Math.max(0, scrollY - heroTopDoc);
      const half = Math.max(1, hero.offsetHeight * 0.5);
      const p = Math.min(1, scrollInHero / half);
      const opacity = Math.max(0, 1 - p);
      const scale = 1 - p * 0.05;
      const translateY = p * 80;
      inner.style.opacity = String(opacity);
      inner.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    }

    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick, { passive: true });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add("reveal--visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSpotlights();
    initHeroParallax();
    initReveal();
  });
})();
