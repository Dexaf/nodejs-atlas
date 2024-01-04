import dotenv from 'dotenv';

const result = dotenv.config()

if (result.error) {
  throw result.error;
}

export const { parsed: envs } = result;