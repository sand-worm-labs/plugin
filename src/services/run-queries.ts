import { Service, IAgentRuntime } from "@elizaos/core";
import { runQuery } from "src/utils";

let currentController: AbortController | null = null;

export class QueryService extends Service {
  static serviceType = "query";
  capabilityDescription =
    "The agent can query the Sandworm backend for blockchain data";

  constructor(protected runtime: IAgentRuntime) {
    super();
  }

  static async start(runtime: IAgentRuntime): Promise<QueryService> {
    const service = new QueryService(runtime);
    console.log("[QueryService] started ✅");
    return service;
  }

  async stop(): Promise<void> {
    console.log("[QueryService] stopped ❌");
  }

  async run(query: string, provider?: { executionMethod?: string }) {
    if (currentController) currentController.abort();

    const controller = new AbortController();
    const { signal } = controller;
    currentController = controller;

    const executionType = provider?.executionMethod ?? "rpc";
    const API_URL = "https://node.sandwormlabs.xyz/run?";

    try {
      const queryResult = await runQuery(API_URL, query, executionType, signal);

      if (queryResult.error === "QueryAborted") {
        console.warn("[QueryService] Query was aborted. Skipping return.");
        return queryResult;
      }

      return queryResult;
    } catch (error) {
      console.error("[QueryService] Unexpected error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (errorMessage === "QueryAborted") {
        console.warn("[QueryService] Query was aborted by signal");
        return {
          columns: [],
          columnTypes: [],
          data: [],
          rowCount: 0,
          error: "QueryAborted",
        };
      }

      return {
        columns: [],
        columnTypes: [],
        data: [],
        rowCount: 0,
        error: errorMessage,
      };
    }
  }
}
