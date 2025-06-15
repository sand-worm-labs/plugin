import {
    elizaLogger,
    IAgentRuntime,
    Service,
    ServiceType,
} from "@elizaos/core";

export class AuthService extends Service {
    stop(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    static serviceType = ServiceType.TRANSCRIPTION;
    capabilityDescription: string = "This is the auuth service for sandworm.";
     initialize(runtime: IAgentRuntime): Promise<void> {
      return null;
    }

    // async login(address: string): Promise<{ token: string }> {
    //     const response = await fetch("https://api.sandworm.dev/login", {
    //         method: "POST",
    //         body: JSON.stringify({ address }),
    //         headers: { "Content-Type": "application/json" },
    //     });

    //     if (!response.ok) throw new Error("Login failed");
    //    // return await response.json();
    // }
}
