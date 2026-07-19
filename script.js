/* =========================================================
   SKOOL LANDING PAGE — SCRIPT
   Small, dependency-free interactions for the components
   defined in index.html.
   ========================================================= */

/* ---------- 0. Loader / audio entry gate ----------
   The SKOOL tiles bounce in while skool.mp3 plays. The page stays
   hidden until the audio finishes — that's the "must hear it before
   you enter" rule. If the browser blocks autoplay (most browsers
   block audio-with-sound until a user gesture), a "Cliquez pour
   entrer" button appears; one click both satisfies the browser and
   starts the audio. Error/missing-file cases still let the visitor
   in so nobody gets stuck on a broken loader. */
(() => {
  const loader = document.getElementById('loader');
  const page = document.getElementById('page');
  const audio = document.getElementById('welcomeAudio');
  const enterBtn = document.getElementById('enterBtn');
  const TILE_ANIMATION_MS = 1200; // last tile delay (0.45s) + its own animation (0.85s)

  if (!loader || !page || !audio) return;

  function revealPage() {
    loader.classList.add('hide');
    page.classList.add('show');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }

  function markPlayedThisSession() {
    sessionStorage.setItem('skoolWelcomePlayed', 'true');
  }

  // Already heard it this session (e.g. navigated back to index.html) —
  // skip straight to the page instead of replaying the audio.
  if (sessionStorage.getItem('skoolWelcomePlayed')) {
    window.addEventListener('load', () => setTimeout(revealPage, TILE_ANIMATION_MS));
    return;
  }

  // Missing/broken audio file — don't trap the visitor behind the loader.
  audio.addEventListener('error', () => {
    markPlayedThisSession();
    revealPage();
  });

  // The page unlocks exactly when the welcome audio finishes playing.
  audio.addEventListener('ended', () => {
    markPlayedThisSession();
    revealPage();
  });

  function startAudio() {
    enterBtn.disabled = true;
    // enterBtn.textContent = 'Lecture en cours…';
    audio.play().catch(() => {
      // Still can't play for some reason — let them in rather than
      // leaving them stuck on the loader.
      markPlayedThisSession();
      revealPage();
    });
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay-with-sound blocked by the browser — require one
          // click, which satisfies the browser's gesture rule AND the
          // "must hear it to enter" rule.
          enterBtn.classList.add('show');
          enterBtn.addEventListener('click', startAudio, { once: true });
        });
      }
    }, TILE_ANIMATION_MS);
  }


);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Nav active state ----------
     Clicking a nav link marks it active and removes
     the active state from its siblings. */
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((el) => el.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* ---------- 2. Notification bell ----------
     Clicking the bell clears the unread badge, similar
     to "mark all as read". */
  const notificationBtn = document.querySelector('.notification-btn');
  const notificationBadge = document.querySelector('.notification-btn .badge');

  if (notificationBtn && notificationBadge) {
    notificationBtn.addEventListener('click', () => {
      notificationBadge.style.display = 'none';
    });
  }

  /* ---------- 3. Course "Cours" buttons ----------
     Placeholder click handler — replace with real
     navigation/routing to the course detail page. */
  const courseButtons = document.querySelectorAll('.btn-course');

  courseButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const card = button.closest('.course-card');
      const courseTitle = card ? card.querySelector('h3').textContent : 'this course';
      console.log(`Opening course: ${courseTitle}`);
      // Example: window.location.href = `/course/${slugify(courseTitle)}`;
    });
  });

  /* ---------- 4. "Explore courses" smooth scroll ----------
     Anchors already use CSS `scroll-behavior: smooth`,
     this just keeps focus management accessible. */
  const exploreBtn = document.querySelector('a[href="#courses"]');
  const coursesSection = document.getElementById('courses');

  if (exploreBtn && coursesSection) {
    exploreBtn.addEventListener('click', () => {
      coursesSection.setAttribute('tabindex', '-1');
      coursesSection.focus({ preventScroll: true });
    });
  }

});
