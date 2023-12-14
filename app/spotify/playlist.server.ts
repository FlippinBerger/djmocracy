import { getAuthHeader } from "./auth.server";
import { User, getUserById } from "~/models/user.server";

const baseUrl = 'https://api.spotify.com/v1';

export async function createPlaylist(name: string, user: User) {
  console.log('createPlaylist in spotify code');
  const data = { 'name': name };

  const res = await fetch(`${baseUrl}/users/${user.spotifyUserId}/playlists`, {
    method: 'POST',
    headers: {
      'Authorization': await getAuthHeader(user.id),
    },
    body: JSON.stringify(data),
  });

  if (res.status !== 200) {
    // TODO handle error 
    // return json("Unable to trade auth code for access token", { status: 500 });
  }

  const response = await res.json();

  console.log('spotify create playlist response', response);
  return response.id;
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
