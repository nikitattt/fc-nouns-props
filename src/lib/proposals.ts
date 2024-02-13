import { Proposal } from '@/utils/types'
import axios, { AxiosResponse } from 'axios'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getProposalEndTimestamp, getProposalState } from './proposalHelpers'

const ANKR_KEY = process.env.ANKR_KEY

const client = createPublicClient({
  chain: mainnet,
  transport: http(`https://rpc.ankr.com/eth/${ANKR_KEY}`)
})

const url = 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph'
const query = `
    query NounsData {
      proposals(
        where: {status_in: [ACTIVE], id_gte: 495}
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

export async function loadProposals() {
  let result: AxiosResponse = await axios.post(url, { query: query })
  const data = result.data.data

  const blockNumber = await client.getBlockNumber()

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
