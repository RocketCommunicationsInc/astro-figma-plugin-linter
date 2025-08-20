import { ContrastResults } from "../../types/results";

type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: unknown) => void;

interface PendingContrastRequest {
  resolve: ResolveFn<ContrastResults>;
  reject: RejectFn;
  timer: number;
}

const pendingContrastRequests = new Map<string, PendingContrastRequest>();

const createContrastRequest = (requestId: string): Promise<ContrastResults> => {
  return new Promise<ContrastResults>((resolve, reject) => {
    pendingContrastRequests.set(requestId, { resolve, reject, timer: 0 });
  });
};

const resolveContrastRequest = (requestId: string, data: ContrastResults): void => {
  const request = pendingContrastRequests.get(requestId);
  if (request) {
    clearTimeout(request.timer);
    request.resolve(data);
    pendingContrastRequests.delete(requestId);
  }
};

export { createContrastRequest, resolveContrastRequest };
