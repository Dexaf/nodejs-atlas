export function getfieldName<T>(key: keyof T & string): keyof T & string {
  return key;
}