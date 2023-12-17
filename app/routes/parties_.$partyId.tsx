import { json, ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";

import invariant from "tiny-invariant";
import { MusicPlayer } from "~/components/player";
import SongList from "~/components/song-list";
import { getPlaylist, getSongsWithVoterInfo, getVoterMap, updateVote } from "~/models/playlist.server";
import { VoteStatus } from "~/models/types";
import { requireUserId } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "Your Party" }];

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.partyId, "partyId not found in url params");

  const playlist = await getPlaylist(params.partyId);
  if (!playlist) {
    throw new Response("Not Found", { status: 404 });
  }

  const songs = await getSongsWithVoterInfo(playlist.id, userId);
  const voterMap = await getVoterMap(playlist.id, userId);

  return json({ userId, playlist, songs, voterMap });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const playlistId = formData.get("partyId");
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
  if (typeof vote !== "string" || vote.length === 0) {
    return json(
      { errors: { body: null, title: "vote is required" } },
      { status: 400 },
    );
  }

  const voteVal = getVoteVal(vote);
  await updateVote(playlistId, userId, songId, voteVal);

  // TODO might need to update this one, eh?
  return json({ status: 200 });
};

const getVoteVal = (vs: string): VoteStatus => {
  if (vs === "-1") {
    return -1;
  } else if (vs === "0") {
    return 0;
  } else {
    return 1;
  }
}

export default function PartyPage() {
  const data = useLoaderData<typeof loader>();

  const isOwner = data.userId === data.playlist.owner.id;

  return (
    <main className="h-full flex flex-col p-4 bg-slate-950 text-gray-300">
      <h3 className="text-2xl font-bold">{data.playlist.name} by {data.playlist.owner.username || 'flippin'}</h3>
      {isOwner && <MusicPlayer />}
      <Outlet />
      <SongList songs={data.songs} voterMap={data.voterMap} partyId={data.playlist.id} />
    </main>
  );
}
