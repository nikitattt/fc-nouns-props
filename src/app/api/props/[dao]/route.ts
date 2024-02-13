import { NextRequest, NextResponse } from 'next/server'
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit'
import { loadProposals } from '@/lib/proposals'

const NEYNAR_KEY = process.env.NEYNAR_KEY

export async function POST(req: NextRequest) {
  const body: FrameRequest = await req.json()
  // Step 3. Validate the message
  // const { isValid, message } = await getFrameMessage(body, {
  //   neynarApiKey: NEYNAR_KEY
  // })

  // if (!isValid) {
  //   return new NextResponse('Unauthorized', { status: 401 })
  // }

  // TODO: check for origin
  // let urlBuffer = validMessage?.data?.frameActionBody?.url ?? []
  // const urlString = Buffer.from(urlBuffer).toString('utf-8')
  // if (!urlString.startsWith(process.env['HOST'] ?? '')) {
  //   return new NextResponse('Bad Request', { status: 400 })
  // }

  const proposals = await loadProposals()

  const propsOnPage = 3
  const numProposals = proposals.length

  const pagesTotal = Math.ceil(numProposals / propsOnPage)
  const proposalsLeft = pagesTotal > 1 ? numProposals - propsOnPage : 0

  if (pagesTotal === 1) {
  } else {
  }

  const propLinks = []
  const params = new URLSearchParams()

  for (let i = 0; i < numProposals; i++) {
    const proposal = proposals[i]
    const buttonId = i + 1
    const propId = proposal.id
    const url = `https://nouns.wtf/vote/${propId}`

    propLinks.push(
      `<meta name="fc:frame:button:${buttonId}" content="View #${propId}" />
      <meta name="fc:frame:button:${buttonId}:action" content="link" />
      <meta name="fc:frame:button:${buttonId}:target" content="${url}" />`
    )

    // Prefix each key with the index to ensure uniqueness
    const prefix = `proposal[${i}]`

    params.append(`${prefix}[id]`, proposal.id.toString())
    params.append(`${prefix}[title]`, proposal.title)
    params.append(`${prefix}[state]`, proposal.state)
    params.append(`${prefix}[endTime]`, proposal.endTime.toString())

    // Optional properties
    if (proposal.quorum !== undefined) {
      params.append(`${prefix}[quorum]`, proposal.quorum.toString())
    }

    if (proposal.votes) {
      params.append(`${prefix}[votes][yes]`, proposal.votes.yes.toString())
      params.append(`${prefix}[votes][no]`, proposal.votes.no.toString())
      params.append(
        `${prefix}[votes][abstain]`,
        proposal.votes.abstain.toString()
      )
    }
  }

  const postUrl = `${process.env.HOST}/api/props/nouns`
  const imageUrl = `${process.env.HOST}/api/images/props/nouns?${params.toString()}`

  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <title>Nouns DAO props!</title>
          <meta property="og:title" content="Here is active Nouns DAO props!" />
          <meta property="og:image" content="${imageUrl}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          ${propLinks.join('')}
        </head>
        <body />
      </html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    }
  )
}

function noActiveProposals() {
  const imageUrl = `${process.env.HOST}/not-supported-or-valid.jpg`
  const postUrl = `${process.env.HOST}/api/save`

  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <title>URL not valid or content is not supported</title>
          <meta property="og:title" content="URL not valid or content is not supported" />
          <meta property="og:image" content="${imageUrl}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          <meta name="fc:frame:button:1" content="Save to IPFS" />
          <meta name="fc:frame:input:text" content="URL of the image to save" />
        </head>
        <body/>
      </html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    }
  )
}

export const GET = POST
