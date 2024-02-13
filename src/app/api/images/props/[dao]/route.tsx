import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { join } from 'path'
import * as fs from 'fs'
import { Proposal } from '@/utils/types'

export const dynamic = 'force-dynamic'

const unboundedBlackPath = join(process.cwd(), 'public/Unbounded-Black.ttf')
let unboundedBlack = fs.readFileSync(unboundedBlackPath)

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const proposalsFromQuery = searchParams.get('proposals')

  if (!proposalsFromQuery || !Array.isArray(proposalsFromQuery)) {
    return new NextResponse('Invalid data', { status: 400 })
  }

  const proposals: Proposal[] = proposalsFromQuery.map((p: any) => {
    const { id, title, state, endTime, quorum, votes } = p as any // Cast to 'any' because query params are not typed

    return {
      id: parseInt(id, 10),
      title,
      state,
      endTime: parseInt(endTime, 10),
      quorum: quorum ? parseInt(quorum, 10) : undefined,
      votes: votes
        ? {
            yes: parseInt(votes.yes, 10),
            no: parseInt(votes.no, 10),
            abstain: parseInt(votes.abstain, 10)
          }
        : undefined
    }
  })

  function Prop({ prop }: { prop: Proposal }) {
    return (
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
          margin: '25px 0 10px',
          color: 'gray'
        }}
      >
        {prop.title}
      </p>
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex', // Use flex layout
          flexDirection: 'row', // Align items horizontally
          alignItems: 'stretch', // Stretch items to fill the container height
          width: '100%',
          height: '100vh', // Full viewport height
          // backgroundImage: 'linear-gradient(0deg, #FFF493 0%, #FFFFFF 70%)'
          background: '#FFFFFF'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingLeft: 52,
            paddingRight: 52,
            flex: 1,
            marginTop: 52,
            width: '100%'
          }}
        >
          {proposals.map((prop, i) => (
            <Prop key={i} prop={prop} />
          ))}
        </div>
      </div>
    ),
    {
      width: 1528,
      height: 800,
      fonts: [
        {
          name: 'Unbounded',
          data: unboundedBlack,
          weight: 900,
          style: 'normal'
        }
      ]
    }
  )
}
