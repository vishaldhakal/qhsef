import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.number(),
  text: z.string(),
  points: z.number(),
});

export const RequirementSchema = z.object({
  id: z.number(),
  name: z.string(),
  questions: z.array(QuestionSchema),
});

export const RequirementsResponseSchema = z.object({
  count: z.number(),
  next: z.null(),
  previous: z.null(),
  results: z.array(RequirementSchema),
});

// Infer types from schemas
export type Question = z.infer<typeof QuestionSchema>;
export type Requirement = z.infer<typeof RequirementSchema>;
export type RequirementsResponse = z.infer<typeof RequirementsResponseSchema>;

// Add these schemas
export const FormDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type FormData = z.infer<typeof FormDataSchema>;
