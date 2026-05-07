import { z } from 'zod';
import { type LaunchOutcome } from '../modules/launch/launch.types.js';

const outcomeToApiValue = {
  'FAILURE': 'failure',
  'SUCCESS': 'success',
  'UPCOMING': 'upcoming',
} as const;

const isPresentString = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const RestLaunchRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  details: z.string().optional().nullable(),
  outcomeName: z.string().optional().nullable(),
  flightNumber: z.number().optional().nullable(),
  payloadTags: z.array(z.string()).optional().nullable(),
});

const RawLaunchSchema = z.object({ id: z.string(), name: z.string(), details: z.string().optional().nullable(), flight_number: z.number().optional().nullable(), success: z.boolean().optional().nullable(), upcoming: z.boolean().optional().nullable(), payloads: z.array(z.string()).optional().nullable() });
const RawLaunchCollectionSchema = z.array(RawLaunchSchema);
const toOutcome = (launch: z.infer<typeof RawLaunchSchema>): string => launch.upcoming ? 'upcoming' : launch.success === true ? 'success' : 'failure';
const toRecord = (launch: z.infer<typeof RawLaunchSchema>): RestLaunchRecord => ({ id: launch.id, name: launch.name, details: launch.details, outcomeName: toOutcome(launch), flightNumber: launch.flight_number, payloadTags: [toOutcome(launch), ...(launch.payloads ?? [])] });
const parseOne = (body: unknown): RestLaunchRecord => toRecord(RawLaunchSchema.parse(body));
const parseMany = (body: unknown): RestLaunchRecord[] => RawLaunchCollectionSchema.parse(body).map(toRecord);

export type RestLaunchRecord = z.infer<typeof RestLaunchRecordSchema>;

export interface SpaceXApiContract {
  getLaunchById(id: string): Promise<RestLaunchRecord | null>;
  getLaunchesByOutcome(outcome: LaunchOutcome): Promise<RestLaunchRecord[]>;
}

export class UpstreamServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpstreamServiceError';
  }
}

export class SpaceXApi implements SpaceXApiContract {
  constructor(private readonly baseUrl: string) {}

  async getLaunchById(id: string): Promise<RestLaunchRecord | null> {
    return this.fetchOne(`/launches/${encodeURIComponent(id)}`, { allowNotFound: true });
  }

  async getLaunchesByOutcome(outcome: LaunchOutcome): Promise<RestLaunchRecord[]> {
    const launches = await this.fetchMany('/launches');
    return launches.filter((launch) => launch.outcomeName === outcomeToApiValue[outcome]);
  }

  private async fetchOne(path: string, options: { allowNotFound?: boolean } = {}): Promise<RestLaunchRecord | null> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (response.status === 404 && options.allowNotFound) {
      return null;
    }

    if (!response.ok) {
      throw new UpstreamServiceError(`SpaceX API request failed with status ${response.status}`);
    }

    const body: unknown = await response.json();
    return parseOne(body);
  }

  private async fetchMany(path: string): Promise<RestLaunchRecord[]> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (!response.ok) {
      throw new UpstreamServiceError(`SpaceX API request failed with status ${response.status}`);
    }

    const body: unknown = await response.json();
    return parseMany(body);
  }
}
