import { ArgType, NativeFunction, Return } from "@tryforge/forgescript"

export default new NativeFunction({
  name: "$deleteCron",
  version: "1.0.0",
  description: "Deletes a scheduled cron job",
  brackets: true,
  args: [
    {
      name: "job id",
      description: "The ID of the cron job to delete",
      type: ArgType.String,
      required: true,
    },
  ],
  unwrap: true,
  execute: (ctx, [jobId]) => {
    try {
      const cronJobs = (global as any).cronJobs

      // Check if the job exists
      if (!cronJobs || !cronJobs.has(jobId)) {
        return Return.success(false)
      }

      // Stop the job
      const job = cronJobs.get(jobId)
      job.stop()

      // Remove from the map
      cronJobs.delete(jobId)

      return Return.success(true)
    } catch (error) {
      console.error("Error deleting cron job:", error)
      return Return.success(false)
    }
  },
})
