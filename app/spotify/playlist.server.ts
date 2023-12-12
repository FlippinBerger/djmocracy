import { getAuthHeader } from "./auth.server";
import { getUserById } from "~/models/user.server";

const baseUrl = 'https://api.spotify.com/v1';

export async function create(name: string, userId: string) {
  const user = await getUserById(userId);
  if (!user) {
    // TODO error handling here
    return;
  }

  const data = { 'name': name };

  const res = await fetch(`${baseUrl}/users/${user.spotifyUserId}/playlists`, {
    method: 'POST',
    headers: {
      'Authorization': await getAuthHeader(userId),
    },
    body: JSON.stringify(data),
  });

  if (res.status !== 200) {
    // TODO handle error 
    // return json("Unable to trade auth code for access token", { status: 500 });
  }
}

export async function addSongToPlaylist(playlistId: string, songs: string[], userId: string) {
  const url = `${baseUrl}/playlists/${playlistId}/tracks`;

  const data = {
    'uris': songs,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': await getAuthHeader(userId),
    },
    body: JSON.stringify(data),
  });

  if (res.status !== 200) {
    // TODO handle error 
    // return json("Unable to trade auth code for access token", { status: 500 });
  }
}
