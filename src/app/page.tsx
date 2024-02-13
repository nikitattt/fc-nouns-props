import { Metadata } from 'next'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col text-center p-8 lg:p-16">
      <div className="flex flex-col">
        <p className="font-black text-purple-400">Farcaster Frame</p>
        <h1 className="mt-12 lg:mt-16 text-6xl font-bold">DAO Proposals</h1>
        <p className="mt-12 max-w-lg mx-auto">
          Showing DAO proposals in Farcaster frame.
        </p>
        <div className="mt-12">
          <p className="max-w-lg mx-auto">
            Open specific DAO page to get started:
          </p>
          <Link href="/nouns">
            <div className="px-4 py-2 mt-4 w-max mx-auto bg-gray-900 rounded-lg">
              <p className="font-mono text-sm text-purple-400">/nouns</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
