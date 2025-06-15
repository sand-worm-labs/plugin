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
import { ChartService } from "../services/chart";
import { z } from "zod";

export interface ChartPayload extends Content {
    chart_type: "supply" | "borrow" | "health_factor";
    token_symbol?: string;
}

const chartTemplate = `Extract the user's intent to generate a chart and which type.

Valid chart types:
- "supply": user's supply history
- "borrow": user's borrow history
- "health_factor": user's health factor trend

Return a JSON markdown block like this:

\`\`\`json
{
  "chart_type": "supply",
  "token_symbol": "SUI"
}
\`\`\`

If token is not mentioned, use null.

{{recentMessages}}`;

export default {
    name: "GENERATE_CHART",
    description: "Visualize lending data like supply, borrow, or health factor as charts",
    validate: async (_runtime: IAgentRuntime, _message: Memory) => true,

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting GENERATE_CHART handler...");


        try {
            return true;
        } catch (err) {
            elizaLogger.error("Chart generation failed:", err); 
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Show me my SUI supply chart over time." },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "📈 Here's the supply chart for SUI:",
                    action: "GENERATE_CHART",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Visualize my borrow history on Navi." },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "📉 Here's your borrow chart:",
                    action: "GENERATE_CHART",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Plot my health factor trend" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "🛡️ Health factor over time:",
                    action: "GENERATE_CHART",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
