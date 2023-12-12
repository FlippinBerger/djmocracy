import { getAuthHeader } from "./auth.server";

const baseUrl = 'https://api.spotify.com/v1';

export async function getSongsForPlaylist(playlistId: string, userId: string) {
  const res = await fetch(`${baseUrl}/playlists/${playlistId}/tracks`, {
    method: 'GET',
    headers: {
      'Authorization': await getAuthHeader(userId),
    },
  });

  if (res.status !== 200) {
    // TODO handle error
  }
}
