import { Song } from "../models/types";
import { SongRow } from "./song-row";
import { Link } from "@remix-run/react";

type SongListProps = {
  songs: Song[],
  voterMap: Record<string, number>,
  partyId: string,
}

export default function SongList({ songs, voterMap, partyId }: SongListProps) {
  return (
    <ul className="flex flex-col gap-4 sm:ml-20">
      <li key="adder" className="hover:text-green-600 active:text-green-400">
        <Link to='add'>
          Add Song
        </Link>
      </li>
      {songs.map((song) => {
        return (
          <li key={song.id + song.title}>
            <SongRow song={song} vote={voterMap[song.id]} voteCount={song.voteCount} partyId={partyId} />
          </li>
        )
      })}
    </ul>
  )
}

