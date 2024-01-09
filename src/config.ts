import dotenv from 'dotenv';

let result

try {
  result = dotenv.config()
} catch (error) {
  throw new Error(error)
}

export const { parsed: envs } = result;