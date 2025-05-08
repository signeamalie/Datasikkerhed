'use strict';

// henter alle HTML sektioner der repræsenterer hvert scenarie i oplevelsen
const sections = document.querySelectorAll('.trin');

// initialisering af nødvendige værdier
let current = 0;       // sporer hvilket trin brugeren er på

// jeg bruger et array (userChoices) til at gemme brugerens valg undervejs i oplevelsen.
// localStorage bruges ikke, da jeg ønsker at nulstille valgene hver gang brugeren genindlæser siden.
// dette gør oplevelsen mere dynamisk og sikrer, at brugeren altid starter fra begyndelsen.

let userChoices = [];  // gemmer brugerens valg som tekst
let score = 0;         // point bliver regnet ud senere

// funktion der viser det relevante trin og skjuler de andre
const showStep = (index) => {
  sections.forEach((section, i) => {
    section.style.display = i === index ? 'block' : 'none';
  });
};

// funktion der gemmer valget i arrayet
const saveChoice = (text) => {
  userChoices.push(text);
};

// funktion der udregner og viser en opsummering af brugerens handlinger og resultater
const showSummary = () => {
  const section = document.getElementById('userChoices');
  const list = document.getElementById('choicesList');
  const scoreDisplay = document.getElementById('scoreDisplay');
  list.innerHTML = ''; // Rydder tidligere resultater

  // tjekker om hvert valg var korrekt
  const correctAnswers = [
    userChoices[1] === "ikke klikke på linket", // phishing
    userChoices[2] === "ekstra sikkerhed",      // adgangskode/to-faktor
    userChoices[3] === "bruge VPN/mobildata"    // netværk
  ];

  // beregner antal rigtige svar (true) i arrayet
  const scoreCalculated = correctAnswers.filter(Boolean).length;

  // opretter overskrift, som tilpasses brugerens score
  const heading = document.createElement('h2');
  heading.classList.add('highlight');
  heading.style.fontSize = '1.3rem';
  heading.style.margin = '0 auto 2rem auto';
  heading.style.maxWidth = '40ch';

  switch (scoreCalculated) {
    case 3:
      heading.innerHTML = "🌟 Du klarede det hele uden at blive snydt! Du er cyber-sikker!";
      break;
    case 2:
    case 1:
      heading.innerHTML = "😅 Du blev snydt 1-2 gange. Du har en god forståelse, øvelse gør mester!";
      break;
    default:
      heading.innerHTML = "⚠️ Du blev snydt 3 gange. Nu ved du, hvad du skal holde øje med næste gang!";
  }

  section.prepend(heading);

  // viser en liste med brugerens valg og om de var rigtige
  const feedback = [
    {
      icon: "🧩",
      text: "Da du fik et link fra en ven, valgte du at",
      correct: userChoices[1] === "ikke klikke på linket",
      value: userChoices[1]
    },
    {
      icon: "🔐",
      text: "Du tog et valg om to-faktor-godkendelse - og det var:",
      correct: userChoices[2] === "ekstra sikkerhed",
      value: userChoices[2]
    },
    {
      icon: "📶",
      text: "Da du var på café, valgte du at",
      correct: userChoices[3] === "bruge VPN/mobildata",
      value: userChoices[3]
    }
  ];

  // opretter listeelementer med feedback for hvert valg
  feedback.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.icon} ${item.text} ${item.value || "..."}`;
    li.classList.add('choice-card');
    li.textContent += item.correct ? " ✅" : " ❌";
    list.appendChild(li);
  });

  // viser brugerens point score
  scoreDisplay.innerHTML = `<p><strong>Din cybersikkerheds-score:</strong> ${scoreCalculated} point</p>`;
  section.style.display = 'block';
  showStep(sections.length - 1);
};

// funktion der styrer hvad der sker, når brugeren vælger et svar
const checkAnswer = (e) => {
  const id = e.target.id;

  switch (id) {
    case 'klikBtn':
      saveChoice("klikke på linket");
      current = 2;
      break;
    case 'ignorBtn':
      saveChoice("ikke klikke på linket");
      current = 3;
      break;
    case 'passwordBad':
      saveChoice("min unikke kode er nok");
      current = 5;
      break;
    case 'passwordStrong':
      saveChoice("ekstra sikkerhed");
      current = 6;
      break;
    case 'wifiOpen':
      saveChoice("bruge åbent net uden VPN");
      current = 8;
      break;
    case 'wifiSecure':
      saveChoice("bruge VPN/mobildata");
      current = 9;
      break;
  }

  showStep(current); // vis næste trin baseret på valget
};

// når hele HTML dokumentet er indlæst, tilføjes alle event listeners
document.addEventListener('DOMContentLoaded', () => {
  showStep(current); // starter ved trin 0

  // start
  document.getElementById('startBtn').addEventListener('click', () => {
    saveChoice("Startede scenariet");
    current++;
    showStep(current);
  });

  // alle valgknapper får event listener til checkAnswer
  document.querySelectorAll('.valgBtn').forEach(btn => {
    btn.addEventListener('click', checkAnswer);
  });

  // event listener til næste trin
  const nextStepBtns = ['phishNext', 'safeNext', 'weakNext', 'strongNext'];
  nextStepBtns.forEach(btnId => {
    document.getElementById(btnId).addEventListener('click', () => {
      current = (btnId === 'weakNext' || btnId === 'strongNext') ? 7 : 4;
      showStep(current);
    });
  });

  // viser den afsluttende opsummering
  document.querySelector('.toSlutHøjRisiko').addEventListener('click', showSummary);
  document.querySelector('.toSlutFejl').addEventListener('click', showSummary);

  // start forfra
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      userChoices = []; // nulstiller valgene
      location.reload();
    });
  }
});