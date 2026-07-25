"use strict";

/* ==================================================
   TESTIMONIAL DATA
================================================== */

const testimonials = [
  {
    name: "Prof. Karim Benali",
    role: "Professeur de mathématiques",
    image: "https://i.pravatar.cc/320?img=13",
    message:
      "SKOOL me permet de publier mes cours, créer des exercices interactifs et suivre précisément la progression de mes étudiants.",
    progress: "Impact : 320 étudiants",
    level: "23 cours"
  },
  {
    name: "Prof. Nadia El Idrissi",
    role: "Professeure de physique-chimie",
    image: "https://i.pravatar.cc/320?img=38",
    message:
      "La création des quiz, la gestion des devoirs et les statistiques détaillées rendent mon enseignement plus simple et plus efficace.",
    progress: "Impact : 240 étudiants",
    level: "18 cours"
  },
  {
    name: "Prof. Amine El Mansouri",
    role: "Professeur de développement web",
    image: "https://i.pravatar.cc/320?img=11",
    message:
      "Grâce à SKOOL, je peux proposer des formations pratiques en HTML, CSS, JavaScript et accompagner mes étudiants dans leurs projets.",
    progress: "Impact : 410 étudiants",
    level: "27 cours"
  },
  {
    name: "Prof. Salma Zahra",
    role: "Professeure de biologie et SVT",
    image: "https://i.pravatar.cc/320?img=47",
    message:
      "Les supports visuels, les évaluations et le suivi individualisé me permettent de mieux expliquer les notions scientifiques complexes.",
    progress: "Impact : 285 étudiants",
    level: "20 cours"
  },
  {
    name: "Prof. Mehdi Idrissi",
    role: "Professeur d’intelligence artificielle",
    image: "https://i.pravatar.cc/320?img=15",
    message:
      "SKOOL me permet de construire des parcours modernes en intelligence artificielle, machine learning et analyse de données.",
    progress: "Impact : 190 étudiants",
    level: "16 cours"
  },
  {
    name: "Prof. Sara Benali",
    role: "Professeure de langue anglaise",
    image: "https://i.pravatar.cc/320?img=32",
    message:
      "Les exercices de prononciation, la lecture audio et le suivi des compétences rendent l’apprentissage de l’anglais plus interactif.",
    progress: "Impact : 360 étudiants",
    level: "25 cours"
  },
  {
    name: "Prof. Yassine El Khattabi",
    role: "Professeur d’éducation physique et sportive",
    image: "https://i.pravatar.cc/320?img=12",
    message:
      "J’utilise SKOOL pour organiser mes cours d’EPS, proposer des ressources pédagogiques et préparer les candidats aux concours.",
    progress: "Impact : 275 étudiants",
    level: "21 cours"
  },
  {
    name: "Prof. Oumaima Zahraoui",
    role: "Professeure de design UI/UX",
    image: "https://i.pravatar.cc/320?img=49",
    message:
      "La plateforme me permet de présenter des projets de design, donner des feedbacks détaillés et suivre l’évolution créative des apprenants.",
    progress: "Impact : 160 étudiants",
    level: "14 cours"
  },
  {
    name: "Prof. Khalid El Amrani",
    role: "Professeur de géographie et géomatique",
    image: "https://i.pravatar.cc/320?img=68",
    message:
      "SKOOL est idéale pour partager des cartes, des données géographiques, des exercices SIG et des études de terrain.",
    progress: "Impact : 145 étudiants",
    level: "13 cours"
  },
  {
    name: "Prof. Imane Nadia",
    role: "Professeure de marketing digital",
    image: "https://i.pravatar.cc/320?img=44",
    message:
      "Je peux proposer des études de cas, des projets réels et des évaluations pour aider les étudiants à maîtriser le marketing numérique.",
    progress: "Impact : 220 étudiants",
    level: "19 cours"
  },
  {
    name: "Prof. Ayoub Bennani",
    role: "Professeur de programmation Python",
    image: "https://i.pravatar.cc/320?img=5",
    message:
      "Les exercices de code, les quiz et les projets progressifs permettent à mes étudiants d’apprendre Python de manière pratique.",
    progress: "Impact : 390 étudiants",
    level: "29 cours"
  },
  {
    name: "Prof. Lina El Fassi",
    role: "Professeure de littérature française",
    image: "https://i.pravatar.cc/320?img=45",
    message:
      "SKOOL facilite le partage de textes, l’analyse littéraire, les devoirs écrits et les échanges avec les étudiants.",
    progress: "Impact : 205 étudiants",
    level: "17 cours"
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
