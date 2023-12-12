import { Song, VoteStatus } from "../models/types";
import { Voter } from "./voter";

type SongRowProps = {
  song: Song,
  vote: number,
  handleVote: (newVote: VoteStatus, songId: string) => void,
}

export const SongRow = ({ song, vote, handleVote }: SongRowProps) => {
  const handleNewVote = (newVote: VoteStatus) => {
    console.log('handling vote');
    handleVote(newVote, song.id);
  }

  return (
    <div className="flex items-center gap-2">
      <Voter voteCount={0} vote={vote} handleVote={handleNewVote} />
      <div>
        <h1>
          {song.title}
        </h1>
        <h1>{song.artist}</h1>
      </div>
    </div>
  )
}
