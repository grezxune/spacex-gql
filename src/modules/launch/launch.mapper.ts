import { type RestLaunchRecord } from '../../datasources/spacex-api.js';
import { type LaunchModel } from './launch.types.js';

export const mapRestLaunchToLaunch = (_launch: RestLaunchRecord): LaunchModel => {
  // TODO:
  // - map the SpaceX API DTO to the GraphQL-facing LaunchModel
  // - convert empty optional values to null where appropriate
  // - default numeric fields used by summary so output is deterministic
  // - sort tags alphabetically
  throw new Error('TODO: implement mapRestLaunchToLaunch');
};
