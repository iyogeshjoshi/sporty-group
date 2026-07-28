import type { ApiError } from "../types";

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";
const RATE_LIMIT_RETRY_DELAY_MS = 5000;

export class ApiRequestError extends Error implements ApiError {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

/**
 * Fetches JSON data from the API and handles rate limiting and errors.
 * @param path path to fetch
 * @returns Promise of the JSON response
 * @throws ApiRequestError if the request fails or returns a non-OK status
 */
export async function fetchJson<T>(path: string): Promise<T> {
  let response = await request(path);

  if (response.status === 429) {
    await delay(RATE_LIMIT_RETRY_DELAY_MS);
    response = await request(path);
  }

  if (!response.ok) {
    throw new ApiRequestError(errorMessage(response.status), response.status);
  }

  return response.json() as Promise<T>;
}

/**
 * Makes a network request to the API.
 * @param path path to fetch
 * @returns Promise of the Response object
 * @throws ApiRequestError if the network request fails
 */
async function request(path: string): Promise<Response> {
  try {
    return await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new ApiRequestError("Network request failed.");
  }
}

/**
 * Generates an error message based on the HTTP status code.
 * @param status http status code
 * @returns error message based on the status code
 */
function errorMessage(status: number): string {
  if (status === 429) {
    return "Too many requests. Please try again in a moment.";
  }
  return `Request failed (${status}).`;
}

/**
 * Delays execution for a specified number of milliseconds.
 * @param ms milliseconds timeout
 * @returns Promise that resolves after the specified delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
