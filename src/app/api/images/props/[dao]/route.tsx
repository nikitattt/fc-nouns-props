import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { join } from 'path'
import * as fs from 'fs'
import { Proposal } from '@/utils/types'
import { parse } from 'querystring'
import { loadProposals } from '@/lib/proposals'

export const dynamic = 'force-dynamic'

const unboundedBlackPath = join(process.cwd(), 'public/Unbounded-Black.ttf')
let unboundedBlack = fs.readFileSync(unboundedBlackPath)

export async function GET(
  req: NextRequest,
  { params }: { params: { dao: string } }
) {
  console.log('begin rendering image')
  const ids = req.nextUrl.searchParams.get('ids')
  console.log('ids:', ids)

  // Check if 'ids' is present
  if (!ids) {
    return new NextResponse('No IDs provided', { status: 400 })
  }

  // Split the 'ids' string by commas to get an array of IDs
  const idArray = ids.split(',').map((id) => parseInt(id, 10))

  const proposals = await loadProposals(idArray)

  console.log(proposals)

  function Prop({ prop }: { prop: Proposal }) {
    return (
      <p
        style={{
          fontSize: 60,
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
