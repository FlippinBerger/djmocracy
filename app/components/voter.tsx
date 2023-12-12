import { UpArrow } from './svgs/up-arrow'
import { DownArrow } from './svgs/down-arrow'
import { useState } from 'react'
import { VoteStatus } from '~/models/types'
import { useUser } from '~/utils'
import { Form, useSubmit } from '@remix-run/react'

type VoterProps = {
  partyId: string,
  voteCount: number,
  vote: number,
  songId: string,
}

export const Voter = ({ partyId, voteCount, vote, songId }: VoterProps) => {
  const [curr, setCurr] = useState(vote);
  const [voteButton, setVoteButton] = useState(0);
  const user = useUser();

  const submit = useSubmit();

  const handleChange = (newVote: number): number => {
    var newlySetVote: VoteStatus = 0;
    switch (newVote) {
      case -1: {
        if (curr !== -1) {
          newlySetVote = -1;
        }
        break;
      }
      case 1: {
        if (curr !== 1) {
          newlySetVote = 1;
        }
        break;
      }
    }

    if (newlySetVote !== curr) {
      setCurr(newlySetVote);
    }

    return newlySetVote;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    let formData = new FormData(form);

    const newVoteVal = handleChange(voteButton);

    formData.set("vote", newVoteVal.toString());

    submit(formData, {
      method: 'post',
      action: form.getAttribute('action') ?? form.action,
    });
  }

  const enabledColor = "#16a34a";

  return (
    <Form action={`/parties/${partyId}`} method='post' className='flex items-center' onSubmit={handleSubmit}>
      <button
        type='submit'
        onClick={() => setVoteButton(-1)}
      >
        <DownArrow color={curr === -1 ? enabledColor : undefined} />
      </button>
      <span>{voteCount}</span>
      <button
        type='submit'
        onClick={() => setVoteButton(1)}
      >
        <UpArrow color={curr === 1 ? enabledColor : undefined} />
      </button>
      <input type='hidden' name='userId' value={user.id} />
      <input type='hidden' name='partyId' value={partyId} />
      <input type='hidden' name='songId' value={songId} />
    </Form>
  )
}
