import { ForgeExtension } from "@tryforge/forgescript"

export class ForgeCron extends ForgeExtension {
  name = "ForgeCron"
  description = "A forgescript extension for cron job scheduling"
  version = "1.0.0"

  public init() {
    this.load(__dirname + "/functions")
  }
}
