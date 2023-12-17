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
  const url = "https://accounts.spotify.com/api/token";
  const clientIdAndSecret = `${process.env.SPOTIFY_CLIENT_ID!}:${process.env.SPOTIFY_CLIENT_SECRET!}`
  const authPayload = btoa(clientIdAndSecret);

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authPayload}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.refreshToken,
    }),
  };

  const res = await fetch(url, payload);
  const j = await res.json();

  await storeTokens(user.id, j.access_token, user.refreshToken, j.expires_in);
}

export async function getAuthHeader(userId: string): Promise<string> {
  var user = await getUserById(userId);

  if (!user) {
    // TODO handle error
    console.log('user isnt real');
    return "";
  }

  let now = new Date();

  if (now >= user.expiresAt) {
    await refreshToken(user);
  }

  return `Bearer ${user.accessToken}`;
}
