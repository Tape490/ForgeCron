import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
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
      type: ArgType.String,
    },
  ],
  output: ArgType.Boolean,
  execute(ctx: any, [jobId]: [string]) {
    try {
      // Initialize crons map if it doesn't exist
      if (!(ctx.client as any).crons) {
        ;(ctx.client as any).crons = new Map()
      }

      // Check if job exists
      const jobInfo = (ctx.client as any).crons.get(jobId)
      if (!jobInfo) {
        return this.success(false)
      }

      // Stop and destroy the cron task
      if (jobInfo.task) {
        jobInfo.task.stop()
        jobInfo.task.destroy()
      }
      // Remove from active jobs
      ;(ctx.client as any).crons.delete(jobId)

      return this.success(true)
    } catch (error) {
      return this.success(false)
    }
  },
})
