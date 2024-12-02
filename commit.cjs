// commit.cjs
const moment = require("moment");
const simpleGit = require("simple-git");
const fs = require("fs");

const git = simpleGit();

// ======== SETTINGS ========
const START_DATE = moment("2024-12-01");
const END_DATE = moment("2024-12-31");
const COMMITS_PER_DAY_MIN = 1;  // Min commits per day
const COMMITS_PER_DAY_MAX = 4;  // Max commits per day
const SKIP_WEEKENDS = true;     // true = no weekend commits

const AUTHOR_NAME = "Ryan Fardeen";
const AUTHOR_EMAIL = "ryanfardeen.a@gmail.com"; // must match GitHub verified email

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

(async () => {
  let currentDate = START_DATE.clone();

  while (currentDate.isSameOrBefore(END_DATE)) {
    if (SKIP_WEEKENDS && (currentDate.day() === 0 || currentDate.day() === 6)) {
      currentDate.add(1, "day");
      continue;
    }

    const commitsToday =
      Math.floor(Math.random() * (COMMITS_PER_DAY_MAX - COMMITS_PER_DAY_MIN + 1)) +
      COMMITS_PER_DAY_MIN;

    for (let i = 0; i < commitsToday; i++) {
      const message = commitMessages[Math.floor(Math.random() * commitMessages.length)];
      const commitTime = currentDate.clone()
        .hour(Math.floor(Math.random() * 8) + 9) // 9am–5pm
        .minute(Math.floor(Math.random() * 60));

      fs.writeFileSync("data.json", `${commitTime.format()} commit ${i + 1}`);

      await git.add("./*");
      await git.commit(message, {
        "--date": commitTime.format(),
        "--author": `${AUTHOR_NAME} <${AUTHOR_EMAIL}>`
      });
    }

    currentDate.add(1, "day");
  }

  console.log("✅ All commits generated for Dec 2024. Now push them:");
  console.log("   git push origin main");
})();
