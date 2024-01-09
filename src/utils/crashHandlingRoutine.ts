import { promises as fsPromises } from 'fs';

export default (error: Error) => {
  try {
    fsPromises.writeFile('errorLog.txt', error.message + '\n' + error.stack);
  } catch (error) {
    console.error("shit hitted the fan m8");
  }
}