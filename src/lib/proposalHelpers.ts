import { ProposalSubgraphEntity } from '@/utils/types'

export const getProposalState = (
  blockNumber: number,
  proposal: ProposalSubgraphEntity
) => {
  const status = proposal.status
  if (status === 'PENDING') {
    if (blockNumber <= parseInt(proposal.startBlock)) {
      return 'PENDING'
    }
    return 'ACTIVE'
  }
  if (status === 'ACTIVE') {
    if (blockNumber > parseInt(proposal.endBlock)) {
      return null
    }
    return 'ACTIVE'
  }
  return null
}

export const getPropHouseRoundState = (status: string) => {
  if (status === 'Upcoming') return 'PENDING'
  else if (status === 'Open') return 'PROPOSING'
  else return 'ACTIVE'
}

export const getProposalTitle = (proposal: ProposalSubgraphEntity) => {
  const titleEnd = proposal.description.indexOf('\n\n')

  return proposal.description.substring(2, titleEnd)
}

export const getProposalEndTimestamp = (
  blockNumber: number,
  state: string,
  proposal: ProposalSubgraphEntity
) => {
  let blocksToGo
  if (state === 'ACTIVE') {
    blocksToGo = parseInt(proposal.endBlock) - blockNumber
  } else {
    blocksToGo = parseInt(proposal.startBlock) - blockNumber
  }

  return Date.now() + blocksToGo * 12 * 1000
}

export const getPropHouseRoundTimestamp = (round: any) => {
  let date

  if (round.status === 'Upcoming') date = round.startTime
  else if (round.status === 'Open') date = round.proposalEndTime
  else date = round.votingEndTime

  return new Date(date).getTime()
}
