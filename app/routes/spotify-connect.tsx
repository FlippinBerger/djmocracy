import invariant from "tiny-invariant";

import { redirect } from "@remix-run/node";

export async function loader() {
  var scope = 'user-read-private user-read-email playlist-modify-public playlist-read-collaborative';
  invariant(process.env.SPOTIFY_CLIENT_ID, "SPOTIFY_CLIENT_ID must be set");

  // TODO generate random state here
  var state = '123456'
  var redirect_uri = 'http://localhost:3000/spotify-callback';

  const urlSearchParams = new URLSearchParams(`?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`);

  const url = 'https://accounts.spotify.com/authorize?' + urlSearchParams.toString();

  return redirect(url);
}

