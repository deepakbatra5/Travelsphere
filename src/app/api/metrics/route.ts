import { NextResponse } from 'next/server';
import client from 'prom-client';

// Prevent Next.js from statically rendering this route
export const dynamic = 'force-dynamic';

// Avoid registering metrics multiple times on hot-reload in development
let register = (global as any)._prometheusRegister;

if (!register) {
  register = new client.Registry();
  
  // Collect default metrics (CPU, Memory, Event Loop, etc.)
  client.collectDefaultMetrics({
    register,
    prefix: 'travelsphere_',
  });

  // Custom HTTP requests counter
  const httpRequestsTotal = new client.Counter({
    name: 'travelsphere_http_requests_total',
    help: 'Total number of HTTP requests handled',
    labelNames: ['method', 'status', 'path'],
    registers: [register],
  });

  // Custom HTTP request duration histogram
  const httpRequestDurationSeconds = new client.Histogram({
    name: 'travelsphere_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'status', 'path'],
    buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 3, 5],
    registers: [register],
  });

  // Expose them to a global registry
  (global as any)._prometheusRegister = register;
  (global as any)._prometheusHttpRequestsTotal = httpRequestsTotal;
  (global as any)._prometheusHttpRequestDurationSeconds = httpRequestDurationSeconds;
}

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (err: any) {
    return new NextResponse(err.message || 'Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
