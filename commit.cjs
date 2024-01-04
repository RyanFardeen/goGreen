// commit.cjs
const moment = require("moment");
const simpleGit = require("simple-git");
const fs = require("fs");

const git = simpleGit();

// ======== SETTINGS ========
const YEAR = 2024;
const DAYS_TO_FILL = 20;        // Only 20 days in the year get commits
const COMMITS_PER_DAY_MIN = 1;  // Min commits per chosen day
const COMMITS_PER_DAY_MAX = 4;  // Max commits per chosen day
const SKIP_WEEKENDS = true;     // true = avoid Sat/Sun

const AUTHOR_NAME = "Ryan Fardeen";
const AUTHOR_EMAIL = "ryanfardeen.a@gmail.com"; // Must be your GitHub verified email

const commitMessages = [
  "Fix bug in API handler",
  "Update dependencies",
  "Refactor dashboard layout",
  "Improve error handling",
  "Add unit tests",
  "Update README.md",
  "Optimize database queries",
  "Improve CSS styling",
  "Update package.json",
  "Fix typo in comments",
  "Enhance form validation"
];
// ==========================

// Helper: generate all days in the year
const allDaysInYear = [];
let date = moment(`${YEAR}-01-01`);
while (date.year() === YEAR) {
  if (!SKIP_WEEKENDS || (date.day() !== 0 && date.day() !== 6)) {
    allDaysInYear.push(date.clone());
  }
  date.add(1, "day");
}

// Pick random N days
const chosenDays = [];
while (chosenDays.length < DAYS_TO_FILL && allDaysInYear.length > 0) {
  const idx = Math.floor(Math.random() * allDaysInYear.length);
  chosenDays.push(allDaysInYear.splice(idx, 1)[0]);
}

(async () => {
  for (const day of chosenDays) {
    const commitsToday =
      Math.floor(Math.random() * (COMMITS_PER_DAY_MAX - COMMITS_PER_DAY_MIN + 1)) +
      COMMITS_PER_DAY_MIN;

    for (let i = 0; i < commitsToday; i++) {
      const message = commitMessages[Math.floor(Math.random() * commitMessages.length)];
      const commitTime = day.clone()
        .hour(Math.floor(Math.random() * 8) + 9) // 9am–5pm
        .minute(Math.floor(Math.random() * 60));

      fs.writeFileSync("data.json", `${commitTime.format()} commit ${i + 1}`);

      await git.add("./*");
      await git.commit(message, {
        "--date": commitTime.format(),
        "--author": `${AUTHOR_NAME} <${AUTHOR_EMAIL}>`
      });
    }
  }

  console.log(`✅ ${DAYS_TO_FILL} days of commits generated for ${YEAR}. Push to GitHub:`);
  console.log("   git push origin main");
})();
