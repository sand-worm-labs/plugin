import { Plugin } from "@elizaos/core";

// Action handlers
import generateChart from "./actions/generate_chart.ts";
import generateQuery from "./actions/generate_query.ts";
import saveQuery from "./actions/save_query.ts";
import runQuery from "./actions/run_query.ts";

// Providers and services
// import { WalletProvider, walletProvider } from "./providers/sandworm.ts";
import { QueryService } from "./services/query.ts";

// Optional re-exports
// export { WalletProvider, generateChart };

export const sandwormPlugin: Plugin = {
  name: "sandworm",
  description: "Core Sandworm plugin for blockchain analytics",

  actions: [generateChart, generateQuery, saveQuery, runQuery],

  providers: [],

  services: [],

  evaluators: [],
};

export default sandwormPlugin;
