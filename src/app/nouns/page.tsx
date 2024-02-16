import { loadProposals } from '@/lib/proposals'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  // TODO: action when more than 3 props
  // const proposals = (await loadProposals('nouns')).slice(0, 3)

  // TODO: enable prop load in the frame after farcaster updates

  // const numProposals = proposals.length

  const propLinks: any[] = []
  // const ids = []

  // for (let i = 0; i < numProposals; i++) {
  //   const proposal = proposals[i]
  //   const buttonId = i + 1
  //   const propId = proposal.id
  //   const url = `https://nouns.wtf/vote/${propId}`

  //   ids.push(propId)

  //   propLinks.push({
  //     [`fc:frame:button:${buttonId}`]: `Prop #${propId}`,
  //     [`fc:frame:button:${buttonId}:action`]: 'link',
  //     [`fc:frame:button:${buttonId}:target`]: url
  //   })
  // }

  propLinks.push({
    [`fc:frame:button:1`]: `⌐◨-◨`
  })

  const imageUrl = `${process.env.HOST}/intro.jpg`
  const postUrl = `${process.env.HOST}/api/props/nouns`

  const otherMetadata = {
    'fc:frame': 'vNext',
    'fc:frame:image': imageUrl,
    'fc:frame:post_url': postUrl
  }

  propLinks.forEach((link) => {
    Object.assign(otherMetadata, link)
  })

  return {
    title: 'Nouns DAO Proposals',
    description:
      'Showing Nouns DAO proposals in Farcaster frame to keep everyone in the loop',
    openGraph: {
      title: 'Nouns DAO Proposals',
      images: [imageUrl]
    },
    other: otherMetadata
  }
}

export default function Home() {
  return (
    <main className="flex flex-col text-center p-8 lg:p-16">
      <div className="flex flex-col">
        <p className="font-black text-purple-400">Farcaster Frame</p>
        <h1 className="mt-12 lg:mt-16 text-6xl font-bold">
          Nouns DAO Proposals
        </h1>
        <p className="mt-12 max-w-lg mx-auto">
          Showing Nouns DAO proposals in Farcaster frame to keep everyone in the
          loop.
        </p>
        <div className="mt-12">
          <p className="max-w-lg mx-auto">Post this link in fc feed:</p>
          <div className="px-4 py-2 mt-4 w-max mx-auto bg-gray-900 rounded-lg">
            <p className="font-mono text-sm text-purple-400">
              {process.env.HOST}/nouns
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
