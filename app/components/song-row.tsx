import { Song } from "../models/types";
import { Voter } from "./voter";

type SongRowProps = {
  partyId: string,
  song: Song,
  vote: number,
  voteCount: number,
}

export const SongRow = ({ partyId, song, vote, voteCount }: SongRowProps) => {
  return (
    <div className="flex items-center gap-2">
      <Voter voteCount={voteCount} vote={vote} partyId={partyId} songId={song.id} />
      <div>
        <h1>
          {song.title}
        </h1>
        <h1>{song.artist}</h1>
      </div>
    </div>
  )
}
