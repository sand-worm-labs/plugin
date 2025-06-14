import {
    ActionExample,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    composeContext,
    elizaLogger,
    generateObject,
    type Action,
} from "@elizaos/core";
import { z } from "zod";

// Define the query payload structure
export interface QueryPayload extends Content {
    query: string;
}

// Template to extract the SQL or pseudo-SQL query from conversation
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
    validate: async (_runtime, _message) => {
        return true;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting RUN_QUERY handler...");

        // Compose context for extracting the query
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const querySchema = z.object({
            query: z.string().min(5), // Basic safeguard
        });

        const queryContext = composeContext({
            state,
            template: queryTemplate,
        });

        const content = await generateObject({
            runtime,
            context: queryContext,
            schema: querySchema,
            modelClass: ModelClass.SMALL,
        });

        const queryContent = content.object as QueryPayload;
        elizaLogger.info("User query extracted:", queryContent.query);

        try {
            const response = await fetch("https://api.sandworm.dev/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: queryContent.query }),
            });

            const result = await response.json();

            // Send result back to user
            callback?.({
                text: `Query successful:\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
                content: result,
            });

            return true;
        } catch (error) {
            elizaLogger.error("Error running Sandworm query:", error);
            callback?.({
                text: `Query failed: ${error}`,
                content: { error: "Failed to run query" },
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
    ] as ActionExample[][],
} as Action;
