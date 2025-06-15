import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

// Schema for just the Sandworm plugin authentication
const sandwormAuthSchema = z.object({
  SANDWORM_AUTH_KEY: z.string().min(1, "Sandworm auth key is required"),
});

export type SandwormAuthConfig = z.infer<typeof sandwormAuthSchema>;

export async function validateSandwormAuthKey(
  runtime: IAgentRuntime,
): Promise<SandwormAuthConfig> {
  try {
    const config = {
      SANDWORM_AUTH_KEY:
        runtime.getSetting("SANDWORM_AUTH_KEY") ||
        process.env.SANDWORM_AUTH_KEY,
    };

    return sandwormAuthSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(`Sandworm auth key validation failed:\n${errorMessages}`);
    }
    throw error;
  }
}
