import {
    elizaLogger,
    IAgentRuntime,
    Service,
    ServiceType,
} from "@elizaos/core";

export class QueryService extends Service {
     stop(): Promise<void> {
         throw new Error("Method not implemented.");
     }
     capabilityDescription: string;
     initialize(runtime: IAgentRuntime): Promise<void> {
      return null;
    }
}