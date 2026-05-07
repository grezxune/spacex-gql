export const outcomeValues = ['FAILURE', 'SUCCESS', 'UPCOMING'] as const;

export type LaunchOutcome = (typeof outcomeValues)[number];

export interface LaunchModel {
  id: string;
  name: string;
  detail: string | null;
  outcome: LaunchOutcome | null;
  metric: number;
  tags: string[];
}

export type LaunchLookupErrorCode = 'INVALID_INPUT' | 'NOT_FOUND' | 'UPSTREAM_ERROR';

export interface LaunchLookupError {
  code: LaunchLookupErrorCode;
  message: string;
}

export interface LaunchLookupResult {
  launch: LaunchModel | null;
  error: LaunchLookupError | null;
}
