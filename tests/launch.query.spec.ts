import { describe, expect, it, vi } from 'vitest';
import { type AppContext } from '../src/context.js';
import { type RestLaunchRecord, UpstreamServiceError } from '../src/datasources/spacex-api.js';
import { createServer } from '../src/server.js';

const lookupQuery = /* GraphQL */ `
  query Lookup($id: ID!) {
    launch(id: $id) {
      launch {
        id
        name
        detail
        tags
        summary
      }
      error {
        code
        message
      }
    }
  }
`;


const primary: RestLaunchRecord = { id: '5eb87cd9ffd86e000604b32a', name: 'FalconSat', details: 'Engine failure at 33 seconds.', outcomeName: 'failure', flightNumber: 1, payloadTags: ['payload-z', 'payload-a', 'failure'] };

const createMockContext = () => {
  const getLaunchById = vi.fn(async (_id: string) => null as RestLaunchRecord | null);

  const context: AppContext = {
    dataSources: {
      spaceXApi: {
        getLaunchById,
      },
    },
  };

  return { context, getLaunchById };
};

const executeSingle = async (query: string, variables: Record<string, unknown>, contextValue: AppContext) => {
  const server = createServer();

  try {
    const response = await server.executeOperation({ query, variables }, { contextValue });

    if (response.body.kind !== 'single') {
      throw new Error('Expected a single GraphQL result.');
    }

    return response.body.singleResult;
  } finally {
    await server.stop();
  }
};

describe('launch queries', () => {
  it('returns a mapped launch and computed summary for a valid id', async () => {
    const { context, getLaunchById } = createMockContext();
    getLaunchById.mockResolvedValue(primary);

    const result = await executeSingle(lookupQuery, { id: ' 5EB87CD9FFD86E000604B32A ' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      launch: {
        launch: {
          id: '5eb87cd9ffd86e000604b32a',
          name: 'FalconSat',
          detail: 'Engine failure at 33 seconds.',
          tags: ['failure', 'payload-a', 'payload-z'],
          summary: 'FalconSat (5eb87cd9ffd86e000604b32a) is a launch in FAILURE. Detail: Engine failure at 33 seconds. Flight number: 1.',
        },
        error: null,
      },
    });
    expect(getLaunchById).toHaveBeenCalledWith('5eb87cd9ffd86e000604b32a');
  });

  it('returns INVALID_INPUT and skips the datasource when the id is malformed', async () => {
    const { context, getLaunchById } = createMockContext();

    const result = await executeSingle(lookupQuery, { id: 'not-a-launch' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      launch: {
        launch: null,
        error: {
          code: 'INVALID_INPUT',
          message: 'Launch id must be a 24-character hexadecimal id.',
        },
      },
    });
    expect(getLaunchById).not.toHaveBeenCalled();
  });

  it('returns NOT_FOUND when the datasource cannot find a launch', async () => {
    const { context, getLaunchById } = createMockContext();
    getLaunchById.mockResolvedValue(null);

    const result = await executeSingle(lookupQuery, { id: '5eb87cd9ffd86e000604ffff' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      launch: {
        launch: null,
        error: {
          code: 'NOT_FOUND',
          message: 'No launch found for id "5eb87cd9ffd86e000604ffff".',
        },
      },
    });
  });

  it('returns UPSTREAM_ERROR when the datasource throws an upstream failure', async () => {
    const { context, getLaunchById } = createMockContext();
    getLaunchById.mockRejectedValue(new UpstreamServiceError('boom'));

    const result = await executeSingle(lookupQuery, { id: ' 5EB87CD9FFD86E000604B32A ' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      launch: {
        launch: null,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'SpaceX is currently unavailable.',
        },
      },
    });
  });
});
