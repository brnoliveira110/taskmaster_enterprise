import { z } from 'zod';
import { Priority, TodoStatus } from './types';

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export const CreateTodoSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority),
  dueDate: z.string().optional(), // HTML date input returns string YYYY-MM-DD
  categoryIds: z.array(z.string()).optional(),
});

export type CreateTodoFormValues = z.infer<typeof CreateTodoSchema>;