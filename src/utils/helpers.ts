import { Request } from 'express';

const calculatePercentage = (total: number, sold: number) => {
  return (sold / total) * 100;
};

/**
 * Gets the base URL from the request, using BASE_URL env var if available,
 * otherwise constructing it from the request protocol and host.
 * Handles reverse proxies by checking X-Forwarded-Proto header.
 */
const getBaseUrl = (req: Request): string => {
  // Use BASE_URL from env if available
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  // Otherwise, construct from request
  // Check for X-Forwarded-Proto (common in reverse proxies like nginx)
  const protocol = req.get('X-Forwarded-Proto') || req.protocol || 'http';
  const host = req.get('host') || req.get('X-Forwarded-Host') || 'localhost:3000';
  return `${protocol}://${host}`;
};

export { calculatePercentage, getBaseUrl };