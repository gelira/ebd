'use client'

import { deleteEnrollment } from '@/app/_lib/actions/enrollment'
import { useTransition } from 'react'

interface RemoveEnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  enrollmentId: number
  personName: string
  classroomName: string
}

export default function RemoveEnrollmentModal({
  isOpen,
  onClose,
  onConfirm,
  enrollmentId,
  personName,
  classroomName,
}: RemoveEnrollmentModalProps) {
  const [_, startTransition] = useTransition()

  const handleConfirm = () => {
    startTransition(async () => {
      const { ok } = await deleteEnrollment({ enrollmentId })
      if (!ok) {
        return onClose()
      }

      onConfirm()
    })
  }

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`} aria-labelledby="modal-title">
      <div className="modal-box">
        <h3 id="modal-title" className="font-bold text-lg text-error flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Confirmar Remoção
        </h3>
        <p className="py-4 text-base">
          Tem certeza que deseja remover a matrícula de <span className="font-semibold text-base-content">{personName}</span> da classe <span className="font-semibold text-base-content">{classroomName}</span>?
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-error text-white" onClick={handleConfirm}>
            Sim, remover
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>fechar</button>
      </form>
    </dialog>
  )
}