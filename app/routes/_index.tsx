import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { getAllPlaylists } from "~/models/playlist.server";

export const meta: MetaFunction = () => [{ title: "DJmocracy" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const parties = await getAllPlaylists(userId);

  return json({ parties });
};

export default function Index() {
  const user = useOptionalUser();
  const data = useLoaderData<typeof loader>();

  return (
    <main className="h-full min-h-screen bg-slate-950 pt-2 flex justify-between">
      {user ? (
        <div className="h-full min-h-screen w-full flex flex-col items-center gap-2"> {/*className="mx-auto flex flex-col gap-2 items-center justify-center">*/}
          <header className="flex items-center justify-between w-full p-4 text-gray-300 border-b">
            <h1 className="text-2xl font-bold hover:text-blue-500">
              <Link to=".">DJmocracy</Link>
            </h1>
            <Link to="/profile" className="hover:text-blue-500">{(user.username !== "") ? user.username : user.email}</Link>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Logout
              </button>
            </Form>
          </header>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/parties/find"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
            >
              Find a Party
            </Link>
            <Link
              to="/create-party"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
            >
              Create Party
            </Link>
            <Link
              to='/spotify-connect'
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
            >
              Connect to Spotify
            </Link>
            {/* <Link */}
            {/*   to='/gen-keys' */}
            {/*   className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8" */}
            {/* > */}
            {/*   Gen Keys */}
            {/* </Link> */}
          </div>

          {data.parties.length > 0 ? (
            <div className="flex flex-col">
              <h1>Parties</h1>
              <ul>
                {data.parties.map((party) => (
                  <li key={party.id}>
                    <Link
                      to={`parties/${party.id}`}
                      className=""
                    >
                      {party.name} by {party.owner.username}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='text-gray-300'>No parties</div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full justify-center items-center sm:flex-row">
          <Link
            to="/join"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
          >
            Log In
          </Link>
        </div>
      )}
    </main>
  );
}
