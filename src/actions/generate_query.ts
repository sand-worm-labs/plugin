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
        //elizaLogger.info("Query content extracted:", queryContent);

        // if (!queryContent.query_type) {
        //     callback?.({
        //         text: "Sorry, I couldn't understand your query. Please ask about your portfolio, health factor, or token positions.",
        //         content: { error: "Unknown query type" },
        //     });
        //     return false;
        // }

        try {

            // callback?.({
            //     text: responseText,
            //     content: { query: queryContent.query_type, result },
            // });

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

    examples:[
        [
            {
                user: "{{user1}}",
                content: { text: "Select vitalik.eth on base and ethereum" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "```sql\nSELECT balance, chain FROM account vitalik.eth ON eth, base\n```",
                    action: "GENERATE_QUERY",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Find the top 10 Cetus pools by swap count on May 22, 2025" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: `\`\`\`sql
                        SELECT pool, COUNT(*) AS swap_count
                        FROM cetus_swaps
                        WHERE TO_TIMESTAMP(timestampMs / 1000)::DATE = '2025-05-22'
                        GROUP BY pool
                        ORDER BY swap_count DESC
                        LIMIT 10;
                        \`\`\``,
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
                    text: `\`\`\`sql
                        SELECT token_symbol,
                        SUM(CASE WHEN action = 'supply' THEN amount ELSE 0 END) AS total_supplied,
                        SUM(CASE WHEN action = 'borrow' THEN amount ELSE 0 END) AS total_borrowed,
                        SUM(CASE WHEN action = 'wallet' THEN amount ELSE 0 END) AS wallet_balance
                        FROM positions
                        WHERE user_address = '0x...'
                        GROUP BY token_symbol;
                        \`\`\``,
                    action: "GENERATE_QUERY",
                },
            },
        ],
        ] as unknown as ActionExample[][]
} as Action;
