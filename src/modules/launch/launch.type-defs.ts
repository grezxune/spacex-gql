export const launchTypeDefs = /* GraphQL */ `
  enum LaunchOutcome {
    FAILURE
    SUCCESS
    UPCOMING
  }

  enum LaunchLookupErrorCode {
    INVALID_INPUT
    NOT_FOUND
    UPSTREAM_ERROR
  }

  type LaunchLookupError {
    code: LaunchLookupErrorCode!
    message: String!
  }

  type Launch {
    id: ID!
    name: String!
    detail: String
    tags: [String!]!
    summary: String!
  }

  type LaunchLookupResult {
    launch: Launch
    error: LaunchLookupError
  }

  extend type Query {
    launch(id: ID!): LaunchLookupResult!
    launchesByOutcome(outcome: LaunchOutcome!, limit: Int = 5): [Launch!]!
  }
`;
