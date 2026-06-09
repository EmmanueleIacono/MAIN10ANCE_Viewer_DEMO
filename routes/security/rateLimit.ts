import type {Request, Response, NextFunction} from 'express';

type RateLimitOptions = {
  windowMs?: number;
  max?: number;
  keyPrefix?: string;
};

type HitRecord = {
  count: number;
  resetAt: number;
};

function createRateLimiter({ windowMs = 60_000, max = 30, keyPrefix = 'global' }: RateLimitOptions = {}) {
  const hits = new Map<string, HitRecord>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${keyPrefix}:${req.ip || req.socket?.remoteAddress || 'unknown'}`;
    const record = hits.get(key);

    if (!record || now > record.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      res.setHeader('Retry-After', Math.ceil((record.resetAt - now) / 1000));
      return res.status(429).json({ message: 'Troppe richieste, riprovare tra poco' });
    }

    next();
  };
}

module.exports = { createRateLimiter };
