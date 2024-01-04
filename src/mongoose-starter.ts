import mongoose from "mongoose"
import { envs } from './config.js'

export const connect = () => {
  const CURRENT_MONGODB_URL = envs!.MONGODB_URL
    .replace("@MONGODB_USER@", envs!.MONGODB_USER)
    .replace("@MONGODB_PASSWORD@", envs!.MONGODB_PASSWORD)
    .replace("@MONGODB_URL_CORE@", envs!.MONGODB_URL_CORE)
    .replace("@MONGODB_DB_NAME@", envs!.MONGODB_DB_NAME)
    .replace("@MONGODB_URL_OPTIONS@", envs!.MONGODB_URL_OPTIONS)

  return mongoose.connect(CURRENT_MONGODB_URL)
}