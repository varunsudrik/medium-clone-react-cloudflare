import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
interface User {
  name: string;
  email: string;
  password: string;
  id?: string;
}

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>();
const prisma = new PrismaClient()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.get('/yo', (c) => {
  return c.text('dfghjhgffgh Hono!')
})
app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())
  let body = await c.req.json();

  try {
    const user: User = await prisma.user.create({
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




app.post('/api/v1/signup2', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    });

    return c.text('jwt here')
  } catch (e) {
    return c.status(403);
  }
})






app.post('/api/v1/signin', async (c) => {
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
app.post('/api/v1/blog', (c) => {
  return c.text('post route Hono!')
})
app.put('/api/v1/blog', (c) => {
  return c.text('post route Hono!')
})
app.get('/api/v1/blog', (c) => {
  return c.text('post route Hono!')
})
app.get('/api/v1/blog/:id', (c) => {
  const name = c.req.param('id')

  return c.text(name)
})


app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

export default app
