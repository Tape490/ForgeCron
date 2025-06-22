import { ArgType, type IExtendedCompiledFunctionField, NativeFunction, type Return } from "@tryforge/forgescript"
import * as cron from "node-cron"
import { v4 as uuidv4 } from "uuid"

export default new NativeFunction({
  name: "$cron",
  version: "1.0.0",
  description: "Creates a scheduled cron job",
  unwrap: false,
  brackets: true,
  args: [
    {
      name: "code",
      description: "The code to execute when cron triggers",
      rest: false,
      required: true,
      type: ArgType.String,
    },
    {
      name: "schedule",
      description: "Cron schedule expression (e.g., '0 0 * * *' for daily at midnight)",
      rest: false,
      required: true,
      type: ArgType.String,
    },
    {
      name: "timezone",
      description: "Timezone for the cron job (optional)",
      rest: false,
      type: ArgType.String,
    },
    {
      name: "name",
      description: "Custom name for the job (optional)",
      rest: false,
      type: ArgType.String,
    },
  ],
  async execute(ctx: any) {
    const code = this.data.fields![0] as IExtendedCompiledFunctionField

    const schedule: Return = await (this as any)["resolveUnhandledArg"](ctx, 1)
    if (!(this as any)["isValidReturnType"](schedule)) return schedule

    const timezone: Return = await (this as any)["resolveUnhandledArg"](ctx, 2)
    if (!(this as any)["isValidReturnType"](timezone)) return timezone

    const name: Return = await (this as any)["resolveUnhandledArg"](ctx, 3)
    if (!(this as any)["isValidReturnType"](name)) return name

    try {
      // Validate cron expression
      if (!cron.validate(schedule.value as string)) {
        return this.customError("Invalid cron schedule expression")
      }

      // Generate unique job ID
      const jobId = uuidv4()

      // Create cron job options
      const options = {
        scheduled: false,
        timezone: (timezone.value as string) || "UTC",
      }

      // Create the cron job
      const task = cron.schedule(
        schedule.value as string,
        async () => {
          try {
            // Execute the ForgeScript code
            await (this as any)["resolveCode"](ctx, code)
          } catch (error) {
            console.error(`Error executing cron job ${jobId}:`, error)
          }
        },
        options,
      )

      // Initialize crons map if it doesn't exist
      if (!(ctx.client as any).crons) {
        ;(ctx.client as any).crons = new Map()
      }
      // Store job information
      ;(ctx.client as any).crons.set(jobId, {
        task: task,
        schedule: schedule.value as string,
        timezone: (timezone.value as string) || "UTC",
        name: (name.value as string) || jobId,
        createdAt: new Date(),
      })

      // Start the job
      task.start()

      // Store by name if provided
      if (name.value) {
        ;(ctx.client as any).crons.set(name.value as string, (ctx.client as any).crons.get(jobId))
      }

      return this.success(jobId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return this.customError(`Failed to create cron job: ${errorMessage}`)
    }
  },
})
