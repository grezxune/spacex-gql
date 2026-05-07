import { type AppContext } from '../../context.js';
import { type LaunchLookupResult, type LaunchModel, type LaunchOutcome } from './launch.types.js';

interface LaunchQueryArgs {
  id: string;
}

interface LaunchCollectionQueryArgs {
  outcome: LaunchOutcome;
  limit?: number | null;
}

const normalizeLaunchId = (id: string): string => id.trim().toLowerCase();

const isValidLaunchId = (id: string): boolean => /^[a-f0-9]{24}$/.test(id);

export const launchResolvers = {
  Query: {
    launch: async (_parent: unknown, arguments_: LaunchQueryArgs, _context: AppContext): Promise<LaunchLookupResult> => {
      const normalizedId = normalizeLaunchId(arguments_.id);

      if (!isValidLaunchId(normalizedId)) {
        return {
          launch: null,
          error: {
            code: 'INVALID_INPUT',
            message: 'TODO: return a clearer invalid-input message',
          },
        };
      }

      // TODO:
      // - fetch the launch from the datasource
      // - return NOT_FOUND when the datasource returns null
      // - return UPSTREAM_ERROR when the REST API is unavailable
      // - return the mapped launch on success
      throw new Error('TODO: implement Query.launch');
    },

    launchesByOutcome: async (_parent: unknown, _arguments: LaunchCollectionQueryArgs, _context: AppContext): Promise<LaunchModel[]> => {
      // TODO:
      // - fetch launches for the requested outcome
      // - map each DTO into the GraphQL model
      // - sort by name
      // - apply limit after sorting
      // - treat negative limits as 0
      throw new Error('TODO: implement Query.launchesByOutcome');
    },
  },

  Launch: {
    summary: (_launch: LaunchModel): string => {
      // TODO:
      // - derive a readable summary from the mapped LaunchModel
      // - include name, id, outcome, metric, and detail/fallback
      throw new Error('TODO: implement Launch.summary');
    },
  },
};
