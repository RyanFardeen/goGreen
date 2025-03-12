// commit.cjs

const moment = require('moment');
const simpleGit = require('simple-git');
const fs = require('fs');

const git = simpleGit();

// ======== SETTINGS ========
const DAYS_BACK = 150; // How many days back to generate commits
const COMMITS_PER_DAY_MIN = 0; // Some days with no commits
const COMMITS_PER_DAY_MAX = 4; // Max commits in a day
const SKIP_WEEKENDS = true; // true = no commits on weekends

// Your GitHub identity (must match profile email)
const AUTHOR_NAME = 'Ryan Fardeen';
const AUTHOR_EMAIL = 'ryanfardeen.a@gmail.com'; // or your real email

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

(async () => {
  let currentDate = startDate.clone();

  while (currentDate.isBefore(endDate)) {
    // Skip weekends
    if (SKIP_WEEKENDS && (currentDate.day() === 0 || currentDate.day() === 6)) {
      currentDate.add(1, 'day');
      continue;
    }

    // Random number of commits today
    const commitsToday = Math.floor(
      Math.random() * (COMMITS_PER_DAY_MAX - COMMITS_PER_DAY_MIN + 1)
    ) + COMMITS_PER_DAY_MIN;

    for (let i = 0; i < commitsToday; i++) {
      // Random commit message
      const message = commitMessages[Math.floor(Math.random() * commitMessages.length)];

      // Spread commits through the day
      const commitTime = currentDate.clone()
        .hour(Math.floor(Math.random() * 10) + 9) // between 9 AM and 6 PM
        .minute(Math.floor(Math.random() * 60));

      // Make a dummy file change
      fs.writeFileSync('data.json', `${commitTime.format()} commit ${i}`);

      // Stage and commit with correct author & date
      await git.add('./*');
      await git.commit(message, {
        '--date': commitTime.format(),
        '--author': `${AUTHOR_NAME} <${AUTHOR_EMAIL}>`
      });
    }

    currentDate.add(1, 'day');
  }

  console.log('✅ All commits generated! Now push them:');
  console.log('   git push origin main');
})();
