const form = document.getElementById("loveForm");
const landingPanel = document.getElementById("landingPanel");
const loadingPanel = document.getElementById("loadingPanel");
const resultPanel = document.getElementById("resultPanel");
const meterProgress = document.getElementById("meterProgress");
const meterPercent = document.getElementById("meterPercent");
const scoreCircle = document.getElementById("scoreCircle");
const resultMessage = document.getElementById("resultMessage");
const resultFootnote = document.getElementById("resultFootnote");
const shareBtn = document.getElementById("shareBtn");
const downloadBtn = document.getElementById("downloadBtn");
const homeBtn = document.getElementById("homeBtn");
const lover1Input = document.getElementById("lover1");
const lover2Input = document.getElementById("lover2");

const messages = [
  "are giving off major heart-eye energy.",
  "have a spark that feels a little extra cute.",
  "are basically a rom-com waiting to happen.",
  "have a silly little cosmic crush brewing.",
  "are making the stars do a happy dance.",
  "have a soft, fluffy love vibe going on."
];

const footnotes = [
  "The stars are giggling, and so are the hearts.",
  "This is just for fun, but the vibe is adorable.",
  "Cute chaos, tiny flirtation, and lots of sparkle.",
  "A little nonsense, a little magic, and a whole lot of charm."
];

let currentResult = {
  name1: "",
  name2: "",
  score: 0,
  message: ""
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name1 = (lover1Input.value || "Cutie").trim() || "Cutie";
  const name2 = (lover2Input.value || "Sweetheart").trim() || "Sweetheart";

  landingPanel.classList.add("hidden");
  loadingPanel.classList.remove("hidden");
  resultPanel.classList.add("hidden");

  meterProgress.style.strokeDashoffset = "565.48";
  meterPercent.textContent = "0%";

  // Special love match for Anirban & Madhumita
  const name1Upper = name1.toUpperCase();
  const name2Upper = name2.toUpperCase();
  let target;
  
  if (
    (name1Upper === "ANIRBAN" && name2Upper === "MADHUMITA") ||
    (name1Upper === "MADHUMITA" && name2Upper === "ANIRBAN")
  ) {
    target = Math.floor(Math.random() * 10) + 90; // 90-99 for special pair
  } else {
    target = Math.floor(Math.random() * 100) + 1; // 1-100 for others
  }
  
  const holdTime = 10000 + Math.floor(Math.random() * 10000);
  
  let randomAnimationInterval;
  const startTime = performance.now();
  
  // Show random percentages while calculating
  randomAnimationInterval = setInterval(() => {
    const randomPercent = Math.floor(Math.random() * 100) + 1;
    const circumference = 565.48;
    const offset = circumference * (1 - randomPercent / 100);
    
    meterPercent.textContent = `${randomPercent}%`;
    meterProgress.style.strokeDashoffset = offset;
  }, 200);

  // After holdTime, animate to final target
  setTimeout(() => {
    clearInterval(randomAnimationInterval);
    animateMeter(target, () => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const randomFootnote = footnotes[Math.floor(Math.random() * footnotes.length)];

      resultMessage.textContent = `${name1} and ${name2} ${randomMessage}`;
      resultFootnote.textContent = randomFootnote;
      scoreCircle.textContent = `${target}%`;

      currentResult = {
        name1,
        name2,
        score: target,
        message: `${name1} and ${name2} ${randomMessage}`
      };

      loadingPanel.classList.add("hidden");
      resultPanel.classList.remove("hidden");
    });
  }, holdTime);
});

function animateMeter(target, done) {
  const duration = 1600;
  const startTime = performance.now();
  const circumference = 565.48;

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    const offset = circumference * (1 - eased);

    meterPercent.textContent = `${current}%`;
    meterProgress.style.strokeDashoffset = offset;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      done();
    }
  }

  requestAnimationFrame(frame);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildCardSvg() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
      <rect width="1080" height="1350" rx="40" fill="#fff7fb"/>
      <rect x="40" y="40" width="1000" height="1270" rx="34" fill="#ffffff"/>
      <circle cx="810" cy="250" r="120" fill="#ffe4ee"/>
      <circle cx="250" cy="980" r="140" fill="#ffe8ca"/>
      <text x="540" y="260" text-anchor="middle" font-size="56" font-family="Arial" fill="#ff5c9a">💘 Love Spark</text>
      <text x="540" y="400" text-anchor="middle" font-size="36" font-family="Arial" fill="#5b3550">${escapeXml(currentResult.name1)} + ${escapeXml(currentResult.name2)}</text>
      <text x="540" y="610" text-anchor="middle" font-size="120" font-family="Arial" font-weight="700" fill="#ff5c9a">${currentResult.score}%</text>
      <text x="540" y="760" text-anchor="middle" font-size="28" font-family="Arial" fill="#5b3550">${escapeXml(currentResult.message)}</text>
      <text x="540" y="1180" text-anchor="middle" font-size="26" font-family="Arial" fill="#9b6b7b">Made with a tiny bit of sparkle and a lot of fun 💖</text>
    </svg>
  `;
}

async function createCardImageFile() {
  const svg = buildCardSvg();
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  const image = new Image();
  image.src = svgUrl;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  URL.revokeObjectURL(svgUrl);

  const pngBlob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  return new File([pngBlob], `love-card-${Date.now()}.png`, { type: "image/png" });
}

shareBtn.addEventListener("click", async () => {
  if (!currentResult.name1 || !currentResult.name2) return;

  try {
    const imageFile = await createCardImageFile();

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      await navigator.share({
        title: "Love Spark Calculator",
        text: "Check out our love spark result!",
        files: [imageFile]
      });
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent("Check out our love spark card!")}`;
      window.open(whatsappUrl, "_blank");

      const downloadUrl = URL.createObjectURL(imageFile);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = imageFile.name;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    }
  } catch (error) {
    console.error("Unable to share image", error);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent("Check out our love spark card!")}`;
    window.open(whatsappUrl, "_blank");
  }
});

downloadBtn.addEventListener("click", () => {
  const svg = buildCardSvg();
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `love-card-${Date.now()}.svg`;
  link.click();
  URL.revokeObjectURL(url);
});

homeBtn.addEventListener("click", () => {
  lover1Input.value = "";
  lover2Input.value = "";
  landingPanel.classList.remove("hidden");
  loadingPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
});
