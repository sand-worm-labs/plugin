import {
    elizaLogger,
    IAgentRuntime,
    Service,
    ServiceType,
} from "@elizaos/core";

export class QueryService extends Service {
    capabilityDescription: string ="This is the query service for sandworm.";
    static serviceType: ServiceType = ServiceType.TRANSCRIPTION;

     initialize(runtime: IAgentRuntime): Promise<void> {
      return null;
    }
}