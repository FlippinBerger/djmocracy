import type { User, Playlist } from "@prisma/client";

import { prisma } from "~/db.server";

export function getPlaylist({
  id,
  userId,
}: Pick<Playlist, "id"> & {
  userId: User["id"];
}) {
  return prisma.playlist.findFirst({
    select: { id: true, name: true, songs: true },
    where: { id, userId },
  });
}

export function getPlaylistListItems({ userId }: { userId: User["id"] }) {
  return prisma.playlist.findMany({
    where: { userId },
    select: { id: true, name: true, songs: true },
  });
}
