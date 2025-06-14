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
import { AuthService } from "../services/auth";

export interface LoginPayload extends Content {
    address: string;
}

const loginTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example:
\`\`\`json
{
    "address": "0xabc123..."
}
\`\`\`

{{recentMessages}}

Extract the user's wallet address (or account identifier) from the conversation.
If it's not available, return null for address.

Respond with a JSON markdown block containing only the address.`;

export default {
    name: "LOGIN",
    description: "Login the user to their Sandworm account using a wallet address",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        console.log("Validating login for user:", message.userId);
        return true;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting LOGIN handler...");

        const authService = runtime.getService<AuthService>("AUTH");

        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const loginSchema = z.object({
            address: z.string().min(10).nullable(),
        });

        const loginContext = composeContext({
            state,
            template: loginTemplate,
        });

        const content = await generateObject({
            runtime,
            context: loginContext,
            schema: loginSchema,
            modelClass: ModelClass.SMALL,
        });

        const loginContent = content.object as LoginPayload;
        elizaLogger.info("Login content:", loginContent);

        if (!loginContent.address) {
            callback?.({
                text: "Please provide your wallet address to continue.",
                content: { error: "Missing wallet address" },
            });
            return false;
        }

        try {
            const userSession = await authService.login(loginContent.address);

            callback?.({
                text: `✅ Logged in as ${loginContent.address}`,
                content: { session: userSession },
            });

            return true;
        } catch (error) {
            elizaLogger.error("Login failed:", error);
            callback?.({
                text: `Failed to login: ${error}`,
                content: { error: "Login failed" },
            });
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Login with 0xabc123...",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Logged in as 0xabc123...",
                    action: "LOGIN",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "My address is 0x123456. Can you remember that?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Thanks! You are now logged in as 0x123456.",
                    action: "LOGIN",
                },
            },
        ],
    ] as unknown as ActionExample[][],
} as Action;
