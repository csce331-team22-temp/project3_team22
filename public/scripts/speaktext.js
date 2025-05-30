let accessibilityEnabled = false;

function updateToggleButtonUI() {
    const btn = document.getElementById("speaktextBtn");

    if (btn) {
        if (accessibilityEnabled) {
            btn.style.backgroundColor = "#4CAF50";
            btn.style.color = "white";
            btn.innerText = "Text Voice On";
        } else {
            btn.style.backgroundColor = "#eee";
            btn.style.color = "#333";
            btn.innerText = "Text Voice Off";
        }
    }

}

function speakText(text) {
    if (!accessibilityEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

function applySpeechEvents() {
    const elements = document.querySelectorAll('button, a, p, h1, h2, h3, h4, label, span, th, td, input, li, summary');

    elements.forEach(el => {
        el.addEventListener('mouseover', () => speakText(el.innerText || el.value));
    });
}

function toggleSpeech() {
    accessibilityEnabled = !accessibilityEnabled;
    localStorage.setItem('textspeech', accessibilityEnabled);
    alert("Voice accessibility " + (accessibilityEnabled ? "enabled. Note: Make sure to click anywhere on the page after signing in through Google to continue using voice feature!" : "disabled"));

    window.location.href = '/';
}

window.addEventListener('DOMContentLoaded', () => {
    accessibilityEnabled = localStorage.getItem('textspeech') === 'true';
    if (accessibilityEnabled) applySpeechEvents();
    updateToggleButtonUI();

});
