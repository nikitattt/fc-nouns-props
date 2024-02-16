import { Proposal } from '@/utils/types'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getProposalEndTimestamp, getProposalState } from './proposalHelpers'

const ANKR_KEY = process.env.ANKR_KEY

const ethClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://rpc.ankr.com/eth/${ANKR_KEY}`)
})

type Ids = number[]

export async function loadProposals(
  dao: string,
  ids?: Ids
): Promise<Proposal[]> {
  if (dao === 'nouns') {
    return await loadNounsProposals(ids)
  } else {
    return await loadBuilderL1Proposals(ids)
  }
}

async function loadNounsProposals(ids?: Ids): Promise<Proposal[]> {
  const url = 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph'
  const query = `
    query NounsData($where: Proposal_filter) {
      proposals(
        where: $where
        orderBy: endBlock
        orderDirection: desc
      ) {
        id
        proposer {
          id
        }
        startBlock
        endBlock
        quorumVotes
        minQuorumVotesBPS
        maxQuorumVotesBPS
        title
        status
        executionETA
        forVotes
        againstVotes
        abstainVotes
        totalSupply
      }
    }
  `

  let where: any = {
    status_in: ['ACTIVE'],
    id_gte: 495
  }

  if (ids && ids.length > 0) {
    where = {
      id_in: ids
    }
  }

  // let result: AxiosResponse = await axios.post(url, { query: query })
  // const data = result.data.data

  const requestBody = JSON.stringify({
    query: query,
    variables: {
      where: where
    }
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: requestBody,
    next: { revalidate: 900 }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  const data = result.data

  const blockNumber = await ethClient.getBlockNumber()

  const proposals = Array<Proposal>()

  for (const prop of data.proposals) {
    const state = getProposalState(Number(blockNumber), prop)

    if (state) {
      // console.log(prop)

      let propToAdd: Proposal = {
        id: Number(prop.id),
        title: prop.title,
        state: state,
        endTime: getProposalEndTimestamp(Number(blockNumber), state, prop),
        quorum: prop.quorumVotes
      }

      if (state === 'ACTIVE') {
        propToAdd.votes = {
          yes: prop.forVotes,
          no: prop.againstVotes,
          abstain: prop.abstainVotes
        }
      }

      proposals.push(propToAdd)
    }
  }

  proposals.sort((a, b) => a.id - b.id)

  return proposals
}

async function loadBuilderL1Proposals(ids?: Ids): Promise<Proposal[]> {
  const url = 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph'
  const query = `
    query NounsData($where: Proposal_filter) {
      proposals(
        where: $where
        orderBy: endBlock
        orderDirection: desc
      ) {
        id
        proposer {
          id
        }
        startBlock
        endBlock
        quorumVotes
        minQuorumVotesBPS
        maxQuorumVotesBPS
        title
        status
        executionETA
        forVotes
        againstVotes
        abstainVotes
        totalSupply
      }
    }
  `

  let where: any = {
    status_in: ['ACTIVE'],
    id_gte: 495
  }

  if (ids && ids.length > 0) {
    where = {
      id_in: ids
    }
  }

  // let result: AxiosResponse = await axios.post(url, { query: query })
  // const data = result.data.data

  const requestBody = JSON.stringify({
    query: query,
    variables: {
      where: where
    }
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: requestBody,
    next: { revalidate: 900 }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  const data = result.data

  const blockNumber = await ethClient.getBlockNumber()

  const proposals = Array<Proposal>()

  for (const prop of data.proposals) {
    const state = getProposalState(Number(blockNumber), prop)

    if (state) {
      // console.log(prop)

      let propToAdd: Proposal = {
        id: Number(prop.id),
        title: prop.title,
        state: state,
        endTime: getProposalEndTimestamp(Number(blockNumber), state, prop),
        quorum: prop.quorumVotes
      }

      if (state === 'ACTIVE') {
        propToAdd.votes = {
          yes: prop.forVotes,
          no: prop.againstVotes,
          abstain: prop.abstainVotes
        }
      }

      proposals.push(propToAdd)
    }
  }

  proposals.sort((a, b) => a.id - b.id)

  return proposals
}
