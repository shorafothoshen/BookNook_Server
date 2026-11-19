import type { NextFunction, Request, Response } from "express";

export const verifyToken = async (req: Request,res: Response,next: NextFunction,): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ msg: "Unauthorized!" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send({ msg: "Unauthorized!" });
    return;
  }

//   const JWKS = createRemoteJWKSet(
//     new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
//   );

  try { 
    // const { payload } = await jwtVerify(token, JWKS);
    next();
  } catch {
    res.status(500).send({ msg: "Server Error!" });
  }
};