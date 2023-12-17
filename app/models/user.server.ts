import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as crypto from 'crypto';

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string, username?: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      username: username || "",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      spotifyUserId: "",
      accessToken: "",
      refreshToken: "",
      expiresAt: new Date(),
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export function encryptToken(token: string): string {
  const algo = 'aes-256-gcm';
  var key = Buffer.from(process.env.AES_KEY!, 'hex');

  // add uniqueness to AES IV with maybe user id or something
  const iv = Buffer.from(process.env.AES_IV!, 'hex');


  const cipher = crypto.createCipheriv(algo, key, iv);
  var encrypted = cipher.update(token, 'utf-8', 'hex');

  return encrypted;
}

export function decryptToken(token: string): string {
  const algo = 'aes-256-gcm';
  const key = Buffer.from(process.env.AES_KEY!, 'hex');

  // add uniqueness to AES IV with maybe user id or something
  const iv = Buffer.from(process.env.AES_IV!, 'hex');

  const decipher = crypto.createDecipheriv(algo, key, iv);
  let decrypted = decipher.update(token, 'hex', 'utf-8');

  return decrypted;
}

export async function storeTokens(userId: string, accessToken: string, refreshToken: string, expiresIn: number) {
  var expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
    }
  });
}

export async function addSpotifyId(userId: string, spotifyId: string) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      spotifyUserId: spotifyId,
    }
  });
}

