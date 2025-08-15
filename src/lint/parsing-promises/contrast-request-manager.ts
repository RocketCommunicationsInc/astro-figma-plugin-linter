type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: any) => void;

interface PendingContrastRequest<T> {
  resolve: ResolveFn<T>;
  reject: RejectFn;
  timer: number;
}

const pendingContrastRequests = new Map<string, PendingContrastRequest<any>>();

export function createContrastRequest<T>(requestId: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    pendingContrastRequests.set(requestId, { resolve, reject, timer: 0 });
  });
}

export function resolveContrastRequest<T>(requestId: string, data: T) {
  const request = pendingContrastRequests.get(requestId);
  if (request) {
    clearTimeout(request.timer);
    request.resolve(data);
    pendingContrastRequests.delete(requestId);
  }
}
