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
import { z } from "zod";

export interface QueryPayload extends Content {
  query: string;
}

const queryTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example:
\`\`\`json
{
  "query": "SELECT * FROM swaps WHERE token_symbol = 'SUI' AND timestamp >= NOW() - INTERVAL '1 day'"
}
\`\`\`

{{recentMessages}}

From the recent conversation, extract the full query the user wants to run on Sandworm.

Respond with a JSON markdown block containing the "query".`;

export default {
  name: "RUN_QUERY",
  description: "Run analytical queries on the Sandworm blockchain data engine",
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    elizaLogger.info("Validating that the user wants to run a query...");
    const { text } = message.content;
    return (
      text?.toLowerCase().includes("run query") ||
      text?.toLowerCase().includes("execute query") ||
      text?.toLowerCase().includes("get result") ||
      text?.toLowerCase().includes("fetch data") ||
      text?.toLowerCase().includes("show me") ||
      text?.toLowerCase().includes("query this") ||
      text?.toLowerCase().startsWith("select ") // basic SQL query signal
    );
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: { [key: string]: unknown },
    callback?: HandlerCallback,
  ): Promise<boolean> => {
    elizaLogger.info("Starting RUN_QUERY handler...");

    try {
      // elizaLogger.info("Extracted query:", query);

      // const response = await fetch("https://api.sandworm.dev/query", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ query }),
      // });

      // const result = await response.json();

      // callback?.({
      //     text: `✅ Query successful:\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
      //     content: result,
      // });

      return true;
    } catch (error) {
      elizaLogger.error("Error running query:", error);
      callback?.({
        text: `❌ Query failed: ${error}`,
        content: { error: "Query execution failed" },
      });
      return false;
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me all SUI swaps in the last 24 hours",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Running your query on Sandworm...",
          action: "RUN_QUERY",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Here are the SUI swaps in the last 24 hours:\n```json\n[...]\n```",
        },
      },
    ],
  ] as unknown as ActionExample[][],
} as Action;
