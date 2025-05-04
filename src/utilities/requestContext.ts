import { AsyncLocalStorage } from 'async_hooks';
import { isMainThread, threadId } from 'worker_threads';

interface RequestContext {
  requestId?: string;
  startTime?: number;
  url?: string;
  method?: string;
}

// Create a singleton AsyncLocalStorage instance
export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export function threadInfo():string {
  return `Thread: ${isMainThread ? 'main' : threadId}`
}

// Helper functions that use AsyncLocalStorage
export function getRequestStore(): RequestContext {
  return asyncLocalStorage.getStore() || {};
}

export function getRequestId(): string {
  const store = getRequestStore();
  return store.requestId || 'unknown';
}

export function getRequestStoreString(): string {
  return JSON.stringify(getRequestStore());
}

export function getRequestStartTime(): number {
  const store = getRequestStore();
  return store.startTime || Date.now();
}

// export function contextLog(message: string, data: Record<string, any> = {}): void {
//   const requestId = getRequestId();
//   const startTime = getRequestStartTime();
//   const elapsed = Date.now() - startTime;
  
//   console.log(`[${requestId}] +${elapsed}ms - Thread: ${threadInfo()} - ${message}`, data);
// }

export function contextLog(message) {
  console.log(`${new Date().toISOString()} - ${message}`)
}

export function setRequestContext(context: RequestContext):void {
  const store = getRequestStore();
  store.requestId = context.requestId
  store.startTime = context.startTime
}

// Modified wrapper that uses AsyncLocalStorage
export function withRequestContext<T>(
  requestId: string, 
  startTime: number,
  fn: () => T | Promise<T>
): T | Promise<T> {
  return asyncLocalStorage.run({ requestId, startTime }, fn);
}