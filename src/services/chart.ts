import {
    elizaLogger,
    IAgentRuntime,
    Service,
    ServiceType,
} from "@elizaos/core";

export class ChartService extends Service {
    capabilityDescription: string ="This is the query service for sandworm.";
    static serviceType: ServiceType = ServiceType.TRANSCRIPTION;

     initialize(runtime: IAgentRuntime): Promise<void> {
      return null;
    }
}