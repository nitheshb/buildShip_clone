"use server";
import { currentUser } from "@clerk/nextjs";
import { db } from "./db";

export const onGetTokens = async () => {
  const user = await currentUser();
  if (user) {
    const tokens = await db.accessTokenKeys.findMany({
      where: {
        userId: user.id,
      },
    });

    if (tokens) {
      const currentTime = new Date();
      const validTokens = tokens.filter((token) => {
        if (token.has_expiry) {
          const updatedAt = token.updatedAt;
          return currentTime.getTime() - updatedAt.getTime() <= 3600000;
        }
        return true;
      });

      return validTokens;
    }
  }
  return [];
};

export const onCreateTokenKey = async (
  tokenKey: string,
  tokenName: string,
  appName: string,
  hasExpiry: boolean = false,
  teamId: string = ""
) => {
  const user = await currentUser();
  console.log("helloe from ceakjkj");
  if (user) {
    const existingToken = await db.accessTokenKeys.findFirst({
      where: {
        userId: user.id,
        tokenKey,
      },
    });

    if (existingToken && !existingToken.has_expiry) {
      return;
    }

    if (existingToken && existingToken.has_expiry) {
      return;
    }

    const tokenCreated = await db.accessTokenKeys.create({
      data: {
        userId: user.id,
        tokenKey,
        tokenName,
        appName,
        has_expiry: hasExpiry,
        teamId,
      },
    });

    if (tokenCreated) return { message: "Token created!" };
    return { message: "Oops! Try again" };
  }
};

export const deleteExpiredToken = async () => {
  const user = await currentUser();
  if (user) {
    const currentTime = new Date();
    const deleteTokens = await db.accessTokenKeys.deleteMany({
      where: {
        userId: user.id,
        has_expiry: true,
        updatedAt: {
          lt: new Date(currentTime.getTime() - 3600000),
        },
      },
    });
    if (deleteTokens.count > 0) return { message: "Expired tokens deleted" };
  }
};

export const getTokenByAppName = async (appName: string) => {
  const user = await currentUser();
  if (user) {
    const token = await db.accessTokenKeys.findFirst({
      where: {
        userId: user.id,
        appName,
      },
    });

    return token;
  }
  return null;
};
