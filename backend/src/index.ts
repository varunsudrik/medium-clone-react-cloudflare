import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { bearerAuth } from 'hono/bearer-auth'
import { User } from './interface'
import { userRoute } from './routes/user'
import { blogRoute } from './routes/blog'
import { Context } from 'hono/jsx'
import { cors } from 'hono/cors'



// interface User {
//   name: string;
//   email: string;
//   password: string;
//   id?: string;
// }

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  },
  // Variables: {
  //   userId: String
  // }

}>();

app.use('/api/*', cors())
app.use(
  '/api2/*',
  cors({
    origin: 'http://example.com',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)


const JWT_ALGORITHM = 'HS256';
const UNAUTHORIZED_MESSAGE = 'Not Authorized';
const AUTHORIZATION_NOT_FOUND_MESSAGE = 'Authorization not found';

app.route('/api/v1/user', userRoute)



const authorizeMiddleware = async (c: any, next: () => Promise<void>) => {
  try {
    const authToken = c.req.header('Authorization');

    if (!authToken) {
      return c.text(AUTHORIZATION_NOT_FOUND_MESSAGE, 500);
    }

    const [bearer, token] = authToken.split(' ');

    if (!token) {
      return c.text(UNAUTHORIZED_MESSAGE, 500);
    }

    const decodedToken = await verify(token, c.env?.DATABASE_URL, JWT_ALGORITHM);
    console.log(`decodedToken => ${decodedToken}`)

    if (decodedToken) {

      c.set('authorID', decodedToken)

      await next();
    } else {
      return c.text(UNAUTHORIZED_MESSAGE, 500);
    }

  } catch (error) {
    console.error('Error during JWT verification:', error);
    return c.text('Internal Server Error', 500);
  }
}

app.use('/api/v1/blog/*', authorizeMiddleware)
app.route('/api/v1/blog', blogRoute);




app.get('/', (c) => {
  return c.text('Hello Hono!')
})
// app.post('/api/v1/signup', async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env?.DATABASE_URL,
//   }).$extends(withAccelerate())
//   let body = await c.req.json();

//   try {
//     const user: User = await prisma.user.create({
//       data: {
//         email: body.email,
//         password: body.password,
//         name: body.name
//       },
//     });

//     return c.json({
//       Id: `${user.id}`,
//       message: "signed up successfully"
//     })


//   } catch (error) {
//     console.error('error is', `${error}`)

//     return c.json({
//       message: `error is ${error}`,
//     })
//   }


// })




// app.post('/api/v1/signup2', async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env?.DATABASE_URL,
//   }).$extends(withAccelerate());
//   const body = await c.req.json();
//   try {
//     const user = await prisma.user.create({
//       data: {
//         email: body.email,
//         password: body.password
//       }
//     });

//     return c.text('jwt here')
//   } catch (e) {
//     return c.status(403);
//   }
// })







app.put('/api/v1/blog', (c) => {
  return c.text('post route Hono!')
})


app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

export default app
