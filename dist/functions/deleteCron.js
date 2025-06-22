"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$deleteCron",
    version: "1.0.0",
    description: "Deletes a scheduled cron job by its ID or name",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "jobId",
            description: "The ID or name of the cron job to delete",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
    ],
    execute(ctx, [jobId]) {
        try {
            // Initialize crons map if it doesn't exist
            if (!ctx.client.crons) {
                ;
                ctx.client.crons = new Map();
                return this.success(); // No output, job didn't exist anyway
            }
            // Check if job exists
            const jobInfo = ctx.client.crons.get(jobId);
            if (!jobInfo) {
                return this.success(); // No output, job didn't exist
            }
            // Stop and destroy the cron task
            if (jobInfo.task) {
                jobInfo.task.stop();
                jobInfo.task.destroy();
            }
            // Remove from active jobs
            ;
            ctx.client.crons.delete(jobId);
            // No output on successful deletion
            return this.success();
        }
        catch (error) {
            // Even on error, don't show output
            return this.success();
        }
    },
});
