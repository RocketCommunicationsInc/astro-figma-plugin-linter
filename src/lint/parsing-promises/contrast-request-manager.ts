import { LintingResult } from "../../types/results";

type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: any) => void;

interface PendingRequest<T> {
  resolve: ResolveFn<T>;
  reject: RejectFn;
  timer: number;
}

const pendingRequests = new Map<string, PendingRequest<any>>();
const REQUEST_TIMEOUT = 5000; // 5 seconds

export function createRequest<T>(requestId: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // const timer = window.setTimeout(() => {
    //   pendingRequests.delete(requestId);
    //   reject(new Error(`Request '${requestId}' timed out.`));
    // }, REQUEST_TIMEOUT);

    pendingRequests.set(requestId, { resolve, reject, timer: 0 });
  });
}

export function resolveRequest<T>(requestId: string, data: T) {
  const request = pendingRequests.get(requestId);
  console.log('requestId', requestId)
  if (request) {
    clearTimeout(request.timer);
    request.resolve(data);
    pendingRequests.delete(requestId);
  }
}
