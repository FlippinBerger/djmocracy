export async function refreshToken(refreshToken: string) {
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
    }),
  };

  const res = await fetch(url, payload);
  const j = await res.json();

  //TODO store these tokens wherever they need to be stored instead of local
  localStorage.setItem('access_token', j.accessToken);
  localStorage.setItem('refresh_token', j.refreshToken);
}
