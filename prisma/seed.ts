import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "chris";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("pass", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      accessToken: "",
      refreshToken: "",
      expiresAt: new Date(),
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  let songIds = [];

  let song = await prisma.song.create({
    data: {
      title: "Rockstar",
      artist: "Post Malone",
    }
  });
  songIds.push(song.id);

  song = await prisma.song.create({
    data: {
      title: "Sunflower",
      artist: "Post Malone",
    }
  });
  songIds.push(song.id);

  song = await prisma.song.create({
    data: {
      title: "Wow",
      artist: "Post Malone",
    }
  });
  songIds.push(song.id);

  await prisma.playlist.create({
    data: {
      name: "Bangerz",
      userId: user.id,
    }
  })

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
