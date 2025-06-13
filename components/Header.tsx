import NotificationCenter from '@/components/NotificationCenter';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-slate-700 py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 w-10 h-10 rounded-lg"></div>
            <h1 className="text-2xl font-bold">TradePilot</h1>
          </Link>
          
          <nav className="hidden md:block ml-10">
            <ul className="flex space-x-6">
              <li>
                <Link href={"/dashboard"} className="hover:text-white transition-colors">
                  Gösterge Paneli
                </Link>
              </li>
              <li>
                <Link href={"/trading"} className="hover:text-white transition-colors">
                  Ticaret
                </Link>
              </li>
              <li>
                <Link href={"/portfolio"} className="hover:text-white transition-colors">
                  Portföy
                </Link>
              </li>
              <li>
                <Link href={"/strategies"} className="hover:text-white transition-colors">
                  Stratejiler
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationCenter />
          <Link href="/login" className="text-slate-200 hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-lg font-bold">P</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}