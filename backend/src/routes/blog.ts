import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { bearerAuth } from 'hono/bearer-auth'
import { User } from '../interface'
import { z } from 'zod'
import { validator } from 'hono/validator'
import { newBlogSchema, updateBlogSchema, getBlogSchema } from "medium-clone-helper"

export const blogRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
    },
    // Variables: {
    //     userId: String
    // }

}>();

blogRoute.post('/new',
    validator('json', (value, c) => {
        const parsed = newBlogSchema.safeParse(value)
        if (!parsed.success) {
            return c.json('Invalid Payload', 401)
        }
        return parsed.data
    }),

    async (c) => {
        // const name = c.req.param('id')
        // let body = await c.req.json()
        const body = c.req.valid('json')
        //  console.log('bodyyyy', body)
        const userId = c.get('authorID')
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate())

        try {
            const post = await prisma.post.create({
                data: {
                    title: body.title,
                    content: body.content,
                    authorId: userId,

                },
            });
            console.log('post=>', post)

            return c.json({ id: post.id })


        } catch (error) {
            console.error('error is', `${error}`)

            return c.json({
                message: `error is ${error}`,
            })
        }

        // const id = c.req.

    })
blogRoute.post('/update',
    validator('json', (value, c) => {
        const parsed = updateBlogSchema.safeParse(value)
        if (!parsed.success) {
            return c.json('Invalid Payload', 401)
        }
        return parsed.data
    }),

    async (c) => {
        // const name = c.req.param('id')
        let body = await c.req.json()
        const userId: string = c.get('authorID')
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate())

        try {
            const post = await prisma.post.update({
                where: {
                    id: body.postId,
                    authorId: userId
                },
                data: {
                    title: body.title,
                    content: body.content,

                }
            });
            //   console.log('update post=>', post)

            return c.json({
                post: `${post}`,
                message: "post updated successfully"
            })


        } catch (error) {
            console.error('error is', `${error}`)

            return c.json({
                message: `error is ${error}`,
            })
        }

        // const id = c.req.

    })
blogRoute.get('/all', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blogs = await prisma.post.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }

        });
        //  console.log('get post=>', post)

        return c.json({
            blogs
        })


    } catch (error) {
        console.error('error is', `${error}`)

        return c.json({
            message: `error is ${error}`,
        })
    }

    // const id = c.req.

})
blogRoute.get('/:id',
    validator('param', (value, c) => {
        const parsed = getBlogSchema.safeParse(value)
        if (!parsed.success) {
            return c.json('Invalid Payload', 401)
        }
        return parsed.data
    }),

    async (c) => {
        const id = c.req.param('id')
        const userId: string = c.get('authorID')
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate())

        try {
            const blog = await prisma.post.findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    author: {
                        select: {
                            name: true
                        }
                    }
                }

            });
            //  console.log('get post=>', post)
            // if (post) {
            //     return c.json({
            //         title: `${post?.title}`,
            //         content: `${post?.content}`,
            //         message: "post get successfully"
            //     })
            if (blog) {
                return c.json({
                    blog
                })

            }
            return c.json({
                error: 'post not found'
            })




        } catch (error) {
            console.error('error is', `${error}`)

            return c.json({
                message: `error is ${error}`,
            })
        }

        // const id = c.req.

    })


