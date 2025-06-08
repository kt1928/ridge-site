export default function Project2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Project 2</h1>
        <p className="text-xl text-gray-300 mb-8">
          This is the second project page. You can customize this with your actual project content.
        </p>
        <a
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Back to Portal
        </a>
      </div>
    </div>
  )
}
