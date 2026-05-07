import { mergeResolvers } from '@graphql-tools/merge';
import { launchResolvers } from '../modules/launch/launch.resolver.js';

export const resolvers = mergeResolvers([launchResolvers]);
