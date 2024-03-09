// import { Hono } from 'hono'
// import { PrismaClient } from '@prisma/client/edge'
// import { withAccelerate } from '@prisma/extension-accelerate'
// import { decode, sign, verify } from 'hono/jwt'
// import { bearerAuth } from 'hono/bearer-auth'


// export const initMiddleWare = (app) => {
//     const JWT_ALGORITHM = 'HS256';
//     const UNAUTHORIZED_MESSAGE = 'Not Authorized';
//     const AUTHORIZATION_NOT_FOUND_MESSAGE = 'Authorization not found';

//     app.use('/api/v1/blog/*', async (c, next) => {
//         try {
//             const authToken = c.req.header('Authorization');

//             if (!authToken) {
//                 return c.text(AUTHORIZATION_NOT_FOUND_MESSAGE, 500);
//             }

//             const [bearer, token] = authToken.split(' ');

//             if (!token) {
//                 return c.text(UNAUTHORIZED_MESSAGE, 500);
//             }

//             const decodedToken = await verify(token, c.env?.DATABASE_URL, JWT_ALGORITHM);
//             console.log(`decodedToken => ${decodedToken}`)
//             if (decodedToken) {
//                 await next();
//             } else {
//                 return c.text(UNAUTHORIZED_MESSAGE, 500);
//             }

//         } catch (error) {
//             console.error('Error during JWT verification:', error);
//             return c.text('Internal Server Error', 500);
//         }
//     });
// }

