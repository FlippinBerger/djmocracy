import { UpArrow } from './svgs/up-arrow'
import { DownArrow } from './svgs/down-arrow'
import { useState } from 'react'
import { VoteStatus } from '~/models/types'

type VoterProps = {
  voteCount: number,
  vote: number,
  handleVote: (newVote: VoteStatus) => void;
}

export const Voter = ({ voteCount, vote, handleVote }: VoterProps) => {
  const [curr, setCurr] = useState(vote);

  const handleChange = (newVote: -1 | 1) => {
    var newlySetVote: VoteStatus = 0;
    switch (newVote) {
      case -1: {
        if (curr !== -1) {
          newlySetVote = -1;
        }
      }
      case 1: {
        if (curr !== 1) {
          newlySetVote = 1;
        }
      }
    }

    if (newlySetVote !== curr) {
      setCurr(newlySetVote);
      handleVote(newlySetVote);
    }
  }

  const enabledColor = "#16a34a";

  return (
    <div className="flex items-center">
      <div className="active:fill-red-200">
        <button
          onClick={() => handleChange(-1)}
        >
          <DownArrow color={curr === -1 ? enabledColor : undefined} />
        </button>
      </div>
      <span>{voteCount}</span>
      <div>
        <button
          className={""}
          onClick={() => handleChange(1)}
        >
          <UpArrow color={curr === 1 ? enabledColor : undefined} />
        </button>
      </div>
    </div>
  )
}
