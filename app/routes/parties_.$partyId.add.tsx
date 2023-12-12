import { json, redirect, ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createSong, addSongToPlaylist } from "~/models/playlist.server";

import { requireUserId } from "~/session.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { body: null, title: "Name is required" } },
      { status: 400 },
    );
  }

  // need to implement a search feature based on name and then use the results
  // of the search to populate the title, artist, and spotifyUri
  const song = await createSong(name, "Posty");

  await addSongToPlaylist(song, params.partyId!, userId);

  return redirect(`/parties/${params.partyId}`);
};

export default function AddSongModal() {
  return (
    <div>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <label>
          <span>Song Name: </span>
          <input
            name="name"
            className='rounded'
          />
        </label>
        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Add Song
          </button>
        </div>
      </Form>
    </div>
  )
}
