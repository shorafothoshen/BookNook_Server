import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

declare global {
  namespace Express {
    interface Request {
      user?: { email: string };
    }
  }
}

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

  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
  )

  try { 
    const { payload } = await jwtVerify(token, JWKS);
    const email = payload.email;
    req.user = { email: email as string };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(500).send({ msg: "Server Error!" });
  }
};