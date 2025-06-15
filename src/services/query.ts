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
    
    capabilityDescription: string ="This is the query service for sandworm.";
    static serviceType = ServiceType.TRANSCRIPTION;

     initialize(runtime: IAgentRuntime): Promise<void> {
      return null;
    }
}