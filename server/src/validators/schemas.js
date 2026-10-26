import { z } from 'zod';
export const createCaseSchema=z.object({premise:z.string().trim().min(20).max(600),tone:z.enum(['cozy','suspenseful','noir','light-sci-fi']).default('suspenseful'),difficulty:z.enum(['easy','standard','challenging']).default('standard')}).strict();
export const progressSchema=z.object({reviewedEvidenceIds:z.array(z.string().max(40)).max(10).optional(),notes:z.string().max(2000).optional()}).strict();
export const accusationSchema=z.object({suspectId:z.string().min(1).max(40),rationale:z.string().max(1000).optional()}).strict();
