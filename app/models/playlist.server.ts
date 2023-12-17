import type { User, Playlist, Song } from "@prisma/client";
import { Song as ClientSong, VoteStatus } from "./types";

import { prisma } from "~/db.server";
import { getUserById } from "./user.server";
import { createPlaylist as spotifyCreatePlaylist } from "~/spotify/playlist.server";

export function getPlaylist(id: string) {
  return prisma.playlist.findFirst({
    select: { id: true, name: true, owner: true },
    where: { id },
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

  const spotifyPlaylistId = await spotifyCreatePlaylist(name, user);

  const playlist = await prisma.playlist.create({
    data: {
      name: name,
      spotifyId: spotifyPlaylistId,
      public: true,
      owner: {
        connect: {
          id: userId,
        }
      }
    }
  });

  // add self to the party via the user parties table
  await prisma.userParties.create({
    data: {
      userId: userId,
      playlistId: playlist.id,
    }
  })

  return playlist;
}

export async function createSong(title: string, artist: string, spotifyUri: string, artUrl: string) {
  return await prisma.song.create({
    data: {
      title,
      artist,
      spotifyUri,
      albumArtworkUrl: artUrl,
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
      played: false,
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

  var songs = await Promise.all(prismaSongs.map(async (song) => {
    const userVotes = await prisma.userVotes.findMany({
      select: { vote: true, userId: true },
      where: { songId: song.id }
    });

    const upVotes = await prisma.userVotes.count({
      where: { songId: song.id, vote: 1 }
    });

    const downVotes = await prisma.userVotes.count({
      where: { songId: song.id, vote: -1 }
    });

    return {
      id: song.id,
      title: song.title,
      artist: song.artist,
      spotifyUri: song.spotifyUri,
      userVotes,
      voteCount: upVotes - downVotes,
    } as ClientSong;
  }));

  songs.sort((a: ClientSong, b: ClientSong) => {
    if (a.voteCount < b.voteCount) {
      return 1;
    } else if (b.voteCount < a.voteCount) {
      return -1;
    }
    return 0;
  });

  return songs;
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

