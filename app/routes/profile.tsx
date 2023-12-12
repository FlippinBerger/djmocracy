import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "You" }];

import { getOwnedPlaylists } from "~/models/playlist.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const playlists = await getOwnedPlaylists(userId);
  return json({ playlists });
};

export default function ProfilePage() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="h-full flex bg-slate-950 text-gray-300">
      <h1>Welcome to your profile</h1>
      {data.playlists.length === 0 ? (
        <p className="p-4">No notes yet</p>
      ) : (
        <ol>
          {data.playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link to={`/parties/${playlist.id}`}>
                <h1>{playlist.name}</h1>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
