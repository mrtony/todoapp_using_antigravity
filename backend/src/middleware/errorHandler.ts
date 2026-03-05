import type { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error]', err.message)

  const status = err.status || 500
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  })
}
