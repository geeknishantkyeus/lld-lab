import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-bold text-text">LLD Lab</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/problems" className="text-text-secondary hover:text-primary transition font-medium">
            Problems
          </Link>
          <Link to="/history" className="text-text-secondary hover:text-primary transition font-medium">
            History
          </Link>
          <Link
            to="/problems"
            className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-dark transition shadow-button"
          >
            Start Practicing
          </Link>
        </div>
      </div>
    </nav>
  );
}
