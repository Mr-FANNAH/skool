"use strict";

/* ==================================================
   TESTIMONIAL DATA
================================================== */

const testimonials = [
  {
    name: "Youssef El Amrani",
    role: "Étudiant en développement web",
    image: "https://i.pravatar.cc/320?img=11",
    message:
      "Grâce à SKOOL, j’ai développé des compétences pratiques et terminé plusieurs projets. La progression par niveaux me motive chaque jour.",
    progress: "Progression : 92 %",
    level: "Niveau 12"
  },
  {
    name: "Fatima Zahra",
    role: "Étudiante en biologie",
    image: "https://i.pravatar.cc/320?img=47",
    message:
      "Les cours sont clairs et bien structurés. Les quiz et les défis quotidiens m’ont aidée à améliorer mes résultats et à rester régulière.",
    progress: "Progression : 88 %",
    level: "Niveau 10"
  },
  {
    name: "Prof. Karim Benali",
    role: "Professeur de mathématiques",
    image: "https://i.pravatar.cc/320?img=13",
    message:
      "SKOOL me permet de publier mes cours, suivre la progression des étudiants et analyser leurs résultats depuis un seul espace.",
    progress: "Impact : 120 étudiants",
    level: "23 cours"
  },
  {
    name: "Sara Benali",
    role: "Étudiante en sciences physiques",
    image: "https://i.pravatar.cc/320?img=32",
    message:
      "Le défi de 90 jours m’a appris à travailler régulièrement. Chaque nouvelle étape débloquée me donne envie de continuer.",
    progress: "Progression : 91 %",
    level: "Niveau 9"
  },
  {
    name: "Prof. Nadia El Idrissi",
    role: "Professeure de physique-chimie",
    image: "https://i.pravatar.cc/320?img=38",
    message:
      "La création des quiz, les statistiques et la gestion des devoirs rendent mon travail beaucoup plus simple et organisé.",
    progress: "Impact : 240 étudiants",
    level: "18 cours"
  },
  {
    name: "Mehdi Idrissi",
    role: "Étudiant en intelligence artificielle",
    image: "https://i.pravatar.cc/320?img=15",
    message:
      "L’assistant IA et les recommandations personnalisées m’aident à comprendre les notions difficiles et à mieux planifier mes révisions.",
    progress: "Progression : 86 %",
    level: "Niveau 11"
  }
];

/* ==================================================
   ELEMENTS
================================================== */

const spotlightCard = document.getElementById("spotlightCard");
const spotlightImage = document.getElementById("spotlightImage");
const spotlightName = document.getElementById("spotlightName");
const spotlightRole = document.getElementById("spotlightRole");
const spotlightMessage = document.getElementById("spotlightMessage");
const spotlightProgress = document.getElementById("spotlightProgress");
const spotlightLevel = document.getElementById("spotlightLevel");

const previousButton =
  document.getElementById("previousTestimonial");

const nextButton =
  document.getElementById("nextTestimonial");

const dotsContainer =
  document.getElementById("spotlightDots");

const floatingProfiles =
  document.querySelectorAll(".floating-profile");

let activeTestimonial = 0;
let autoplayTimer = null;

/* ==================================================
   CREATE NAVIGATION DOTS
================================================== */

function createDots() {
  dotsContainer.innerHTML = "";

  testimonials.forEach((testimonial, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "spotlight-dot";

    dot.setAttribute(
      "aria-label",
      `Afficher le témoignage de ${testimonial.name}`
    );

    dot.addEventListener("click", () => {
      showTestimonial(index);
      restartAutoplay();
    });

    dotsContainer.appendChild(dot);
  });
}

/* ==================================================
   DISPLAY TESTIMONIAL
================================================== */

function showTestimonial(index) {
  activeTestimonial = index;

  const testimonial = testimonials[index];

  spotlightCard.classList.remove("is-changing");

  void spotlightCard.offsetWidth;

  spotlightCard.classList.add("is-changing");

  spotlightImage.src = testimonial.image;
  spotlightImage.alt = testimonial.name;

  spotlightName.textContent = testimonial.name;
  spotlightRole.textContent = testimonial.role;
  spotlightMessage.textContent = testimonial.message;

  spotlightProgress.innerHTML = `
    <i class="fa-solid fa-arrow-trend-up"></i>
    ${testimonial.progress}
  `;

  spotlightLevel.textContent = testimonial.level;

  updateNavigation();
}

/* ==================================================
   UPDATE ACTIVE ELEMENTS
================================================== */

function updateNavigation() {
  const dots =
    document.querySelectorAll(".spotlight-dot");

  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "is-active",
      index === activeTestimonial
    );
  });

  floatingProfiles.forEach((profile, index) => {
    profile.classList.toggle(
      "is-active",
      index === activeTestimonial
    );
  });
}

/* ==================================================
   NEXT AND PREVIOUS
================================================== */

function showNextTestimonial() {
  const nextIndex =
    (activeTestimonial + 1) % testimonials.length;

  showTestimonial(nextIndex);
}

function showPreviousTestimonial() {
  const previousIndex =
    activeTestimonial === 0
      ? testimonials.length - 1
      : activeTestimonial - 1;

  showTestimonial(previousIndex);
}

nextButton.addEventListener("click", () => {
  showNextTestimonial();
  restartAutoplay();
});

previousButton.addEventListener("click", () => {
  showPreviousTestimonial();
  restartAutoplay();
});

/* ==================================================
   FLOATING PROFILE EVENTS
================================================== */

floatingProfiles.forEach((profile) => {
  profile.addEventListener("click", () => {
    const testimonialIndex =
      Number(profile.dataset.testimonial);

    showTestimonial(testimonialIndex);
    restartAutoplay();
  });
});

/* ==================================================
   AUTOPLAY
================================================== */

function startAutoplay() {
  stopAutoplay();

  autoplayTimer = window.setInterval(() => {
    showNextTestimonial();
  }, 5000);
}

function stopAutoplay() {
  if (autoplayTimer) {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

spotlightCard.addEventListener("mouseenter", stopAutoplay);
spotlightCard.addEventListener("mouseleave", startAutoplay);

/* ==================================================
   ANIMATED COUNTERS
================================================== */

const counters =
  document.querySelectorAll(".animated-counter");

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const suffix = counter.dataset.suffix || "";
  const decimals = Number(counter.dataset.decimals || 0);

  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easing =
      1 - Math.pow(1 - progress, 4);

    const currentValue = target * easing;

    counter.textContent =
      currentValue.toLocaleString("fr-FR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.45
  }
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

/* ==================================================
   REVEAL ON SCROLL
================================================== */

const revealElements =
  document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.12
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* ==================================================
   ACCESSIBILITY
================================================== */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
});

/* ==================================================
   INITIALIZATION
================================================== */

function initializeCommunity() {
  createDots();
  showTestimonial(0);
  startAutoplay();
}

initializeCommunity();