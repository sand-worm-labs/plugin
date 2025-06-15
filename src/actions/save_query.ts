import {
  ActionExample,
  Content,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  State,
  elizaLogger,
  type Action,
} from "@elizaos/core";
import { QueryService } from "../services/query"; // you must implement saveQuery here
import { z } from "zod";

const SaveQuerySchema = z.object({
  title: z.string(),
  query: z.string(),
});

export interface SaveQueryPayload extends Content {
  title: string;
  query: string;
}

export default {
  name: "SAVE_QUERY",
  description: "Save a user query for later use",
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const { text } = message.content;
    return (
      text?.toLowerCase().includes("save this query") ||
      text?.toLowerCase().includes("store query") ||
      text?.toLowerCase().includes("bookmark query")
    );
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: { [key: string]: unknown },
    callback?: HandlerCallback,
  ): Promise<boolean> => {
    elizaLogger.info("Running SAVE_QUERY handler...");

    try {
      const content = message.content as Partial<SaveQueryPayload>;

      if (!content.title || !content.query) {
        callback?.({
          text: "Missing query or title. Please provide both a query and a name for it.",
          content: { error: "Missing data" },
        });
        return false;
      }

      SaveQuerySchema.parse(content); // validate types

      // // Save to database or wherever
      // await QueryService.saveQuery({
      //     userId: state.user.id, // or however you store user IDs
      //     title: content.title,
      //     query: content.query,
      // });

      callback?.({
        text: `✅ Query titled "${content.title}" has been saved.`,
        content: { success: true },
      });

      return true;
    } catch (error) {
      elizaLogger.error("Error saving query:", error);
      callback?.({
        text: `❌ Failed to save query: ${error}`,
        content: { error: "Save failed" },
      });
      return false;
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Save this query as 'Top Pools'" },
      },
      {
        user: "{{user2}}",
        content: {
          text: `✅ Query titled "Top Pools" has been saved.`,
          action: "SAVE_QUERY",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Store this query as 'Vitalik Portfolio View'",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: `✅ Query titled "Vitalik Portfolio View" has been saved.`,
          action: "SAVE_QUERY",
        },
      },
    ],
  ] as unknown as ActionExample[][],
} as Action;
