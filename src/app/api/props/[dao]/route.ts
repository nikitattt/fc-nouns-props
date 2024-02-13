import { NextRequest, NextResponse } from 'next/server'
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit'
import { loadProposals } from '@/lib/proposals'

const NEYNAR_KEY = process.env.NEYNAR_KEY

export async function POST(
  req: NextRequest,
  { params }: { params: { dao: string } }
) {
  // const body: FrameRequest = await req.json()

  // TODO: Think about verifying the data.
  // I'm not sure we need to check the validity
  // of the data as we don't use it in any meaningful way,
  // but I'm not 100% on this and need to check with @v streams

  // const { isValid, message } = await getFrameMessage(body, {
  //   neynarApiKey: NEYNAR_KEY
  // })

  // if (!isValid) {
  //   return new NextResponse('Unauthorized', { status: 401 })
  // }

  const proposals = await loadProposals()

  const propsOnPage = 3
  const numProposals = proposals.length

  const pagesTotal = Math.ceil(numProposals / propsOnPage)
  const proposalsLeft = pagesTotal > 1 ? numProposals - propsOnPage : 0

  const propLinks = []
  const ids = []

  for (let i = 0; i < numProposals; i++) {
    const proposal = proposals[i]
    const buttonId = i + 1
    const propId = proposal.id
    const url = `https://nouns.wtf/vote/${propId}`

    ids.push(propId)

    propLinks.push(
      `<meta name="fc:frame:button:${buttonId}" content="Prop #${propId}" />
      <meta name="fc:frame:button:${buttonId}:action" content="link" />
      <meta name="fc:frame:button:${buttonId}:target" content="${url}" />`
    )
  }

  const idsQueryParam = ids.join(',')

  const postUrl = `${process.env.HOST}/api/props/nouns`
  const imageUrl = `${process.env.HOST}/api/images/props/nouns?ids=${encodeURIComponent(idsQueryParam)}`

  console.log(imageUrl)

  const response = new NextResponse(
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

  response.headers.set('Cache-Control', 'max-age=900, stale-while-revalidate')

  return response
}

export const GET = POST
