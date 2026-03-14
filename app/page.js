import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center py-6 px-8 bg-white shadow-sm">
        <div className="text-2xl font-bold tracking-tight text-blue-700">Aarohan 2026</div>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 font-medium hover:text-blue-600 transition">
            Login
          </Link>
          <Link href="/register" className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-blue-700 transition shadow-md">
            Register Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-6">
          The Annual Technical Festival
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
          Innovate. Create. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Elevate.</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-10">
          Join the brightest minds from across the country for three days of intense competitions, groundbreaking workshops, and inspiring tech talks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 hover:shadow-lg transition transform hover:-translate-y-1">
            Join as a Participant
          </Link>
          <Link href="/events" className="bg-white text-blue-700 border border-gray-200 font-semibold py-3 px-8 rounded-full hover:bg-gray-50 hover:shadow transition transform hover:-translate-y-1">
            Browse Events
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-24 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4 font-bold">🚀</div>
            <h3 className="text-xl font-bold mb-2">Hackathons</h3>
            <p className="text-gray-600">Build incredible software in 24 hours and win exciting prizes.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4 font-bold">🤖</div>
            <h3 className="text-xl font-bold mb-2">Robotics</h3>
            <p className="text-gray-600">Showcase your engineering skills in the ultimate robot combat arena.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4 font-bold">💡</div>
            <h3 className="text-xl font-bold mb-2">Workshops</h3>
            <p className="text-gray-600">Learn directly from industry experts in hands-on technical sessions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
