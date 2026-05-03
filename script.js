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

  // SMOOTH SCROLL FOR INTERNAL ANCHOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", targetId);
    });
  });

  // ARTICLE POPUP
  const articleModal = document.getElementById("articleModal");
  const articleModalTitle = document.getElementById("articleModalTitle");
  const articleModalSubtitle = document.getElementById("articleModalSubtitle");
  const articleModalBody = document.getElementById("articleModalBody");
  const articleTriggers = document.querySelectorAll(".read-article-trigger");
  const articles = {
    hero: {
      title: "When Worship Becomes Routine",
      subtitle: "Recognizing when worship has become familiar instead of intentional.",
      paragraphs: [
        "Worship can become routine when we sing the right words, play the right chords, and still forget the reason we are leading. It happens slowly. What once carried wonder can become familiar. What once required dependence can become automatic.",
        "But worship was never meant to be mechanical. It is a living response to the presence, goodness, and holiness of God. The goal is not simply to complete a setlist, fill a room with sound, or create an emotional moment. The goal is to lead people into awareness of God.",
        "Routine is not always obvious. Sometimes it looks organized, excellent, and polished. But if the heart is disconnected, excellence alone cannot carry the moment. Worship leadership must begin in surrender before it is expressed through music.",
        "When worship becomes routine, the invitation is not guilt. The invitation is return. Return to prayer. Return to humility. Return to the reason you started leading in the first place.",
      ],
    },
    featured: {
      title: "What We Forget in Worship",
      subtitle: "A continuation of “When Worship Becomes Routine.”",
      paragraphs: [
        "When worship becomes routine, we often forget that it was never meant to impress people, but to honor God.",
        "We forget that presence matters more than perfection, that sensitivity to the Spirit matters more than flawless execution, and that a surrendered heart carries more weight than musical excellence alone.",
        "In the rush of preparation, transitions, and soundchecks, it is easy to drift into performance mode. But true worship always calls us back — back to intimacy, back to humility, and back to a posture where God is the focus, not us.",
        "Worship is not about creating moments. It is about responding to Him.",
        "And when we remember that, everything changes.",
      ],
    },
  };
  let articleLastFocusedElement = null;

  const loadArticle = (articleKey) => {
    const article = articles[articleKey] || articles.hero;
    if (articleModalTitle) articleModalTitle.textContent = article.title;
    if (articleModalSubtitle) articleModalSubtitle.textContent = article.subtitle;
    if (articleModalBody) {
      articleModalBody.innerHTML = article.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
    }
  };

  const setArticleModalOpen = (isOpen, articleKey = "hero") => {
    if (!articleModal) return;
    if (isOpen) loadArticle(articleKey);
    articleModal.classList.toggle("open", isOpen);
    articleModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("modal-open", isOpen);

    if (isOpen) {
      articleLastFocusedElement = document.activeElement;
      articleModal.querySelector("[data-close-article-modal]")?.focus();
    } else {
      articleLastFocusedElement?.focus?.();
    }
  };

  articleTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => setArticleModalOpen(true, trigger.dataset.article));
  });

  articleModal?.querySelectorAll("[data-close-article-modal]").forEach((closeControl) => {
    closeControl.addEventListener("click", () => setArticleModalOpen(false));
  });

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

  // WORSHIP SESSION BOOKING POPUP
  const openBookingModal = document.getElementById("openBookingModal");
  const bookingModal = document.getElementById("bookingModal");
  const bookingForm = document.getElementById("bookingForm");
  const bookingSuccess = document.getElementById("bookingSuccess");
  let bookingLastFocusedElement = null;

  const setBookingModalOpen = (isOpen) => {
    if (!bookingModal) return;
    bookingModal.classList.toggle("open", isOpen);
    bookingModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("modal-open", isOpen);

    if (isOpen) {
      bookingLastFocusedElement = document.activeElement;
      bookingModal.querySelector("input")?.focus();
    } else {
      bookingLastFocusedElement?.focus?.();
    }
  };

  openBookingModal?.addEventListener("click", () => setBookingModalOpen(true));

  bookingModal?.querySelectorAll("[data-close-booking-modal]").forEach((closeControl) => {
    closeControl.addEventListener("click", () => setBookingModalOpen(false));
  });

  bookingForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingForm.hidden = true;
    if (bookingSuccess) bookingSuccess.hidden = false;
    bookingSuccess?.focus?.();
  });

  // WORSHIP GUIDE POPUP
  const openGuideModal = document.getElementById("openGuideModal");
  const guideModal = document.getElementById("guideModal");
  const guideForm = document.getElementById("guideForm");
  const guideDownload = document.getElementById("guideDownload");
  const guideDownloadLink = guideDownload?.querySelector("a");
  let lastFocusedElement = null;

  const setGuideModalOpen = (isOpen) => {
    if (!guideModal) return;
    guideModal.classList.toggle("open", isOpen);
    guideModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("guide-modal-open", isOpen);

    if (isOpen) {
      lastFocusedElement = document.activeElement;
      guideModal.querySelector("input")?.focus();
    } else {
      lastFocusedElement?.focus?.();
    }
  };

  openGuideModal?.addEventListener("click", () => setGuideModalOpen(true));

  guideModal?.querySelectorAll("[data-close-guide-modal]").forEach((closeControl) => {
    closeControl.addEventListener("click", () => setGuideModalOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (articleModal?.classList.contains("open")) {
      setArticleModalOpen(false);
    }

    if (guideModal?.classList.contains("open")) {
      setGuideModalOpen(false);
    }

    if (bookingModal?.classList.contains("open")) {
      setBookingModalOpen(false);
    }
  });

  guideForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    guideForm.hidden = true;
    if (guideDownload) guideDownload.hidden = false;

    const downloadLink = document.createElement("a");
    downloadLink.href = "downloads/worship-guide.pdf";
    downloadLink.download = "Worship-Guide-Natanael-Cabrera.pdf";
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    guideDownloadLink?.focus();
  });

  // MUSIC LINKS - no longer rendered dynamically
});
