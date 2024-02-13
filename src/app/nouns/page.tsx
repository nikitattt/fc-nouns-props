import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = `${process.env.HOST}/intro.jpg`
  const postUrl = `${process.env.HOST}/api/props/nouns`

  return {
    title: 'Nouns DAO Proposals',
    description:
      'Showing Nouns DAO proposals in Farcaster frame to keep everyone in the loop',
    openGraph: {
      title: 'Nouns DAO Proposals',
      images: [imageUrl]
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': imageUrl,
      'fc:frame:post_url': postUrl,
      'fc:frame:button:1': 'See proposals'
    }
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
