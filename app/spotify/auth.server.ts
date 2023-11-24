import invariant from "tiny-invariant";

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
