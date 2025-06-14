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
import { QueryService } from "../services/query";
import { z } from "zod";

export interface QueryPayload extends Content {
    query_type: "portfolio" | "health_factor" | "supply_positions" | "borrow_positions";
}

const queryTemplate = `Respond with a JSON markdown block containing only the extracted query type.

Valid query types:
- "portfolio": overall assets and liabilities
- "health_factor": current health factor
- "supply_positions": what tokens are being supplied
- "borrow_positions": what tokens are being borrowed

If unsure, respond with null.

Example:
\`\`\`json
{
  "query_type": "health_factor"
}
\`\`\`

{{recentMessages}}

What is the user trying to query?`;

export default {
    name: "GENERATE_QUERY",
    description: "Generate a query to run on the Sandworm analytics engine",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.info("Validating that the user wants to generate a query...");
        return true;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info("Starting GENERATE_QUERY handler...");

        const service = runtime.getService<QueryService>(ServiceType.TRANSCRIPTION);

        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const querySchema = z.object({
            query_type: z.enum([
                "portfolio",
                "health_factor",
                "supply_positions",
                "borrow_positions",
            ]).nullable(),
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
        elizaLogger.info("Query content extracted:", queryContent);

        if (!queryContent.query_type) {
            callback?.({
                text: "Sorry, I couldn't understand your query. Please ask about your portfolio, health factor, or token positions.",
                content: { error: "Unknown query type" },
            });
            return false;
        }

        try {
            const address = service.getAddress();
            let responseText = "";
            let result;

            switch (queryContent.query_type) {
                case "portfolio":
                    result = await service.getPortfolio(address);
                    responseText = `📊 Your portfolio summary:\n${JSON.stringify(result, null, 2)}`;
                    break;
                case "health_factor":
                    result = await service.getHealthFactor(address);
                    responseText = `🛡️ Your current health factor is **${result}**.`;
                    break;
                case "supply_positions":
                    result = await service.getSupplyPositions(address);
                    responseText = `💰 You are supplying:\n${JSON.stringify(result, null, 2)}`;
                    break;
                case "borrow_positions":
                    result = await service.getBorrowPositions(address);
                    responseText = `💸 You have borrowed:\n${JSON.stringify(result, null, 2)}`;
                    break;
            }

            callback?.({
                text: responseText,
                content: { query: queryContent.query_type, result },
            });

            return true;
        } catch (error) {
            elizaLogger.error("Query failed:", error);
            callback?.({
                text: `Failed to run query: ${error}`,
                content: { error: "Query failed" },
            });
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What's my health factor on Navi?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "🛡️ Your current health factor is 1.92",
                    action: "GENERATE_QUERY",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Show me what tokens I'm supplying." },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "💰 You are supplying:\n- 1.5 SUI\n- 200 USDC",
                    action: "GENERATE_QUERY",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "View portfolio summary" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "📊 Your portfolio summary:\n- Supplied: 1000 USDC\n- Borrowed: 500 USDC",
                    action: "GENERATE_QUERY",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
