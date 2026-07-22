import prisma from '@/app/_lib/db/prisma'
import { getAuthenticatedUser } from '@/app/_lib/services/auth'
import { parseDateString } from '@/app/_lib/utils/date'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const PostSchema = z.object({
  completeName: z.string(),
  birthDate: z.string().nullable()
})

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({}, { status: 401 })
    }

    const body = await request.json()

    const validation = PostSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        z.treeifyError(validation.error),
        { status: 400 }
      )
    }

    const { completeName, birthDate } = validation.data

    await prisma.person.create({
      data: {
        completeName,
        birthDate: birthDate ? parseDateString(birthDate) : null,
        churchId: user.churchId,
      },
    })

    return NextResponse.json({}, { status: 201 })

  } catch {
    return NextResponse.json(
      { message: 'error to process this request'},
      { status: 500 }
    )
  }
}