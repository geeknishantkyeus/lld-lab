import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-background-alt">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-text mb-6 leading-tight">
          Practice LLD. <br />
          <span className="text-primary">Get Feedback.</span> Improve.
        </h1>
        <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
          A focused practice platform for Low-Level Design. Submit solutions, 
          get deterministic + AI feedback, and track your improvement over time.
        </p>
        <Link
          to="/problems"
          className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition shadow-button"
        >
          Start Practicing →
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/30 to-transparent pointer-events-none"></div>
        <div className="relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              WHY LLD LAB
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-4">
              Everything you need to <span className="text-primary">master LLD</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Built for engineers who want to practice, get feedback, and actually improve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 - Problem Library */}
            <div className="group relative bg-white p-8 rounded-3xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-text mb-3">
                  Problem Library
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Practice Parking Lot, Elevator System, Vending Machine — the most common LLD interview problems.
                </p>
                <div className="flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore Problems <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            {/* Card 2 - Hybrid Feedback */}
            <div className="group relative bg-white p-8 rounded-3xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-text mb-3">
                  Hybrid Feedback
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Deterministic checks (class names, methods) + AI feedback (SRP, SOLID, coupling, extensibility).
                </p>
                <div className="flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  See How It Works <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            {/* Card 3 - Track Progress */}
            <div className="group relative bg-white p-8 rounded-3xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-text mb-3">
                  Track Progress
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Compare attempts, track recurring mistakes, and see your improvement over time.
                </p>
                <div className="flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Dashboard <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to improve your LLD skills?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Start with a problem, submit your solution, and get instant feedback.
          </p>
          <Link
            to="/problems"
            className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition shadow-button"
          >
            Browse Problems →
          </Link>
        </div>
      </section>
    </div>
  );
}
