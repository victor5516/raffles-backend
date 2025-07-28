import 'dotenv/config';

interface Config {
  jwtSecret: string;
  jwtExpiry: string;
  corsOrigin: string;
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config: Config = {
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiry: getEnv('JWT_EXPIRY', '1h'),
  corsOrigin: getEnv('CORS_ORIGIN', ''),
};
