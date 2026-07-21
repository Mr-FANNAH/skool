const lessonText =
  "Do you like listening to and reading stories? Reading stories is a great way to improve your vocabulary and we have lots of great stories for you to watch. Watch stories, print activities and post comments!";

/*
  --- Real audio mode (recommended) ---
  If you record real audio for this lesson, set AUDIO_SRC to the file
  and fill WORD_TIMINGS with the exact start/end second for every word
  (e.g. exported from Adobe Podcast, Descript, or a forced-aligner like
  Gentle/aeneas). When AUDIO_SRC is set, script.js plays that file and
  drives highlighting off its real audio.currentTime — this is the
  precise, production-ready path.

  --- TTS fallback mode (used when AUDIO_SRC is null) ---
  Without a recorded file, the browser's speechSynthesis voice reads the
  text instead. Rather than trusting the utterance's onboundary event
  (support is inconsistent — Firefox fires per-word reliably, Chrome is
  patchy, Safari barely fires it at all), we build our own play clock:
  a requestAnimationFrame loop reads elapsed time since playback started,
  exactly like reading audio.currentTime off an <audio> element, and
  matches that elapsed time against a precomputed WORD_TIMINGS table.
  Swapping in a real recording later means dropping AUDIO_SRC in — the
  highlighting logic below does not change.
*/
const AUDIO_SRC = null; // e.g. "lesson.mp3"
let WORD_TIMINGS = null; // e.g. [{ start: 0, end: 0.42 }, ...] — one entry per word, seconds

const readingText = document.getElementById("readingText");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const speedSelect = document.getElementById("speedSelect");
const statusText = document.getElementById("statusText");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

let utterance = null;
let isPaused = false;
let isSpeaking = false;
let currentWordIndex = -1;

let audioEl = null; // <audio> element when AUDIO_SRC is set
let clockStart = 0; // performance.now() at playback start, adjusted for pauses
let pausedElapsed = 0; // seconds already elapsed when paused
let rafId = null;
let totalDuration = 0; // seconds, estimated or real

/*
  Stores information about every word:

  {
    text: "Learning",
    start: 0,
    end: 8,
    element: HTMLSpanElement
  }
*/
const words = [];

/**
 * Converts the paragraph into spans while preserving
 * the original character positions.
 */
function createWordElements(text) {
  readingText.innerHTML = "";
  words.length = 0;

  const wordPattern = /\S+/g;
  let match;
  let previousEnd = 0;

  while ((match = wordPattern.exec(text)) !== null) {
    const word = match[0];
    const start = match.index;
    const end = start + word.length;

    if (start > previousEnd) {
      const whitespace = text.slice(previousEnd, start);
      readingText.appendChild(document.createTextNode(whitespace));
    }

    const span = document.createElement("span");

    span.className = "word";
    span.textContent = word;
    span.dataset.wordIndex = String(words.length);

    readingText.appendChild(span);

    words.push({
      text: word,
      start,
      end,
      element: span,
      // filled in by buildEstimatedTimings() / real WORD_TIMINGS
      timeStart: 0,
      timeEnd: 0
    });

    previousEnd = end;
  }

  if (previousEnd < text.length) {
    readingText.appendChild(document.createTextNode(text.slice(previousEnd)));
  }
}

/**
 * Estimates a start/end timestamp (in seconds) for every word, based on
 * character length and the selected reading speed. This stands in for
 * real audio timings when no recorded file is available. Short pauses
 * are added after sentence-ending punctuation so highlighting breathes
 * the way natural speech does.
 */
function buildEstimatedTimings(rate) {
  const secondsPerChar = 0.058; // tuned for an average TTS voice at rate 1
  const minWordDuration = 0.16;
  const sentenceEndPause = 0.28;
  const commaPause = 0.12;

  let cursor = 0.15; // small lead-in before the first word

  words.forEach((word) => {
    const duration = Math.max(
      minWordDuration,
      word.text.length * secondsPerChar
    ) / rate;

    word.timeStart = cursor;
    word.timeEnd = cursor + duration;
    cursor = word.timeEnd;

    if (/[.!?]$/.test(word.text)) {
      cursor += sentenceEndPause / rate;
    } else if (/,$/.test(word.text)) {
      cursor += commaPause / rate;
    }
  });

  totalDuration = cursor;
}

/**
 * Applies real, pre-measured timings (used automatically once
 * WORD_TIMINGS is populated for a recorded lesson).
 */
function applyRealTimings(timings) {
  words.forEach((word, index) => {
    const timing = timings[index];

    word.timeStart = timing.start;
    word.timeEnd = timing.end;
  });

  totalDuration = timings[timings.length - 1].end;
}

/**
 * Finds the word whose [timeStart, timeEnd) range contains the given
 * elapsed time, exactly the way you'd match audio.currentTime against
 * a word-timings track.
 */
function findWordIndexByTime(elapsed) {
  // Words are in chronological order, so a linear scan is cheap and
  // simple; swap for a binary search if the lesson text gets very long.
  for (let i = words.length - 1; i >= 0; i--) {
    if (elapsed >= words[i].timeStart) {
      return i;
    }
  }

  return -1;
}

/**
 * Highlights the current word and marks everything before it as read.
 */
function highlightWord(index) {
  if (index < 0 || index >= words.length || index === currentWordIndex) {
    return;
  }

  currentWordIndex = index;

  words.forEach((word, wordIndex) => {
    word.element.classList.remove("active");
    word.element.classList.toggle("completed", wordIndex < index);
  });

  const currentWord = words[index];

  currentWord.element.classList.add("active");

  currentWord.element.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "nearest"
  });
}

/**
 * Updates the progress bar and percentage label.
 */
function updateProgress(elapsed) {
  const ratio = totalDuration > 0
    ? Math.min(1, Math.max(0, elapsed / totalDuration))
    : 0;

  progressFill.style.width = `${ratio * 100}%`;
  progressText.textContent = `${Math.round(ratio * 100)}%`;
}

/**
 * Clears word highlighting and progress.
 */
function resetHighlighting() {
  currentWordIndex = -1;

  words.forEach((word) => {
    word.element.classList.remove("active", "completed");
  });

  updateProgress(0);
}

/**
 * Reads the current playback position. This is the single source of
 * truth the highlighter listens to — real audio.currentTime when a
 * recording is playing, or our own performance-based clock in TTS mode.
 */
function getCurrentTime() {
  if (audioEl) {
    return audioEl.currentTime;
  }

  if (isPaused) {
    return pausedElapsed;
  }

  return (performance.now() - clockStart) / 1000;
}

/**
 * The sync loop: reads the current time every animation frame and
 * highlights whichever word owns that timestamp.
 */
function syncTick() {
  if (!isSpeaking) {
    return;
  }

  const elapsed = getCurrentTime();

  highlightWord(findWordIndexByTime(elapsed));
  updateProgress(elapsed);

  if (!isPaused && elapsed < totalDuration) {
    rafId = requestAnimationFrame(syncTick);
  } else if (!isPaused && elapsed >= totalDuration) {
    // TTS mode has no natural "ended" event tied to our clock, so we
    // stop the loop here; utterance.onend still fires and finalizes UI.
    rafId = null;
  }
}

/**
 * Attempts to select an English voice.
 */
function getEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();

  return (
    voices.find((voice) => voice.lang === "en-US") ||
    voices.find((voice) => voice.lang.startsWith("en")) ||
    null
  );
}

function finishReading() {
  isSpeaking = false;
  isPaused = false;

  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  words.forEach((word) => {
    word.element.classList.remove("active");
    word.element.classList.add("completed");
  });

  updateProgress(totalDuration);

  statusText.textContent = "Reading completed. You can listen again.";
  playButton.textContent = "▶ Read again";
  pauseButton.textContent = "⏸ Pause";
}

/**
 * Starts reading the complete paragraph, in real-audio mode or
 * TTS-with-estimated-clock mode.
 */
function startReading() {
  const rate = Number(speedSelect.value);

  // Resume when playback is currently paused.
  if (isSpeaking && isPaused) {
    if (audioEl) {
      audioEl.play();
    } else {
      window.speechSynthesis.resume();
      clockStart = performance.now() - pausedElapsed * 1000;
      rafId = requestAnimationFrame(syncTick);
    }

    isPaused = false;
    statusText.textContent = "Reading resumed.";
    pauseButton.textContent = "⏸ Pause";

    return;
  }

  resetHighlighting();

  if (AUDIO_SRC && WORD_TIMINGS) {
    startAudioFileReading(rate);
  } else {
    if (!("speechSynthesis" in window)) {
      statusText.textContent =
        "Speech synthesis is not supported by this browser.";

      return;
    }

    startTtsReading(rate);
  }
}

function startAudioFileReading(rate) {
  applyRealTimings(WORD_TIMINGS);

  if (!audioEl) {
    audioEl = new Audio(AUDIO_SRC);

    audioEl.addEventListener("play", () => {
      isSpeaking = true;
      isPaused = false;

      statusText.textContent = "Reading the paragraph...";
      playButton.textContent = "▶ Resume";
    });

    audioEl.addEventListener("ended", finishReading);
  }

  audioEl.currentTime = 0;
  audioEl.playbackRate = rate;
  audioEl.play();

  rafId = requestAnimationFrame(syncTick);
}

function startTtsReading(rate) {
  window.speechSynthesis.cancel();

  buildEstimatedTimings(rate);

  utterance = new SpeechSynthesisUtterance(lessonText);

  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;

  const englishVoice = getEnglishVoice();

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  utterance.onstart = () => {
    isSpeaking = true;
    isPaused = false;
    pausedElapsed = 0;
    clockStart = performance.now();

    statusText.textContent = "Reading the paragraph...";
    playButton.textContent = "▶ Resume";
    pauseButton.textContent = "⏸ Pause";

    rafId = requestAnimationFrame(syncTick);
  };

  utterance.onend = () => {
    // Only finalize if this utterance wasn't superseded by a restart.
    if (isSpeaking) {
      finishReading();
    }
  };

  utterance.onerror = (event) => {
    if (event.error === "canceled" || event.error === "interrupted") {
      return;
    }

    isSpeaking = false;
    isPaused = false;

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    statusText.textContent = `Speech error: ${event.error}`;
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Pauses or resumes the current playback.
 */
function togglePause() {
  if (!isSpeaking) {
    return;
  }

  if (isPaused) {
    startReading(); // resumes via the branch above
    return;
  }

  if (audioEl) {
    audioEl.pause();
  } else {
    pausedElapsed = (performance.now() - clockStart) / 1000;
    window.speechSynthesis.pause();

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  isPaused = true;
  pauseButton.textContent = "▶ Resume";
  statusText.textContent = "Reading paused.";
}

/**
 * Cancels playback and starts from the beginning.
 */
function restartReading() {
  if (audioEl) {
    audioEl.pause();
  } else {
    window.speechSynthesis.cancel();
  }

  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  isSpeaking = false;
  isPaused = false;

  startReading();
}

/**
 * Restart playback when the reading speed changes, so the clock and
 * the voice's actual pace stay in sync.
 */
function changeSpeed() {
  if (isSpeaking) {
    restartReading();
  }
}

playButton.addEventListener("click", startReading);
pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", restartReading);
speedSelect.addEventListener("change", changeSpeed);

// Stop playback when the user leaves or refreshes the page.
window.addEventListener("beforeunload", () => {
  if (audioEl) {
    audioEl.pause();
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

// Some browsers load available voices asynchronously.
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

createWordElements(lessonText);
buildEstimatedTimings(Number(speedSelect.value));
