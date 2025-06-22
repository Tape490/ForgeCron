"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const cron = __importStar(require("node-cron"));
const uuid_1 = require("uuid");
exports.default = new forgescript_1.NativeFunction({
    name: "$cron",
    version: "1.0.0",
    description: "Creates a scheduled cron job",
    unwrap: false,
    brackets: true,
    args: [
        {
            name: "code",
            description: "The code to execute when cron triggers",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
        {
            name: "schedule",
            description: "Cron schedule expression (e.g., '0 0 * * *' for daily at midnight)",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
        {
            name: "timezone",
            description: "Timezone for the cron job (optional)",
            rest: false,
            type: forgescript_1.ArgType.String,
        },
        {
            name: "name",
            description: "Custom name for the job (optional)",
            rest: false,
            type: forgescript_1.ArgType.String,
        },
    ],
    async execute(ctx) {
        const code = this.data.fields[0];
        const schedule = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](schedule))
            return schedule;
        const timezone = await this["resolveUnhandledArg"](ctx, 2);
        if (!this["isValidReturnType"](timezone))
            return timezone;
        const name = await this["resolveUnhandledArg"](ctx, 3);
        if (!this["isValidReturnType"](name))
            return name;
        try {
            // Validate cron expression first
            if (!cron.validate(schedule.value)) {
                return this.customError("Invalid cron schedule expression");
            }
            // Validate timezone if provided
            const timezoneValue = timezone.value || "UTC";
            if (timezoneValue && timezoneValue !== "UTC") {
                // Basic timezone validation - check if it's a valid timezone
                try {
                    new Date().toLocaleString("en-US", { timeZone: timezoneValue });
                }
                catch (error) {
                    return this.customError(`Invalid time zone specified: ${timezoneValue}`);
                }
            }
            // Generate unique job ID
            const jobId = (0, uuid_1.v4)();
            // Create cron job options
            const options = {
                scheduled: false, // Don't start immediately
                timezone: timezoneValue,
            };
            // Create the cron job (but don't start it yet)
            const task = cron.schedule(schedule.value, async () => {
                try {
                    // Execute the ForgeScript code
                    await this["resolveCode"](ctx, code);
                }
                catch (error) {
                    console.error(`Error executing cron job ${jobId}:`, error);
                }
            }, options);
            // Initialize crons map if it doesn't exist
            if (!ctx.client.crons) {
                ;
                ctx.client.crons = new Map();
            }
            // Store job information
            ;
            ctx.client.crons.set(jobId, {
                task: task,
                schedule: schedule.value,
                timezone: timezoneValue,
                name: name.value || jobId,
                createdAt: new Date(),
            });
            // Only start the job after everything is set up successfully
            task.start();
            // Store by name if provided (for easy deletion by name)
            if (name.value) {
                ;
                ctx.client.crons.set(name.value, ctx.client.crons.get(jobId));
            }
            // Return success with no output
            return this.success();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return this.customError(`Failed to create cron job: ${errorMessage}`);
        }
    },
});
