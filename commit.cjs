const moment = require('moment');
const simpleGit = require('simple-git');
const fs = require('fs');

const git = simpleGit();

// ======== SETTINGS ========
const DAYS_BACK = 150; // Number of days back to make commits
const COMMITS_PER_DAY_MIN = 0; // Some days have no commits
const COMMITS_PER_DAY_MAX = 4; // Some days heavier
const SKIP_WEEKENDS = true; // Set false if you want weekends too

// Realistic commit messages
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

const startDate = moment().subtract(DAYS_BACK, 'days');
const endDate = moment();

// Helper to get random int between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {
  let currentDate = startDate.clone();

  while (currentDate.isBefore(endDate)) {
    // Skip weekends if enabled
    if (SKIP_WEEKENDS && (currentDate.day() === 0 || currentDate.day() === 6)) {
      currentDate.add(1, 'day');
      continue;
    }

    const commitsToday = getRandomInt(COMMITS_PER_DAY_MIN, COMMITS_PER_DAY_MAX);

    for (let i = 0; i < commitsToday; i++) {
      // Pick a realistic commit message
      const message = commitMessages[getRandomInt(0, commitMessages.length - 1)];

      // Spread commits over the day
      const commitTime = currentDate.clone()
        .hour(getRandomInt(9, 18))
        .minute(getRandomInt(0, 59));

      fs.writeFileSync('data.json', `${commitTime.format()} commit ${i}`);
      await git.add('./*');
      await git.commit(message, { '--date': commitTime.format() });
    }

    currentDate.add(1, 'day');
  }
})();
