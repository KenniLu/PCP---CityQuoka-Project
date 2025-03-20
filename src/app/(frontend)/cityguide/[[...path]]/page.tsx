import { Metadata } from 'next';

export async function generateMetadata({params}: {params:{path?: string[]}}): Promise<Metadata> {
  const { path }  = await params
  const paths = (path || ['city-guide']).map(str => str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  )
  return {
    title: `City Quokka | ${paths.join(' | ')}`,
    description: `City Quokka - Explore more about ${paths.join(', ')}`
  }
}

export default async function CityGuidePage({ params }: { params: { path?: string[] } }) {

  const { path }  = await params
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">City Guide Explorer</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current Path:</h2>
        <pre className="bg-white p-3 rounded border overflow-x-auto">
          {JSON.stringify(path, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Path Segments:</h3>
        <ul className="list-disc pl-5">
          {(path||['Root']).map((segment, index) => (
            <li key={index} className="mb-1">
              {segment}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
