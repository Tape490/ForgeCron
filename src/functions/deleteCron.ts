import { ArgType, NativeFunction, type Return } from "@tryforge/forgescript"

export default new NativeFunction({
  name: "$deleteCron",
  version: "1.0.0",
  description: "Deletes a scheduled cron job",
  brackets: true,
  unwrap: true,
  output: ArgType.Boolean,
  args: [
    {
      name: "job id",
      description: "The ID of the cron job to delete",
      type: ArgType.String,
      required: true,
      rest: false,
    },
  ],
  async execute(ctx) {
    const jobID: Return = await this["resolveUnhandledArg"](ctx, 0)
    if (!this["isValidReturnType"](jobID)) return jobID

    const jobId = (jobID.value as string).trim()

    try {
      const cronJobs = (global as any).cronJobs

      // Check if the job exists
      if (!cronJobs || !cronJobs.has(jobId)) {
        return this.customError("Cron job does not exist.")
      }

      // Stop the job
      const job = cronJobs.get(jobId)
      job.stop()

      // Remove from the map
      cronJobs.delete(jobId)

      return this.success(true)
    } catch (error) {
      return this.customError(`Error deleting cron job: ${error}`)
    }
  },
})



