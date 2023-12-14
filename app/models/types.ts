export type Song = {
  id: string,
  title: string,
  artist: string,
  spotifyUri: string,
  userVotes: UserVote[],
  voteCount: number,
}

export type UserVote = {
  userId: string,
  vote: -1 | 0 | 1,
}

export type VoteStatus = -1 | 0 | 1;
