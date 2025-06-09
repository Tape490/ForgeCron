"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const cron_1 = require("cron");
// Global storage for cron jobs
if (!global.cronJobs) {
    ;
    global.cronJobs = new Map();
}
exports.default = new forgescript_1.NativeFunction({
    name: "$cron",
    version: "1.0.0",
    description: "Schedules a task using cron expression",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.String,
    args: [
        {
            name: "job id",
            description: "A unique identifier for this cron job",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: "cron expression",
            description: "The cron expression (e.g. '0 * * * *' for every hour)",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: "code",
            description: "The code to execute when the cron job runs",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
    ],
    async execute(ctx) {
        const jobID = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](jobID))
            return jobID;
        const cronExpression = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](cronExpression))
            return cronExpression;
        const code = await this["resolveUnhandledArg"](ctx, 2);
        if (!this["isValidReturnType"](code))
            return code;
        const jobId = jobID.value.trim();
        const cronExpr = cronExpression.value.trim();
        const codeToRun = code.value;
        try {
            const cronJobs = global.cronJobs;
            // Check if job ID already exists
            if (cronJobs.has(jobId)) {
                return this.customError(`Cron job with ID ${jobId} already exists`);
            }
            // Create the cron job
            const job = new cron_1.CronJob(cronExpr, async () => {
                try {
                    // Cast interpreter to proper type so TS knows run exists
                    const interpreter = ctx.client.interpreter;
                    if (interpreter) {
                        await interpreter.run({
                            code: codeToRun,
                            obj: ctx.obj,
                        });
                    }
                }
                catch (error) {
                    console.error(`Error executing cron job ${jobId}:`, error);
                }
            }, null, true, // Start the job right away
            undefined);
            // Store the job
            cronJobs.set(jobId, job);
            return this.success(jobId);
        }
        catch (error) {
            return this.customError(`Error creating cron job: ${error}`);
        }
    },
});
