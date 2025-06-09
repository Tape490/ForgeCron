import { ArgType, NativeFunction, type Return } from "@tryforge/forgescript"
import { CronJob } from "cron"

// Define minimal interface for interpreter with run method
interface Interpreter {
  run(options: { code: string; obj: any }): Promise<any>
}

// Global storage for cron jobs
if (!(global as any).cronJobs) {
  ;(global as any).cronJobs = new Map()
}

export default new NativeFunction({
  name: "$cron",
  version: "1.0.0",
  description: "Schedules a task using cron expression",
  brackets: true,
  unwrap: true,
  output: ArgType.String,
  args: [
    {
      name: "job id",
      description: "A unique identifier for this cron job",
      type: ArgType.String,
      required: true,
      rest: false,
    },
    {
      name: "cron expression",
      description: "The cron expression (e.g. '0 * * * *' for every hour)",
      type: ArgType.String,
      required: true,
      rest: false,
    },
    {
      name: "code",
      description: "The code to execute when the cron job runs",
      type: ArgType.String,
      required: true,
      rest: false,
    },
  ],
  async execute(ctx) {
    const jobID: Return = await this["resolveUnhandledArg"](ctx, 0)
    if (!this["isValidReturnType"](jobID)) return jobID

    const cronExpression: Return = await this["resolveUnhandledArg"](ctx, 1)
    if (!this["isValidReturnType"](cronExpression)) return cronExpression

    const code: Return = await this["resolveUnhandledArg"](ctx, 2)
    if (!this["isValidReturnType"](code)) return code

    const jobId = (jobID.value as string).trim()
    const cronExpr = (cronExpression.value as string).trim()
    const codeToRun = code.value as string

    try {
      const cronJobs = (global as any).cronJobs

      // Check if job ID already exists
      if (cronJobs.has(jobId)) {
        return this.customError(`Cron job with ID ${jobId} already exists`)
      }

      // Create the cron job
      const job = new CronJob(
        cronExpr,
        async () => {
          try {
            // Cast interpreter to proper type so TS knows run exists
            const interpreter = ctx.client.interpreter as Interpreter | undefined
            if (interpreter) {
              await interpreter.run({
                code: codeToRun,
                obj: ctx.obj,
              })
            }
          } catch (error) {
            console.error(`Error executing cron job ${jobId}:`, error)
          }
        },
        null,
        true, // Start the job right away
        undefined, // Timezone (default)
      )

      // Store the job
      cronJobs.set(jobId, job)

      return this.success(jobId)
    } catch (error) {
      return this.customError(`Error creating cron job: ${error}`)
    }
  },
})
