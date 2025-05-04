// lib/payload-request-context.ts
import { NextRequest } from 'next/server'
import { contextLog } from './requestContext'
import { performance } from 'perf_hooks';
// Type for a Payload route handler
type PayloadHandler = (req: NextRequest, context?: any) => any

// Function to wrap a Payload handler with request context
export function withPayloadRequestContext(handler: PayloadHandler): PayloadHandler {
  return async (req: NextRequest, context?: any) => {
    const startTime = performance.now();
    try {
      contextLog(`Starting ${req.method} request to ${req.nextUrl.pathname}`)

      // Execute the original handler
      const response = await handler(req, context)
      const duration = performance.now() - startTime;
      contextLog(`(${duration.toFixed(2)}) Completed ${req.method} request to ${req.nextUrl.pathname}`)

      return response
    } catch (error) {
      const duration = performance.now() - startTime;
      contextLog(`(${duration.toFixed(2)}) Error in ${req.method} request to ${req.nextUrl.pathname} : ${error.message}`)
      throw error
    }
  }

  // Run the original handler within our request context
  // return await withRequestContext(requestId, startTime, async () => {
  //   try {
  //     contextLog(`Starting ${req.method} request to ${req.nextUrl.pathname}`);

  //     // Execute the original handler
  //     const response = await handler(req, context);

  //     contextLog(`Completed ${req.method} request to ${req.nextUrl.pathname}`);

  //     return response;
  //   } catch (error) {
  //     contextLog(`Error in ${req.method} request to ${req.nextUrl.pathname}`, {
  //       error: error.message
  //     });
  //     throw error;
  //   }
  // });
}
