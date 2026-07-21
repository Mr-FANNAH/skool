document.addEventListener("DOMContentLoaded", function () {
  let progress = 42;

  const progressBar = document.getElementById("progressBar");
  const progressValue = document.getElementById("progressValue");
  const continueButton = document.getElementById("continueLearning");
  const navButtons = document.querySelectorAll(".profile-nav button");
  const notificationButtons = document.querySelectorAll(".top-icon");

  continueButton.addEventListener("click", function () {
    progress = Math.min(100, progress + 2);
    progressBar.style.width = progress + "%";
    progressValue.textContent = progress + "%";

    if (progress === 100) {
      continueButton.innerHTML = "Course completed ✓";
      continueButton.disabled = true;
    }
  });

  navButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      navButtons.forEach(function (item) {
        item.classList.remove("active");
      });
      button.classList.add("active");
    });
  });

  notificationButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const badge = button.querySelector(".notif-badge");
      if (badge) {
        badge.style.display = "none";
      }
    });
  });
});
