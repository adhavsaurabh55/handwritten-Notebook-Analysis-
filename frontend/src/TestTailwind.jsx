function TestTailwind() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:shrink-0">
            <div className="h-48 w-full md:h-full md:w-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-6xl">🎨</span>
            </div>
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Tailwind CSS
            </div>
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
              Successfully Configured!
            </h2>
            <p className="mt-2 text-gray-500">
              Tailwind CSS v3 is now working with React + Vite. This component
              uses Tailwind utility classes like <code className="text-indigo-600 bg-indigo-50 px-1 rounded">bg-white</code>,{' '}
              <code className="text-indigo-600 bg-indigo-50 px-1 rounded">rounded-xl</code>,{' '}
              <code className="text-indigo-600 bg-indigo-50 px-1 rounded">shadow-lg</code>, and more.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Ready
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🚀 Vite + React
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestTailwind;