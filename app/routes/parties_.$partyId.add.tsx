import { json, redirect, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, Form } from "@remix-run/react";
import { createSong, addSongToPlaylist } from "~/models/playlist.server";

import invariant from "tiny-invariant";
import { requireUserId } from "~/session.server";
import { getPlaylist } from "~/models/playlist.server";
import { SpotifySongResponse } from "~/models/types";
import { useState } from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.partyId, "partyId not found in url params");

  const playlist = await getPlaylist(params.partyId);
  if (!playlist) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ ownerId: playlist.owner.id });
}

// this action adds the song selected from the select to a playlist
export const action = async ({ request, params }: ActionFunctionArgs) => {
  console.log('in my own action now');
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const name = formData.get("title");
  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { body: null, title: "Name is required" } },
      { status: 400 },
    );
  }

  const artist = formData.get("artist");
  if (typeof artist !== "string" || artist.length === 0) {
    return json(
      { errors: { body: null, title: "Artist is required" } },
      { status: 400 },
    );
  }

  const spotifyUri = formData.get("spotifyUri");
  if (typeof spotifyUri !== "string" || spotifyUri.length === 0) {
    return json(
      { errors: { body: null, title: "spotifyUri is required" } },
      { status: 400 },
    );
  }

  const artUrl = formData.get("albumArtworkUrl");
  if (typeof artUrl !== "string" || artUrl.length === 0) {
    return json(
      { errors: { body: null, title: "albumArtworkUrl is required" } },
      { status: 400 },
    );
  }

  const song = await createSong(name, artist, spotifyUri, artUrl);

  await addSongToPlaylist(song, params.partyId!, userId);

  return redirect(`/parties/${params.partyId}`);
};

export default function AddSongModal() {
  const [searchTerm, setSearchTerm] = useState("");
  const songFetcher = useFetcher<SpotifySongResponse[]>();
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <songFetcher.Form
        method="get"
        action={`/spotify-fetch/${data.ownerId}`}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <label>
          <input
            name="search"
            type="text"
            value={searchTerm}
            placeholder="Song or Artist name"
            className={'rounded p-2'}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <input
            name="ownerId"
            type="hidden"
            value={data.ownerId}
          />
        </label>
        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Find Song
          </button>
        </div>
      </songFetcher.Form>

      {songFetcher.data &&
        <ul className={'rounded'}>
          {songFetcher.data.map((song: SpotifySongResponse) => {
            return (
              <li key={song.spotifyUri} className={"hover:text-green-600"}>
                <SongOptionRow song={song} />
              </li>
            )
          })}
        </ul>
      }
    </div>
  )
}

type SongOptionRowProps = {
  song: SpotifySongResponse,
}

const SongOptionRow = ({ song }: SongOptionRowProps) => {
  return (
    <Form method="post">
      <button
        type="submit"
      >
        <h1>{song.title} by {song.artist}</h1>
      </button>
      <input name="title" type="hidden" value={song.title} />
      <input name="artist" type="hidden" value={song.artist} />
      <input name="spotifyUri" type="hidden" value={song.spotifyUri} />
      <input name="albumArtworkUrl" type="hidden" value={song.albumArtworkUrl} />
    </Form>
  )
}
