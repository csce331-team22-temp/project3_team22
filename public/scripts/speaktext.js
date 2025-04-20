let accessibilityEnabled = false;

function updateToggleButtonUI() {
    const btn = document.getElementById("speaktextBtn");

    if (accessibilityEnabled) {
        btn.classList.add("active");
        btn.innerText = "Text Voice On";
    } else {
        btn.classList.remove("active");
        btn.innerText = "Text Voice Off";
    }

  }

function speakText(text) {
    if (!accessibilityEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

function applySpeechEvents() {
    const elements = document.querySelectorAll('button, a, p, h1, h2, h3, label, span');
    elements.forEach(el => {
        el.addEventListener('mouseover', () => speakText(el.innerText || el.value));
    });
}

function toggleSpeech() {
    accessibilityEnabled = !accessibilityEnabled;
    localStorage.setItem('textspeech', accessibilityEnabled);
    alert("Voice accessibility " + (accessibilityEnabled ? "enabled" : "disabled"));

    window.location.href = '/';
}

// Load setting on page load
window.addEventListener('DOMContentLoaded', () => {
    accessibilityEnabled = localStorage.getItem('textspeech') === 'true';
    if (accessibilityEnabled) applySpeechEvents();
});

accessibilityEnabled = localStorage.getItem('textspeech') === 'true';

updateToggleButtonUI();