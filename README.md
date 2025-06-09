# ⏱️ ForgeCron

A simple cron-based scheduler extension for [ForgeScript](https://github.com/tryforge/forgescript).

## 📦 Installation

```bash
npm install github:Tape490/ForgeCron
```

## 🚀 Usage

```js
const { ForgeClient } = require('@tryforge/forgescript');
const { ForgeCron } = require('forgecron');

const client = new ForgeClient({
  // Your bot configuration
  extensions: [
    new ForgeCron()
  ]
});
```

## 📚 Functions

### $cron[jobId;cronExpression;code]

Schedules a task using cron expression.

- `jobId`: A unique identifier for this cron job
- `cronExpression`: A valid cron expression (e.g., `0 * * * *` for every hour)
- `code`: The ForgeScript code to execute when the cron job runs

Returns: The job ID if successful, empty string if failed.

Example:
```js
// Send a message every day at 9:00 AM
$cron[dailyGreeting;0 9 * * *;$sendMessage[$channelID;Good morning!]]
```

### $deleteCron[jobId]

Deletes a scheduled cron job.

- `jobId`: The ID of the cron job to delete

Returns: `true` if deleted, `false` otherwise.

Example:
```js
$cron[myJob;0 9 * * *;$sendMessage[$channelID;Hello!]]
$deleteCron[myJob]
```

## 📅 Cron Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── month (1-12)
│ │ └─────── day of month (1-31)
│ └───────── hour (0-23)
└─────────── minute (0-59)
```

Examples:
- `0 * * * *` - Every hour
- `*/15 * * * *` - Every 15 minutes
- `0 9 * * 1-5` - 9 AM, Monday-Friday
- `0 0 1 * *` - First day of each month
