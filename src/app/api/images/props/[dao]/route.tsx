import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { join } from 'path'
import * as fs from 'fs'
import { Proposal } from '@/utils/types'
import { loadProposals } from '@/lib/proposals'
// import dayjs from 'dayjs'
// import relativeTime from 'dayjs/plugin/relativeTime'
// import updateLocale from 'dayjs/plugin/updateLocale'

// dayjs.extend(relativeTime)
// dayjs.extend(updateLocale)

// dayjs.updateLocale('en', {
//   relativeTime: {
//     future: 'in %s',
//     past: '%s ago',
//     s: '1s',
//     m: '1m',
//     mm: '%dm',
//     h: '1h',
//     hh: '%dh',
//     d: '1d',
//     dd: '%dd',
//     M: '1m',
//     MM: '%dm',
//     y: '1y',
//     yy: '%dy'
//   }
// })

export const dynamic = 'force-dynamic'
// export const revalidate = 60

const unboundedBlackPath = join(process.cwd(), 'public/Unbounded-Black.ttf')
let unboundedBlack = fs.readFileSync(unboundedBlackPath)

export async function GET(
  req: NextRequest,
  { params }: { params: { dao: string } }
) {
  const ids = req.nextUrl.searchParams.get('ids')

  // Check if 'ids' is present
  if (!ids) {
    return new NextResponse('No IDs provided', { status: 400 })
  }

  // Split the 'ids' string by commas to get an array of IDs
  const idArray = ids.split(',').map((id) => parseInt(id, 10))

  const proposals = await loadProposals(idArray)

  console.log(proposals)

  function Prop({ prop }: { prop: Proposal }) {
    // const timestamp = dayjs().to(dayjs(prop.endTime), true)
    const timestamp = '6d'
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          width: '100%',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            fontWeight: 'bold',
            fontSize: 80,
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {prop.id} • {prop.title}
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            fontSize: 42
          }}
        >
          <span
            style={{
              color: '#00E37C',
              border: '8px solid #00E37C80',
              padding: '8px 16px',
              borderRadius: '28px'
            }}
          >
            {prop.state}
          </span>
          <span
            style={{
              color: '#A7A7A7',
              border: '8px solid #A7A7A780',
              padding: '8px 16px',
              borderRadius: '28px'
            }}
          >
            Ends in {timestamp}
          </span>
          <span
            style={{
              color: '#00E37C',
              border: '8px solid #00E37C80',
              padding: '8px 16px',
              borderRadius: '28px'
            }}
          >
            {prop.votes?.yes}
          </span>
          <span
            style={{
              color: '#A7A7A7',
              border: '8px solid #A7A7A780',
              padding: '8px 16px',
              borderRadius: '28px'
            }}
          >
            {prop.votes?.abstain}
          </span>
          <span
            style={{
              color: '#FF1A0B',
              border: '8px solid #FF1A0B80',
              padding: '8px 16px',
              borderRadius: '28px'
            }}
          >
            {prop.votes?.no}
          </span>
        </div>
      </div>
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
          background: '#FFFFFF'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
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
