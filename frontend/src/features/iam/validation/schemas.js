import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['MALE', 'FEMALE'], 'Select a gender'),
  districtName: z.string().trim().min(1, 'District is required'),
  traineeCategory: z.string().trim().min(1, 'Category is required'),
  region: z.string().optional().default(''),
  street: z.string().optional().default(''),
  city: z.string().optional().default(''),
  postalCode: z.string().optional().default(''),
  phoneCountryCode: z.string().optional().default(''),
  phoneNationalNumber: z.string().optional().default(''),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
})

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(12, 'Password must be at least 12 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })
