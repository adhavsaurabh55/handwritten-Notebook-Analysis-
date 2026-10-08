import { Outlet, Link } from 'react-router-dom';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-200/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#10B981] flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
              NotebookAI
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#4F46E5] rounded-lg hover:bg-gray-50 transition-colors">
              Home
            </Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium text-[#4F46E5] bg-[#4F46E5]/10 hover:bg-[#4F46E5]/20 rounded-lg transition-colors">
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none rounded-lg hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#4F46E5] to-[#10B981] flex items-center justify-center">
              <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} NotebookAI. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-[#4F46E5] transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#4F46E5] transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#4F46E5] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;

