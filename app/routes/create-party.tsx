import { json, redirect, ActionFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

import { createPlaylist } from "~/models/playlist.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { body: null, title: "Name is required" } },
      { status: 400 },
    );
  }

  const playlist = await createPlaylist(name, userId);

  if (!playlist) {
    return json(
      { errors: { body: null, title: "Unable to create playlist" } },
      { status: 500 },
    );
  }

  return redirect(`/parties/${playlist.id}`);
};

export default function CreatePartyPage() {
  return (
    <main className="h-full flex flex-col bg-slate-950 text-gray-300">
      <h1>Create a party</h1>
      <div className='w-1/4'>
        <Link
          to='/spotify-connect'
          className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 mb-4 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
        >
          Connect to Spotify
        </Link>
      </div>
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
            <span>Playlist Name: </span>
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
              Create Playlist
            </button>
          </div>
        </Form>
      </div>
    </main >
  )
}
