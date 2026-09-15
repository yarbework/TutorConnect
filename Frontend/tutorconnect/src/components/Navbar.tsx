'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  Menu, 
  X, 
  GraduationCap, 
  UserCheck,
  PlusCircle,
  Briefcase,
  Coins,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const isTutor = user?.role === 'TUTOR';
  const isGuardian = user?.role === 'GUARDIAN';
  const dashboardHref = isTutor ? '/tutor/dashboard' : '/guardian/dashboard';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-900 tracking-tight flex items-center gap-1">
              Tutor<span className="text-emerald-600">Connect</span>
            </Link>
          </div>

          {/* Centered Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 px-8 gap-7">
            {isMounted && isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className={`text-sm font-medium transition flex items-center gap-1.5 ${
                    pathname.includes('/dashboard')
                      ? 'text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {isTutor && (
                  <>
                    <Link
                      href="/tutor/jobs"
                      className={`text-sm font-medium transition flex items-center gap-1.5 ${
                        pathname.startsWith('/tutor/jobs')
                          ? 'text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      Find Jobs
                    </Link>
                    <Link
                      href="/tutor/applications"
                      className={`text-sm font-medium transition flex items-center gap-1.5 ${
                        pathname.startsWith('/tutor/applications')
                          ? 'text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      My Proposals
                    </Link>
                    <Link
                      href="/tutor/profile"
                      className={`text-sm font-medium transition flex items-center gap-1.5 ${
                        pathname === '/tutor/profile'
                          ? 'text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                  </>
                )}

                {isGuardian && (
                  <>
                    <Link
                      href="/tutors"
                      className={`text-sm font-medium transition ${
                        pathname.startsWith('/tutors')
                          ? 'text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Browse Tutors
                    </Link>
                    <Link
                      href="/guardian/jobs"
                      className={`text-sm font-medium transition ${
                        pathname === '/guardian/jobs'
                          ? 'text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      My Job Posts
                    </Link>
                    <Link
                      href="/guardian/jobs/new"
                      className="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Post a Job
                    </Link>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center gap-7">
                <Link 
                  href="/#how-it-works" 
                  className="text-sm font-medium text-slate-600 hover:text-blue-700 transition"
                >
                  How it Works
                </Link>
                <Link 
                  href="/#features" 
                  className="text-sm font-medium text-slate-600 hover:text-blue-700 transition"
                >
                  Features
                </Link>
                <Link 
                  href="/#pricing" 
                  className="text-sm font-medium text-slate-600 hover:text-blue-700 transition"
                >
                  Connects Pricing
                </Link>
                <Link 
                  href="/tutors" 
                  className="text-sm font-medium text-slate-600 hover:text-blue-700 transition"
                >
                  Browse Tutors
                </Link>
              </div>
            )}
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {isMounted && isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/messages"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Messages
                </Link>

                <Link
                  href="/wallet"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
                >
                  <Coins className="w-4 h-4 text-amber-500" />
                  Wallet
                </Link>

                <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                  <div className={`p-1.5 rounded-lg ${isTutor ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {isTutor ? <UserCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs font-medium text-slate-900 max-w-[140px] truncate">
                      {user?.email}
                    </p>
                    <p className="text-[11px] text-slate-400 capitalize font-normal">
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer min-h-[36px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 font-sans animate-in slide-in-from-top-2 duration-200">
          {isMounted && isAuthenticated ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isTutor ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {isTutor ? <UserCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 truncate max-w-[180px]">{user?.email}</p>
                    <p className="text-[11px] text-slate-400 capitalize font-normal">{user?.role?.toLowerCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-600 hover:text-blue-700">
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <Link href="/wallet" onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-600 hover:text-amber-600">
                    <Coins className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <nav className="flex flex-col space-y-1">
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-700" /> Dashboard
                </Link>

                {isTutor && (
                  <>
                    <Link
                      href="/tutor/jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-blue-700" /> Find Jobs
                    </Link>
                    <Link
                      href="/tutor/applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-blue-700" /> My Proposals
                    </Link>
                  </>
                )}

                {isGuardian && (
                  <>
                    <Link
                      href="/tutors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Browse Tutors
                    </Link>
                    <Link
                      href="/guardian/jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      My Job Posts
                    </Link>
                    <Link
                      href="/guardian/jobs/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" /> Post a Job
                    </Link>
                  </>
                )}
              </nav>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                How it Works
              </Link>
              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Connects Pricing
              </Link>
              <Link
                href="/tutors"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Browse Tutors
              </Link>
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-slate-700 bg-slate-50 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-white bg-blue-700 rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}