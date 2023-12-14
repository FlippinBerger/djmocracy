import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";

import { addSpotifyId, storeTokens } from "~/models/user.server";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) {
    return json('user must be logged in to connect to Spotify');
  }

  const url = new URL(request.url);
  const error = url.searchParams.get("error")

  if (error) {
    return json("an error occurred: " + error, { status: 500 })
  }

  const code = url.searchParams.get("code");
  if (!code) {
    return json("Unable to auth with spotify", { status: 500 });
  }

  const tokenUrl = "https://accounts.spotify.com/api/token";

  const authLine = 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'));

  const body = new URLSearchParams({
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': 'http://localhost:3000/spotify-callback',
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': authLine,
    },
    body,
  });

  if (res.status !== 200) {
    return json("Unable to trade auth code for access token", { status: 500 });
  }

  const jsonRes = await res.json();
  await storeTokens(userId, jsonRes.access_token, jsonRes.refresh_token, jsonRes.expires_in);

  const profileUrl = "https://api.spotify.com/v1/me";
  const profileRes = await fetch(profileUrl, {
    method: 'GET',
    headers: {
      // 'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${jsonRes.access_token}`,
    },
  });

  if (profileRes.status !== 200 && profileRes.status !== 204) {
    console.log("res is", res);
    return json("Unable to fetch current user from spotify", { status: 500 });
  }

  const profileResJson = await profileRes.json();
  await addSpotifyId(userId, profileResJson.id);

  return redirect('/');
}

