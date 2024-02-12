import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { join } from 'path'
import * as fs from 'fs'

export const dynamic = 'force-dynamic'

const unboundedBlackPath = join(process.cwd(), 'public/Unbounded-Black.ttf')
let unboundedBlack = fs.readFileSync(unboundedBlackPath)

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const cid = searchParams.get('cid') ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex', // Use flex layout
          flexDirection: 'row', // Align items horizontally
          alignItems: 'stretch', // Stretch items to fill the container height
          width: '100%',
          height: '100vh', // Full viewport height
          backgroundImage: 'linear-gradient(0deg, #FFF493 0%, #FFFFFF 70%)'
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
          <p
            style={{
              color: '#FF3434',
              fontSize: 90,
              display: 'flex',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            {cid}
          </p>
          <p
            style={{
              color: '#FF3434',
              fontSize: 150,
              marginBottom: 12,
              display: 'flex',
              opacity: 0.5
            }}
          >
            IPFS CID
          </p>
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
