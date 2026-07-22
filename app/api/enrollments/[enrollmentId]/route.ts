import prisma from '@/app/_lib/db/prisma'
import { getAuthenticatedUser } from '@/app/_lib/services/auth'
import { NextResponse } from 'next/server'

export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ enrollmentId: string }> }
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({}, { status: 401 })
    }

    const params = await ctx.params
    const enrollmentId = parseInt(params.enrollmentId)

    if (isNaN(enrollmentId)) {
      return NextResponse.json(
        { message: 'Matrícula não encontrada' },
        { status: 404 }
      )
    }

    await prisma.enrollment.delete({
      where: { id: enrollmentId },
    })
  
    return NextResponse.json({}, { status: 200 })

  } catch {
    return NextResponse.json(
      { message: 'error to process this request' },
      { status: 500 }
    )
  }
}