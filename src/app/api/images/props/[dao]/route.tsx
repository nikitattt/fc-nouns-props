import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { join } from 'path'
import * as fs from 'fs'
import { Proposal } from '@/utils/types'
import { loadProposals } from '@/lib/proposals'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

export const revalidate = 900

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

const unboundedBlackPath = join(process.cwd(), 'public/Unbounded-Black.ttf')
let unboundedBlack = fs.readFileSync(unboundedBlackPath)

const unboundedBoldPath = join(process.cwd(), 'public/Unbounded-Bold.ttf')
let unboundedBold = fs.readFileSync(unboundedBoldPath)

const unboundedRegularPath = join(process.cwd(), 'public/Unbounded-Regular.ttf')
let unboundedRegular = fs.readFileSync(unboundedRegularPath)

export async function GET(
  req: NextRequest,
  { params }: { params: { dao: string } }
) {
  const dao = params.dao
  const ids = req.nextUrl.searchParams.get('ids')

  if (dao !== 'nouns' && !dao.includes('builder')) {
    console.log('Unsupported DAO')
    return new NextResponse('Unsupported DAO', { status: 400 })
  }

  let idArray = []

  if (ids) {
    idArray = ids.split(',').map((id) => parseInt(id, 10))
  }

  // console.log('loading props for image')

  const proposals = (await loadProposals(dao, [])).slice(0, 4)
  // TODO: get builder name from call
  const daoName = dao === 'nouns' ? 'Nouns' : 'Builder L1'

  // console.log(proposals)

  function Prop({ prop }: { prop: Proposal }) {
    const timestamp = dayjs().to(dayjs(prop.endTime), true)

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '34px',
          width: '100%',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          fontWeight: 'normal'
        }}
      >
        <span
          style={{
            // fontWeight: 'bold',
            fontSize: 52,
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '6px'
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
            fontSize: 36
          }}
        >
          <span
            style={{
              color: '#00E37C',
              border: '4px solid #00E37C80',
              padding: '8px 16px',
              borderRadius: '28px'
            }}
          >
            {prop.state}
          </span>
          <span
            style={{
              color: '#A7A7A7',
              border: '4px solid #A7A7A780',
              padding: '8px 16px',
              borderRadius: '28px'
            }}
          >
            Ends in {timestamp}
          </span>
          <span
            style={{
              color: '#00E37C',
              border: '4px solid #00E37C80',
              padding: '8px 16px',
              borderRadius: '28px'
            }}
          >
            {prop.votes?.yes}
          </span>
          <span
            style={{
              color: '#A7A7A7',
              border: '4px solid #A7A7A780',
              padding: '8px 16px',
              borderRadius: '28px'
            }}
          >
            {prop.votes?.abstain}
          </span>
          <span
            style={{
              color: '#FF1A0B',
              border: '4px solid #FF1A0B80',
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

  let response

  if (proposals.length === 0) {
    response = new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Align items to the start of the container
            justifyContent: 'flex-start', // Align items to the start of the main axis
            width: '100%',
            height: '100vh',
            background: '#FFFFFF',
            padding: '52px', // Add padding to ensure content does not touch the edges
            boxSizing: 'border-box' // Include padding in width and height calculations
          }}
        >
          <p
            style={{
              fontSize: 99
            }}
          >
            No active proposals in {daoName} DAO
          </p>
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
  } else {
    response = new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Align items to the start of the container
            justifyContent: 'flex-start', // Align items to the start of the main axis
            width: '100%',
            height: '100vh',
            background: '#FFFFFF',
            padding: '52px', // Add padding to ensure content does not touch the edges
            boxSizing: 'border-box' // Include padding in width and height calculations
          }}
        >
          {proposals.map((prop, i) => (
            <Prop key={i} prop={prop} />
          ))}
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
          },
          {
            name: 'Unbounded',
            data: unboundedBold,
            weight: 700,
            style: 'normal'
          },
          {
            name: 'Unbounded',
            data: unboundedRegular,
            weight: 400,
            style: 'normal'
          }
        ]
      }
    )
  }

  response.headers.set('Cache-Control', 'max-age=900, stale-while-revalidate')

  return response
}
