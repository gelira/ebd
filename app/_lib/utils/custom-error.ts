export class CustomError extends Error {
  constructor(public message: string, public status: number = 400) {
    super(message)
    this.name = 'CustomError'
  }
}

export function responseHandlingCustomError(err: unknown) {
  const e = err as CustomError

  const error = e.message || 'Something went wrong'
  const status = e.status || 500

  return Response.json({ error }, { status })
}
