"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$deleteCron",
    version: "1.0.0",
    description: "Deletes a scheduled cron job",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        {
            name: "job id",
            description: "The ID of the cron job to delete",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
    ],
    async execute(ctx) {
        const jobID = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](jobID))
            return jobID;
        const jobId = jobID.value.trim();
        try {
            const cronJobs = global.cronJobs;
            // Check if the job exists
            if (!cronJobs || !cronJobs.has(jobId)) {
                return this.customError("Cron job does not exist.");
            }
            // Stop the job
            const job = cronJobs.get(jobId);
            job.stop();
            // Remove from the map
            cronJobs.delete(jobId);
            return this.success(true);
        }
        catch (error) {
            return this.customError(`Error deleting cron job: ${error}`);
        }
    },
});
