import 'server-only'
import { notFound } from 'next/navigation'

export function parseIntParam(param: string) {
  if (!param) {
    notFound()
  }

  const val = parseInt(param)

  if (isNaN(val)) {
    notFound()
  }

  return val
}