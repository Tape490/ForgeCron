import { ArgType, NativeFunction, Return } from "@tryforge/forgescript"
import { CronJob } from "cron"

// Global storage for cron jobs
if (!(global as any).cronJobs) {
  ;(global as any).cronJobs = new Map()
}

export default new NativeFunction({
  name: "$cron",
  version: "1.0.0",
  description: "Schedules a task using cron expression",
  brackets: true,
  args: [
    {
      name: "job id",
      description: "A unique identifier for this cron job",
      type: ArgType.String,
      required: true,
    },
    {
      name: "cron expression",
      description: "The cron expression (e.g. '0 * * * *' for every hour)",
      type: ArgType.String,
      required: true,
    },
    {
      name: "code",
      description: "The code to execute when the cron job runs",
      type: ArgType.String,
      required: true,
    },
  ],
  unwrap: true,
  execute: async (ctx, [jobId, cronExpression, code]) => {
    try {
      const cronJobs = (global as any).cronJobs

      // Check if job ID already exists
      if (cronJobs.has(jobId)) {
        console.error(`Cron job with ID ${jobId} already exists`)
        return Return.success("")
      }

      // Create the cron job
      const job = new CronJob(
        cronExpression,
        async () => {
          try {
            // Execute the code when the cron job runs
            await ctx.client.interpreter.evaluateCode(code, ctx.obj, ctx.obj.data)
          } catch (error) {
            console.error(`Error executing cron job ${jobId}:`, error)
          }
        },
        null,
        true, // Start the job right away
      )

      // Store the job
      cronJobs.set(jobId, job)

      // Return the job ID
      return Return.success(jobId)
    } catch (error) {
      console.error("Error creating cron job:", error)
      return Return.success("")
    }
  },
})
