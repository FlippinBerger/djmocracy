import invariant from "tiny-invariant";

import { getUserById, storeTokens } from "~/models/user.server";
import type { User } from "@prisma/client";

export async function login() {
  var scope = 'user-read-private user-read-email playlist-modify-public playlist-read-collaborative';
  invariant(process.env.SPOTIFY_CLIENT_ID, "SPOTIFY_CLIENT_ID must be set");

  // TODO generate random state here
  var state = '123456'
  var redirect_uri = '/spotify-login';

  const urlSearchParams = new URLSearchParams(`?response_type='code'&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`);
  console.log('calling spotify authorize');

  const url = 'https://accounts.spotify.com/authorize?' + urlSearchParams.toString();
  console.log('url is ' + url);

  //TODO this must be a redirect
  var res = await fetch(url);
  console.log('Status is ' + res.status.toString());
}

export function getToken(): string {
  return ""
}

export async function refreshToken(user: User) {
  console.log('refreshing the token');
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
    }),
  };

  const res = await fetch(url, payload);
  const j = await res.json();

  await storeTokens(user.id, j.accessToken, j.refreshToken, j.expires_in);
}

export async function getAuthHeader(userId: string): Promise<string> {
  const user = await getUserById(userId);

  if (!user) {
    // TODO handle error
    console.log('user isnt real');
    return "";
  }

  let now = new Date();
  if (now >= user.expiresAt) {
    refreshToken(user);
  }

  return `Bearer ${user.accessToken}`;
}
