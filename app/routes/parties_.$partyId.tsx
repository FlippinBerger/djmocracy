import { json, ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, Outlet, useSubmit } from "@remix-run/react";

import invariant from "tiny-invariant";
import SongList from "~/components/song-list";
import { getPlaylist, getSongsWithVoterInfo, getVoterMap, updateVote } from "~/models/playlist.server";
import { VoteStatus } from "~/models/types";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Your Party" }];

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.partyId, "partyId not found in url params");

  const playlist = await getPlaylist({ id: params.partyId, userId });
  if (!playlist) {
    throw new Response("Not Found", { status: 404 });
  }

  const songs = await getSongsWithVoterInfo(playlist.id, userId);
  const voterMap = await getVoterMap(playlist.id, userId);

  return json({ playlist, songs, voterMap });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  console.log('in the action on the party page');
  // const userId = await requireUserId(request);
  const formData = await request.formData();
  // const name = formData.get("name");

  // if (typeof name !== "string" || name.length === 0) {
  //   return json(
  //     { errors: { body: null, title: "Name is required" } },
  //     { status: 400 },
  //   );
  // }

  const playlistId = formData.get("playlistId");
  if (typeof playlistId !== "string" || playlistId.length === 0) {
    return json(
      { errors: { body: null, title: "playlistId is required" } },
      { status: 400 },
    );
  }

  const userId = formData.get("userId");
  if (typeof userId !== "string" || userId.length === 0) {
    return json(
      { errors: { body: null, title: "userId is required" } },
      { status: 400 },
    );
  }

  const songId = formData.get("songId");
  if (typeof songId !== "string" || songId.length === 0) {
    return json(
      { errors: { body: null, title: "songId is required" } },
      { status: 400 },
    );
  }

  const vote = formData.get("vote");
  if (typeof vote !== "number") {
    return json(
      { errors: { body: null, title: "vote should be a number" } },
      { status: 400 },
    );
  }

  await updateVote(playlistId, userId, songId, vote);

  // TODO might need to update this one, eh?
  return json({ status: 200 });
};

export default function PartyPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  const submit = useSubmit();

  const handleVote = (newVote: VoteStatus, songId: string) => {
    console.log('calling vote handler on the party page');
    const postData = {
      'playlistId': data.playlist.id,
      'userId': user.id,
      'songId': songId,
      'vote': newVote as number,
    };

    console.log('data stuff', JSON.stringify(postData));

    // fetch(`/parties/${data.playlist.id}`, {
    //   method: 'POST',
    //   body: JSON.stringify(postData),
    // });
    submit({
      json: JSON.stringify(postData),
      method: "post"
    });
  }

  return (
    <main className="h-full flex flex-col p-4 bg-slate-950 text-gray-300">
      <h3 className="text-2xl font-bold">{data.playlist.name} by {data.playlist.owner.username}</h3>
      <SongList songs={data.songs} voterMap={data.voterMap} handleVote={handleVote} />
      <Outlet />
    </main>
  );
}
