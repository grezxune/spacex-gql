import { type AppContext } from '../../context.js';
import { type LaunchLookupResult, type LaunchModel } from './launch.types.js';

interface LaunchQueryArgs {
  id: string;
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
            message: 'TODO: return a clearer invalid-input message' } };
      }

      // TODO:
      // - fetch the launch from the datasource
      // - return NOT_FOUND when the datasource returns null
      // - return UPSTREAM_ERROR when the REST API is unavailable
      // - return the mapped launch on success
      throw new Error('TODO: implement Query.launch');
    },
  },

  Launch: {
    summary: (_launch: LaunchModel): string => {
      // TODO:
      // - derive a readable summary from the mapped LaunchModel
      // - include name, id, outcome, metric, and detail/fallback
      throw new Error('TODO: implement Launch.summary');
    } } };
