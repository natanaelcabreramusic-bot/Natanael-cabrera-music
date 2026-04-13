document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  // MOBILE NAVIGATION
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // FADE-IN ANIMATIONS
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  document.querySelectorAll(".fade-in").forEach((section) => {
    observer.observe(section);
  });

  // DATA HELPERS
  const fetchJSON = async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      return await response.json();
    } catch (error) {
      console.warn(error.message);
      return null;
    }
  };

  // SERVICES
  const serviceGrid = document.getElementById("serviceGrid");
  if (serviceGrid) {
    fetchJSON("services.json").then((data) => {
      if (!data || !Array.isArray(data.services)) return;
      const fragment = document.createDocumentFragment();
      data.services.forEach((service) => {
        const card = document.createElement("article");
        card.className = "service-card";
        card.innerHTML = `
          <h3>${service.title}</h3>
          <p>${service.description}</p>
        `;
        fragment.appendChild(card);
      });
      serviceGrid.innerHTML = "";
      serviceGrid.appendChild(fragment);
    });
  }

  // MUSIC LINKS - no longer rendered dynamically
});
