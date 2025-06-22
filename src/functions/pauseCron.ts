import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
  name: "$pauseCron",
  version: "1.0.0",
  description: "Pauses a cron job by its ID or name without deleting it",
  unwrap: true,
  brackets: true,
  args: [
    {
      name: "jobId",
      description: "The ID or name of the cron job to pause",
      rest: false,
      required: true,
      type: ArgType.String,
    },
  ],
  execute(ctx: any, [jobId]: [string]) {
    try {
      // Initialize crons map if it doesn't exist
      if (!(ctx.client as any).crons) {
        ;(ctx.client as any).crons = new Map()
        return this.success() // No output, job didn't exist anyway
      }

      // Check if job exists
      const jobInfo = (ctx.client as any).crons.get(jobId)
      if (!jobInfo) {
        return this.success() // No output, job didn't exist
      }

      // Pause the cron task
      if (jobInfo.task) {
        jobInfo.task.stop()
        jobInfo.paused = true // Mark as paused
      }

      // No output on successful pause
      return this.success()
    } catch (error) {
      // Even on error, don't show output
      return this.success()
    }
  },
})
