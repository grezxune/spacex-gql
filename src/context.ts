import { SpaceXApi, type SpaceXApiContract } from './datasources/spacex-api.js';

export interface AppContext {
  dataSources: {
    spaceXApi: SpaceXApiContract;
  };
}

export const createContext = (): AppContext => ({
  dataSources: {
    spaceXApi: new SpaceXApi(),
  },
});
