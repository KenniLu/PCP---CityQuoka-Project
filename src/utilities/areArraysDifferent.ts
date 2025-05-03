export function areArraysDifferent(arr1: number[], arr2: number[]): boolean {
  const sorted1 = [...new Set(arr1)].sort((a, b) => a - b)
  const sorted2 = [...new Set(arr2)].sort((a, b) => a - b)

  if (sorted1.length !== sorted2.length) {
    return true
  }

  for (let i = 0; i < sorted1.length; i++) {
    if (sorted1[i] !== sorted2[i]) {
      return true
    }
  }

  return false
}
