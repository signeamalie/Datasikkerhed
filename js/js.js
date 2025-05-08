'use strict';

// henter alle HTML sektioner der repræsenterer hvert scenarie i oplevelsen
const sections = document.querySelectorAll('.trin');

// initialisering af nødvendige værdier
let current = 0;       // sporer hvilket trin brugeren er på
let userChoices = [];  // gemmer brugerens valg som tekst
let score = 0;         // point bliver regnet ud senere

// viser det relevante trin og skjuler de andre
const showStep = (index) => {
  sections.forEach((section, i) => {
    section.style.display = i === index ? 'block' : 'none';
  });
};

// gemmer valget som tekst og opdaterer localStorage, så valgene kan hentes igen
const saveChoice = (text) => {
  userChoices.push(text);
  localStorage.setItem('userChoices', JSON.stringify(userChoices));
};

// udregner og viser en opsummering af brugerens handlinger og resultater
const showSummary = () => {
  const section = document.getElementById('userChoices');
  const list = document.getElementById('choicesList');
  const scoreDisplay = document.getElementById('scoreDisplay');
  list.innerHTML = ''; // rydder tidligere resultater

  // henter brugerens valg fra localStorage (eller starter tomt array)
  const saved = JSON.parse(localStorage.getItem('userChoices')) || [];

  // tjekker om bestemte valg svarer til de "sikre" handlinger
  const correctAnswers = [
    saved[1] === "ikke klikke på linket",       // phishing
    saved[2] === "ekstra sikkerhed",            // adgangskode/to-faktor
    saved[3] === "bruge VPN/mobildata"          // netværk
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
      correct: saved[1] === "ikke klikke på linket",
      value: saved[1]
    },
    {
      icon: "🔐",
      text: "Du tog et valg om to-faktor-godkendelse - og det var:",
      correct: saved[2] === "ekstra sikkerhed",
      value: saved[2]
    },
    {
      icon: "📶",
      text: "Da du var på café, valgte du at",
      correct: saved[3] === "bruge VPN/mobildata",
      value: saved[3]
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
  const id = e.target.id; // henter ID'et på den trykkede knap

  // switch bruges i stedet for if/else – giver bedre overblik med mange valgmuligheder
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
  showStep(current); // Starter ved trin 0

  // starter spillet
  document.getElementById('startBtn').addEventListener('click', () => {
    saveChoice("Startede scenariet");
    current++;
    showStep(current);
  });

  // alle valgknapper får event listener til checkAnswer
  document.querySelectorAll('.valgBtn').forEach(btn => {
    btn.addEventListener('click', checkAnswer);
  });

  // feedback-sider navigerer videre til næste trin
  document.getElementById('phishNext').addEventListener('click', () => {
    current = 4;
    showStep(current);
  });

  document.getElementById('safeNext').addEventListener('click', () => {
    current = 4;
    showStep(current);
  });

  document.getElementById('weakNext').addEventListener('click', () => {
    current = 7;
    showStep(current);
  });

  document.getElementById('strongNext').addEventListener('click', () => {
    current = 7;
    showStep(current);
  });

  // viser den afsluttende opsummering
  document.querySelector('.toSlutHøjRisiko').addEventListener('click', () => {
    saveChoice("Slutning: Høj risiko");
    showSummary();
  });

  document.querySelector('.toSlutFejl').addEventListener('click', () => {
    saveChoice("Slutning: Lær af fejl");
    showSummary();
  });

  // restart knap rydder valgene og starter forfra
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      localStorage.removeItem('userChoices');
      location.reload();
    });
  }
});
