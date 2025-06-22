"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
exports.default = new structures_1.NativeFunction({
    name: "$deleteCron",
    version: "1.0.0",
    description: "Deletes a scheduled cron job by its ID or name, returns bool",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "jobId",
            description: "The ID or name of the cron job to delete",
            rest: false,
            required: true,
            type: structures_1.ArgType.String,
        },
    ],
    output: structures_1.ArgType.Boolean,
    execute(ctx, [jobId]) {
        try {
            // Initialize crons map if it doesn't exist
            if (!ctx.client.crons) {
                ctx.client.crons = new Map();
            }
            // Check if job exists
            const jobInfo = ctx.client.crons.get(jobId);
            if (!jobInfo) {
                return this.success(false);
            }
            // Stop and destroy the cron task
            if (jobInfo.task) {
                jobInfo.task.stop();
                jobInfo.task.destroy();
            }
            // Remove from active jobs
            ctx.client.crons.delete(jobId);
            return this.success(true);
        }
        catch (error) {
            return this.success(false);
        }
    },
});
