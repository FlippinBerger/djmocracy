import type { User, Playlist, Song } from "@prisma/client";
import { Song as ClientSong, VoteStatus } from "./types";

import { prisma } from "~/db.server";
import { getUserById } from "./user.server";

export function getPlaylist({
  id,
  userId,
}: Pick<Playlist, "id"> & {
  userId: User["id"];
}) {
  return prisma.playlist.findFirst({
    select: { id: true, name: true, owner: true },
    where: { id, userId },
  });
}

export function getOwnedPlaylists(userId: string) {
  return prisma.playlist.findMany({
    select: { id: true, name: true },
    where: { userId: userId },
  });
}

export async function getAllPlaylists(userId: string) {
  const playlistIds = await prisma.userParties.findMany({
    select: { playlistId: true },
    where: { userId: userId }
  });

  const playlists = playlistIds.map((pl) => pl.playlistId);

  return prisma.playlist.findMany({
    select: { id: true, name: true, owner: true },
    where: { id: { in: playlists } }
  })
}

export async function createPlaylist(name: string, userId: string) {
  const user = await getUserById(userId);
  // TODO error handling
  if (!user) return null;

  const playlist = await prisma.playlist.create({
    data: {
      name: name,
      spotifyId: user.spotifyUserId,
      public: true,
      owner: {
        connect: {
          id: userId,
        }
      }
    }
  })

  // add self to the party via the user parties table
  await prisma.userParties.create({
    data: {
      userId: userId,
      playlistId: playlist.id,
    }
  })

  return playlist;
}

export async function createSong(title: string, artist: string) {
  return await prisma.song.create({
    data: {
      title,
      artist,
      spotifyUri: ""
    }
  })
}

export async function addSongToPlaylist(song: Song, playlistId: string, userId: string) {
  // default to an upvote when user adds a song
  await prisma.userVotes.create({
    data: {
      vote: 1,
      userId,
      playlistId,
      songId: song.id,
    }
  })

  const playlistSong = await prisma.playlistSongs.create({
    data: {
      playlistId: playlistId,
      songId: song.id,
    }
  })

  return playlistSong;
}

export async function getPlaylistSongs(playlistId: string) {
  const playlistSongs = await prisma.playlistSongs.findMany({
    select: { songId: true },
    where: { playlistId: playlistId },
  });

  const songIds = playlistSongs.map((ps) => ps.songId);

  return prisma.song.findMany({
    select: { id: true, title: true, artist: true, spotifyUri: true },
    where: { id: { in: songIds } }
  });
}

export async function getSongsWithVoterInfo(playlistId: string, userId: string): Promise<ClientSong[]> {
  const prismaSongs = await getPlaylistSongs(playlistId);

  return Promise.all(prismaSongs.map(async (song) => {
    const userVotes = await prisma.userVotes.findMany({
      select: { vote: true, userId: true },
      where: { songId: song.id }
    });

    return {
      id: song.id,
      title: song.title,
      artist: song.artist,
      spotifyUri: song.spotifyUri,
      userVotes,
    } as ClientSong;
  }));
}

export async function getVoterMap(playlistId: string, userId: string) {
  const userVotes = await prisma.userVotes.findMany({
    select: { vote: true, songId: true },
    where: { playlistId, userId }
  })

  const map: Record<string, number> = {};

  userVotes.forEach((userVote) => {
    map[userVote.songId] = userVote.vote
  });

  return map;
}

export async function updateVote(playlistId: string, userId: string, songId: string, vote: VoteStatus) {
  return await prisma.userVotes.upsert({
    where: {
      userId_playlistId_songId: {
        userId,
        playlistId,
        songId
      }
    },
    create: {
      playlistId,
      userId,
      songId,
      vote,
    },
    update: {
      vote: vote
    }
  })
}

