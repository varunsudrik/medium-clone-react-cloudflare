import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { bearerAuth } from 'hono/bearer-auth'
import { User } from '../interface'

export const userRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string
    }
}>();


userRoute.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    let body = await c.req.json();

    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name
            },
        });

        return c.json({
            Id: `${user.id}`,
            message: "signed up successfully"
        })


    } catch (error) {
        console.error('error is', `${error}`)

        return c.json({
            message: `error is ${error}`,
        })
    }


})

userRoute.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    let body = await c.req.json();

    try {
        let password = body.password;
        let email = body.email;

        let signIn = await prisma.user.findUnique({
            where: { email }

        })

        if (signIn) {

            if (signIn.password === password) {

                let jwt = await sign(
                    signIn.id,
                    c.env?.DATABASE_URL,
                    'HS256'
                );

                return c.json({
                    token: `${jwt}`,
                    message: "logged-in"
                })

            }

        }
        else
            console.log(signIn)
        return c.text('invalid credentials / user not found')

        // return c.text('user signed in')

    } catch (error) {
        console.log(error);

    }



    return c.text('post route Hono!')
})