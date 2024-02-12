import { FrameRequest } from '@coinbase/onchainkit'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { cid: string } }
) {
  const cid = params.cid

  const body: FrameRequest = await req.json()

  // TODO: worth to use trusted data?
  const buttonIndex = body.untrustedData.buttonIndex

  if (buttonIndex === 1) {
    return NextResponse.redirect(`ipfs://${cid}`, { status: 302 })
  } else {
    return NextResponse.redirect(
      `https://harlequin-careful-lungfish-606.mypinata.cloud/ipfs/${cid}`,
      {
        status: 302
      }
    )
  }
}
