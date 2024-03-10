import { z, ZodError } from 'zod';

export const newBlogSchema = z.object({
    title: z.string(),
    authId: z.string(),
    content: z.string(),
});

export type newBlogType = z.input<typeof newBlogSchema>; // string




export const updateBlogSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
});

export type updateBlogType = z.input<typeof newBlogSchema>; // string


export const getBlogSchema = z.object({
    id: z.string(),
});

export type getBlogType = z.input<typeof newBlogSchema>; // string


export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type signinType = z.input<typeof signInSchema>; // string

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type signUpType = z.input<typeof signUpSchema>; // string



