# ForgeCron

A ForgeScript extension that adds cron job scheduling functionality to your Discord bot.

Based on the [node-cron](https://github.com/node-cron/node-cron) package.

## Installation

```bash
npm install github:Tape490/ForgeCron
```

## Setup

```javascript
const { ForgeClient } = require("@tryforge/forgescript");
const { ForgeCron } = require("forgecron");

const client = new ForgeClient({
    extensions: [
        new ForgeCron()
    ]
});
```

## Functions

### `$cron[code;schedule;timezone?;name?]`

Creates a scheduled cron job that executes ForgeScript code at specified intervals.

**Parameters:**
- `code` - The ForgeScript code to execute
- `schedule` - Cron expression (e.g., `0 9 * * *` for daily at 9 AM)
- `timezone` - Optional timezone (defaults to UTC)
- `name` - Optional custom name for the job

**Examples:**
```javascript
// Run every minute
$cron[$log[Hello World!];* * * * *]

// Run daily at 9 AM EST
$cron[$sendMessage[123456789;Good morning!];0 9 * * *;America/New_York]

// Run every 5 minutes with custom name
$cron[$log[Heartbeat];*/5 * * * *;;Heartbeat]
```

### `$deleteCron[jobId]`

Deletes a cron job by its name.

```javascript
$deleteCron[Heartbeat]
```

## Cron Expression Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of Week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of Month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

### Common Examples

| Expression | Description |
|------------|-------------|
| `* * * * *` | Every minute |
| `0 * * * *` | Every hour |
| `0 0 * * *` | Daily at midnight |
| `0 9 * * 1-5` | Weekdays at 9 AM |
| `*/5 * * * *` | Every 5 minutes |
| `0 */2 * * *` | Every 2 hours |

## Supported Timezones

Common IANA timezone identifiers:

**Americas:** `America/New_York`, `America/Chicago`, `America/Los_Angeles`  
**Europe:** `Europe/London`, `Europe/Paris`, `Europe/Berlin`  
**Asia:** `Asia/Tokyo`, `Asia/Shanghai`, `Asia/Kolkata`  
**Australia:** `Australia/Sydney`, `Australia/Melbourne`  
**Other:** `UTC` (default)

[Full timezone list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## Examples

```javascript
// Daily reminder at 8 AM EST
$cron[
    $sendMessage[123456789;Good morning!];
    0 8 * * *;
    America/New_York;
    Daily Reminder
]

// Weekly maintenance warning (Sundays at 3 AM)
$cron[
    $sendMessage[123456789;Server maintenance in 30 minutes!];
    30 2 * * 0;
    UTC;
    Maintenance
]
```

## Notes

- Functions return no output on success
- Jobs persist until bot restart
- Multiple jobs can run simultaneously
- Minimum interval is 1 minute

