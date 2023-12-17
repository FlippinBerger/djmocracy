import { getAuthHeader } from "./auth.server";
import { SpotifySongResponse } from "~/models/types";

const baseUrl = 'https://api.spotify.com/v1';

export async function search(query: string, ownerId: string) {
  const authHeader = await getAuthHeader(ownerId);

  const q = new URLSearchParams(`q=${query}`);
  const url = `${baseUrl}/search?${q}&type=track`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
    },
  });

  if (res.status !== 200) {
    // TODO handle error
  }

  const jsonRes = await res.json();

  const rVal: SpotifySongResponse[] = jsonRes.tracks.items.map((item: any) => {
    return {
      title: item.name,
      artist: item.artists[0].name,
      spotifyUri: item.uri,
      albumArtworkUrl: item.album.images[0].url
    } as SpotifySongResponse;
  });

  // TODO format the response to be all that we need from spotify
  return rVal;
}
