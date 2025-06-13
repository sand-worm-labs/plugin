import { Agent } from "@elizaos/core";
import { QueryService } from "src/services/run-queries";

(async () => {
  const queryService = Agent.getService(QueryService);
  const result = await queryService.run("SELECT * FROM users LIMIT 10");
  console.log("Result:", result);
})();
