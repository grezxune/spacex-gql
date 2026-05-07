import { describe, expect, it } from 'vitest';
import { type RestLaunchRecord } from '../src/datasources/spacex-api.js';
import { mapRestLaunchToLaunch } from '../src/modules/launch/launch.mapper.js';

const primary: RestLaunchRecord = { id: '5eb87cd9ffd86e000604b32a', name: 'FalconSat', details: 'Engine failure at 33 seconds.', outcomeName: 'failure', flightNumber: 1, payloadTags: ['payload-z', 'payload-a', 'failure'] };
const sparse: RestLaunchRecord = { id: '5eb87cdaffd86e000604b32b', name: 'Mystery Launch', details: '', outcomeName: 'failure', flightNumber: null, payloadTags: [] };

describe('mapRestLaunchToLaunch', () => {
  it('maps a SpaceX API response into the GraphQL model', () => {
    expect(mapRestLaunchToLaunch(primary)).toEqual({ id: '5eb87cd9ffd86e000604b32a', name: 'FalconSat', detail: 'Engine failure at 33 seconds.', outcome: 'FAILURE', metric: 1, tags: ['failure', 'payload-a', 'payload-z'] });
  });

  it('normalizes empty optional values, defaults metrics, and sorts tags', () => {
    expect(mapRestLaunchToLaunch(sparse)).toEqual({ id: '5eb87cdaffd86e000604b32b', name: 'Mystery Launch', detail: null, outcome: 'FAILURE', metric: 0, tags: [] });
  });
});
