import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = `${process.env.HOST}/intro.jpg`
  const postUrl = `${process.env.HOST}/api/save`

  return {
    title: 'Upload image to IPFS',
    description: 'Get some image saved to IPFS right on Farcaster',
    openGraph: {
      title: 'Upload image to IPFS',
      images: [imageUrl]
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': imageUrl,
      'fc:frame:post_url': postUrl,
      'fc:frame:input:text': 'URL of the image to save',
      'fc:frame:button:1': 'Save to IPFS'
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
          Post this link to Farcaster, so anyone can easily upload image to IPFS
          right from the app.
        </p>
        <div className="bg-gray-900 rounded-lg px-4 py-2 mt-12 w-max mx-auto">
          <p className="font-mono text-sm">
            Frame accepts images only via URL!
          </p>
        </div>
      </div>
    </main>
  )
}
