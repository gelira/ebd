import db from '../db'
import { CustomError } from '../utils/custom-error'

const CODE_MINUTES_TO_EXPIRE = 15

export async function generateAuthCode({ email }: { email: string }) {
  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new CustomError('User not found', 404)
  }

  const code = Math.floor(Math.random() * 999999).toString().padStart(6, '0')

  const expiredAt = new Date()
  expiredAt.setMinutes(expiredAt.getMinutes() + CODE_MINUTES_TO_EXPIRE)

  const authCode = await db.authCode.create({
    data: {
      code,
      userId: user.id,
      expiredAt,
    },
  })

  return authCode
}