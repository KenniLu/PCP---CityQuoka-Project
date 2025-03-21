export default function findLongestArray<T>(arrays: T[][]): T[] {
  if (arrays.length === 0) {
    return [];
  }
  
  return arrays.reduce((longest, current) => {
    return current.length > longest.length ? current : longest;
  }, arrays[0]);
}