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
  Briefcase
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent hydration mismatch on persisted client state
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-black text-blue-800 tracking-tight flex items-center gap-1">
              Tutor<span className="text-emerald-600">Connect</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {isMounted && isAuthenticated ? (
                <>
                  <Link
                    href={dashboardHref}
                    className={`text-sm font-semibold transition flex items-center gap-1.5 ${
                      pathname.includes('/dashboard')
                        ? 'text-blue-700'
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
                        className={`text-sm font-semibold transition flex items-center gap-1.5 ${
                          pathname.startsWith('/tutor/jobs')
                            ? 'text-blue-700'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Briefcase className="w-4 h-4" />
                        Find Jobs
                      </Link>
                      <Link
                        href="/tutor/profile"
                        className={`text-sm font-semibold transition flex items-center gap-1.5 ${
                          pathname === '/tutor/profile'
                            ? 'text-blue-700'
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
                        className={`text-sm font-semibold transition ${
                          pathname.startsWith('/tutors')
                            ? 'text-blue-700'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Browse Tutors
                      </Link>
                      <Link
                        href="/guardian/jobs/new"
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Post a Job
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                    How it Works
                  </Link>
                  <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                    Features
                  </Link>
                  <Link href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                    Connects Pricing
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-4">
            {isMounted && isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* User Role Badge */}
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <div className={`p-1.5 rounded-lg ${isTutor ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {isTutor ? <UserCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold text-slate-900 max-w-35 truncate">
                      {user?.email}
                    </p>
                    <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500">
                      {user?.role}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer min-h-10"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition min-h-11 min-w-11 flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {isMounted && isAuthenticated ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isTutor ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {isTutor ? <UserCheck className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.email}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500">{user?.role}</p>
                </div>
              </div>

              <nav className="flex flex-col space-y-1">
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 min-h-11"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-700" /> Dashboard
                </Link>

                {isTutor && (
                  <>
                    <Link
                      href="/tutor/jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 min-h-11"
                    >
                      <Briefcase className="w-4 h-4 text-blue-700" /> Find Jobs
                    </Link>
                    <Link
                      href="/tutor/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 min-h-11"
                    >
                      <User className="w-4 h-4 text-blue-700" /> My Profile
                    </Link>
                  </>
                )}

                {isGuardian && (
                  <>
                    <Link
                      href="/tutors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 min-h-11 flex items-center"
                    >
                      Browse Tutors
                    </Link>
                    <Link
                      href="/guardian/jobs/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 min-h-11"
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
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 min-h-11"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-slate-700 bg-slate-50 rounded-xl hover:bg-slate-100 transition min-h-11 flex items-center justify-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-white bg-blue-700 rounded-xl hover:bg-blue-800 transition min-h-11 flex items-center justify-center shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}