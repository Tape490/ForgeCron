import { ArgType, NativeFunction } from "@tryforge/forgescript";

export default new NativeFunction({
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
      type: ArgType.String,
    },
  ],
  execute(ctx: any, [jobId]: [string]) {
    try {
      // Initialize crons map if it doesn't exist
      if (!(ctx.client as any).crons) {
        (ctx.client as any).crons = new Map();
        return this.success(); // No output, job didn't exist anyway
      }

      // Check if job exists
      const jobInfo = (ctx.client as any).crons.get(jobId);
      if (!jobInfo) {
        return this.success(); // No output, job didn't exist
      }

      // Stop and destroy the cron task
      if (jobInfo.task) {
        jobInfo.task.stop();
        jobInfo.task.destroy();
      }
      // Remove from active jobs
      (ctx.client as any).crons.delete(jobId);

      // No output on successful deletion
      return this.success();
    } catch (error) {
      // Even on error, don't show output
      return this.success();
    }
  },
});
