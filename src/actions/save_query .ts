import {
    ActionExample,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    ServiceType,
    composeContext,
    elizaLogger,
    generateObject,
    type Action,
} from "@elizaos/core";

import { z } from "zod";

export interface SandwormQueryPayload extends Content {
    query: string;
}

const queryTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null if you can't extract the query.

{{recentMessages}}

Given the recent messages, extract the raw SQL or pseudo-SQL query the user wants to run on the Sandworm analytics engine.

Respond with:
\`\`\`json
{
  "query": "SELECT * FROM swaps WHERE token_symbol = 'SUI' AND timestamp >= NOW() - INTERVAL '1 day'"
}
\`\`\``;

export default {
    name: "SANDWORM_QUERY",
    description: "Run analytics queries against Sandworm data engine",
    validate: async (_runtime, _message) => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("SANDWORM_QUERY handler started");

        const schema = z.object({
            query: z.string(),
        });

        const ctx = composeContext({
            state: await runtime.composeState(message),
            template: queryTemplate,
        });

        const content = await generateObject({
            runtime,
            context: ctx,
            schema,
            modelClass: ModelClass.SMALL,
        });

        const queryPayload = content.object as SandwormQueryPayload;
        elizaLogger.info("User query extracted:", queryPayload.query);

        try {
            // Send query to your Sandworm backend
            const response = await fetch("https://your-sandworm-api/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: queryPayload.query }),
            });

            const result = await response.json();

            callback?.({
                text: `Query executed successfully:\n\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
                content: queryPayload,
            });

            return true;
        } catch (err) {
            elizaLogger.error("Query failed:", err);
            callback?.({
                text: `Failed to execute query: ${err}`,
                content: { error: err },
            });
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the top 5 pools on Base by volume this week",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Running your query...",
                    action: "SANDWORM_QUERY",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Here are the top 5 pools on Base by volume this week:\n\n```json\n[...results...]\n```",
                },
            },
        ],
    ] as unknown as ActionExample[][],
} as Action;
