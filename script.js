const nav = document.querySelector("[data-nav]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = [...document.querySelectorAll(".nav-links a")];

menuToggle?.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const node = entry.target;
      const target = Number(node.dataset.count);
      const duration = 1100;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = (target * eased).toFixed(1);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          node.textContent = target.toFixed(1);
        }
      };

      requestAnimationFrame(tick);
      observer.unobserve(node);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((node) => counterObserver.observe(node));

const filters = [...document.querySelectorAll("[data-filter]")];
const competitors = [...document.querySelectorAll(".competitor-card")];

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const value = filter.dataset.filter;

    filters.forEach((button) => button.classList.toggle("active", button === filter));
    competitors.forEach((card) => {
      card.classList.toggle("is-hidden", value !== "all" && card.dataset.type !== value);
    });
  });
});

document.querySelectorAll(".image-reveal-box").forEach((box) => {
  const target = box.closest(".hero") || box;
  const cursor = box.querySelector(".reveal-cursor");
  const radius = Number(box.dataset.radius || 160);
  let latestX = 0;
  let latestY = 0;
  let ticking = false;

  function updatePosition(event) {
    if (!box.classList.contains("is-active")) {
      box.classList.add("is-active");
      box.style.setProperty("--r", `${radius}px`);
    }

    const rect = target.getBoundingClientRect();
    latestX = event.clientX - rect.left;
    latestY = event.clientY - rect.top;

    if (ticking) return;

    requestAnimationFrame(() => {
      box.style.setProperty("--x", `${latestX}px`);
      box.style.setProperty("--y", `${latestY}px`);

      if (cursor) {
        cursor.style.transform = `translate(${latestX}px, ${latestY}px) translate(-50%, -50%)`;
      }

      ticking = false;
    });

    ticking = true;
  }

  target.addEventListener("pointerenter", (event) => {
    box.classList.add("is-active");
    box.style.setProperty("--r", `${radius}px`);
    updatePosition(event);
  });

  target.addEventListener("pointermove", updatePosition);

  target.addEventListener("pointerleave", () => {
    box.classList.remove("is-active");
    box.style.setProperty("--r", "0px");
  });
});

window.addEventListener("scroll", () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 8);
});
