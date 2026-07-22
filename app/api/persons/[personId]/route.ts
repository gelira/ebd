import prisma from '@/app/_lib/db/prisma'
import { getAuthenticatedUser } from '@/app/_lib/services/auth'
import { parseDateString } from '@/app/_lib/utils/date'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const PutSchema = z.object({
  completeName: z.string(),
  birthDate: z.string().nullable()
})

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ personId: string }> }
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({}, { status: 401 })
    }

    const params = await ctx.params
    const personId = parseInt(params.personId)

    if (isNaN(personId)) {
      return NextResponse.json(
        { message: 'Pessoa não encontrada' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const validation = PutSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        z.treeifyError(validation.error),
        { status: 400 }
      )
    }

    const { completeName, birthDate } = validation.data

    await prisma.person.update({
      where: { id: personId, churchId: user.churchId },
      data: {
        completeName,
        birthDate: birthDate ? parseDateString(birthDate) : null,
      }
    })
  
    return NextResponse.json({}, { status: 200 })

  } catch {
    return NextResponse.json(
      { message: 'error to process this request' },
      { status: 500 }
    )
  }
}