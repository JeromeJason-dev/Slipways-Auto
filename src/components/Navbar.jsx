import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, ShieldAlert, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
];

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#0F1B2E] bg-[#0B0E1A]/90 backdrop-blur text-white">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 relative">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E4222A] text-sm font-extrabold text-white">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Slipways<span className="text-[#E4222A]">Auto</span>
            </span>
          </Link>

          {/* Centered nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-1 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-[#E4222A]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side: auth */}
          <div className="hidden sm:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                {isAdmin && (
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center gap-1 text-xs font-semibold border px-2.5 py-1 rounded-md transition-colors ${
                      location.pathname === "/dashboard"
                        ? "bg-[#E4222A]/20 text-[#E4222A] border-[#E4222A]/40"
                        : "bg-[#E4222A]/10 text-[#E4222A] border-[#E4222A]/20 hover:bg-[#E4222A]/20"
                    }`}
                  >
                    <ShieldAlert className="h-3 w-3" />
                    <span>Admin Console</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 text-sm max-w-37.5">
                  <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="truncate font-medium hidden md:inline text-slate-200">
                    {user?.name || user?.email}
                  </span>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={logout}
                  className="h-9 px-3 flex items-center gap-1.5 rounded-full shadow-lg shadow-[#E4222A]/20"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10 text-sm font-medium">
                <Link
                  to="/login"
                  className={`transition-colors ${
                    location.pathname === "/login"
                      ? "text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#E4222A] hover:bg-[#B8181F] transition-colors text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-[#E4222A]/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>
    </>
  );
}

export default Navbar;