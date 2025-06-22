import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
  name: "$resumeCron",
  version: "1.0.0",
  description: "Resumes a paused cron job by its ID or name",
  unwrap: true,
  brackets: true,
  args: [
    {
      name: "jobId",
      description: "The ID or name of the cron job to resume",
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

      // Resume the cron task
      if (jobInfo.task) {
        jobInfo.task.start()
        jobInfo.paused = false // Mark as not paused
      }

      // No output on successful resume
      return this.success()
    } catch (error) {
      // Even on error, don't show output
      return this.success()
    }
  },
})
