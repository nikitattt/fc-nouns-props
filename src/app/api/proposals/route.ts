import { NextRequest, NextResponse } from 'next/server'
import pinataSDK from '@pinata/sdk'
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit'
import axios from 'axios'
import { Readable } from 'stream'

const NEYNAR_KEY = process.env.NEYNAR_KEY

export async function POST(req: NextRequest) {
  const body: FrameRequest = await req.json()
  // Step 3. Validate the message
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: NEYNAR_KEY
  })

  if (!isValid) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // TODO: check for origin
  // let urlBuffer = validMessage?.data?.frameActionBody?.url ?? []
  // const urlString = Buffer.from(urlBuffer).toString('utf-8')
  // if (!urlString.startsWith(process.env['HOST'] ?? '')) {
  //   return new NextResponse('Bad Request', { status: 400 })
  // }

  const response = await axios.get(inputText, {
    responseType: 'arraybuffer'
  })

  const postUrl = `${process.env.HOST}/api/link/${cid}`
  const imageUrl = `${process.env.HOST}/api/images/cid?cid=${cid}`

  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <title>Image saved to IPFS!</title>
          <meta property="og:title" content="Image saved to IPFS!" />
          <meta property="og:image" content="${imageUrl}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          <meta name="fc:frame:button:1" content="Direct IPFS link" />
          <meta name="fc:frame:button:1:action" content="post_redirect" />
          <meta name="fc:frame:button:2" content="Pinata Gateway link" />
          <meta name="fc:frame:button:2:action" content="post_redirect" />
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

function notSupportedOrValid() {
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
