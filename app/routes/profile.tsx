import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "You" }];

import { getPlaylistListItems } from "~/models/playlist.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const playlistItems = await getPlaylistListItems({ userId });
  return json({ playlistItems });
};

export default function ProfilePage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <main className="h-full flex bg-slate-950 text-gray-300">
      <h1>Welcome to your profile</h1>
      {data.playlistItems.length === 0 ? (
        <p className="p-4">No notes yet</p>
      ) : (
        <ol>
          {data.playlistItems.map((playlist) => (
            <li key={playlist.id}>
              <h1>{playlist.name}</h1>
              {/* <NavLink */}
              {/*   className={({ isActive }) => */}
              {/*     `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}` */}
              {/*   } */}
              {/*   to={note.id} */}
              {/* > */}
              {/*   📝 {note.title} */}
              {/* </NavLink> */}
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
