import { Song } from "../models/types";
import { Voter } from "./voter";

type SongRowProps = {
  partyId: string,
  song: Song,
  vote: number,
}

export const SongRow = ({ partyId, song, vote }: SongRowProps) => {

  const getVoteCount = (song: Song): number => {
    let count = 0;

    song.userVotes.forEach((userVote) => {
      count += userVote.vote;
    });

    return count;
  }

  return (
    <div className="flex items-center gap-2">
      <Voter voteCount={getVoteCount(song)} vote={vote} partyId={partyId} songId={song.id} />
      <div>
        <h1>
          {song.title}
        </h1>
        <h1>{song.artist}</h1>
      </div>
    </div>
  )
}
