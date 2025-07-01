import { type IAgentRuntime, Service, logger } from '@elizaos/core';

export interface EntityData {
    raw: any;
    decoded: any;
    project: any;
  }
  
  export class ChainRegistryService extends Service {
    static serviceType = 'CHAIN_REGISTRY_SERVICE';
    capabilityDescription = 'Chain + entity metadata registry from GitHub';
  
    constructor(protected runtime: IAgentRuntime) {
      super(runtime);
    }
  
    async getChains(): Promise<any[]> {
      const url = 'https://raw.githubusercontent.com/sand-worm-sql/chain_registry/main/data/chain/index.json';
  
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Could not fetch chains: ${res.status}`);
        return await res.json();
      } catch (err) {
        logger.error('ChainRegistryService: Failed to fetch chains', err);
        return [];
      }
    }
  
    async getEntityData(chainName: string): Promise<EntityData> {
      const baseUrl = `https://raw.githubusercontent.com/sand-worm-sql/chain_registry/main/data/entities/${chainName}`;
      const files = ['raw.json', 'decoded.json', 'projects.json'];
  
      const results = await Promise.allSettled(
        files.map(file => fetch(`${baseUrl}/${file}`))
      );
  
      const [rawRes, decodedRes, projectRes] = results;
  
      const getJson = async (res: PromiseFulfilledResult<Response> | PromiseRejectedResult) => {
        if (res.status === 'fulfilled' && res.value.ok) {
          return res.value.json();
        } else {
          logger.warn(`Failed to fetch ${res.status === 'fulfilled' ? res.value.url : 'unknown file'}`);
          return [];
        }
      };
  
      return {
        raw: await getJson(rawRes),
        decoded: await getJson(decodedRes),
        project: await getJson(projectRes),
      };
    }
  
    static async start(runtime: IAgentRuntime) {
      const service = new ChainRegistryService(runtime);
      logger.log('ChainRegistryService started');
      return service;
    }
  
    async stop() {
      logger.log('ChainRegistryService stopped');
    }
  }
  