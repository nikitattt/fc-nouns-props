export interface Proposal {
  id: number
  title: string
  state: string
  endTime: number
  quorum?: number
  votes?: {
    yes: number
    no: number
    abstain: number
  }
}

export interface ProposalSubgraphEntity {
  id: String
  startBlock: string
  endBlock: string
  status: string
  description: string
}
