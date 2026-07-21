/* =========================================================
   LANGUAGE COURSE CARD — COMPONENT SCRIPT
   Small, dependency-free click handlers. Replace the
   console.log calls with real navigation/routing.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.lang-card').forEach((card) => {
    const title = card.querySelector('.lang-card__title')?.textContent ?? 'course';

    card.querySelector('.btn-cta')?.addEventListener('click', () => {
      console.log(`Starting course: ${title}`);
      // Example: window.location.href = `/courses/${slugify(title)}/start`;
    });

    card.querySelector('.btn-info-outline')?.addEventListener('click', () => {
      console.log(`Opening syllabus: ${title}`);
      // Example: window.location.href = `/courses/${slugify(title)}`;
    });
  });

});
