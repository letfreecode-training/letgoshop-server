import { Router, Request, Response } from 'express';
import { RedisClient } from 'redis';

const userCheckRouter = (routers: Router, redisClient: RedisClient) => {
  routers.post('/userCheck', (req: Request, res: Response) => {
    const cookies: any = req.headers.cookies;
    if (cookies) {
      try {
        const parseCookie = JSON.parse(cookies);
        const ut = parseCookie.ut;
        redisClient.get(ut, (err, reply: any) => {
          if (!reply) {
            res.status(200).send({
              statusCode: 200,
              payload: {
                isLogin: false,
                userInfo: {}
              }
            });
          } else {
            const userInfo = JSON.parse(reply);
            console.log(userInfo);
            res.status(200).send({
              statusCode: 200,
              payload: {
                isLogin: true,
                userInfo
              }
            });
          }
        });
      } catch (err) {}
    }
  });

  return routers;
};

export default userCheckRouter;
