export function parseDateString(date: string) {
  const dt = new Date(date)

  return !isNaN(dt.getTime()) ? dt : null
}