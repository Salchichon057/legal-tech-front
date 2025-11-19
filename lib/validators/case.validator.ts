import { z } from "zod"
import { CaseStatus } from "@/types/api"

export const createCaseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
})

export const updateCaseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").optional(),
  description: z.string().min(20, "Description must be at least 20 characters").optional(),
  status: z.nativeEnum(CaseStatus).optional(),
})

export const updateStatusSchema = z.object({
  status: z.nativeEnum(CaseStatus),
})

export type CreateCaseFormData = z.infer<typeof createCaseSchema>
export type UpdateCaseFormData = z.infer<typeof updateCaseSchema>
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>
