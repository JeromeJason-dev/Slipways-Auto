import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, ShieldAlert, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
];

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Appointments is a self-service page tied to a signed-in user's
  // bookings, so only show the link once someone is authenticated.
  const links = 
  isAuthenticated && !isAdmin
    ? [...navLinks, { to: "/appointments", label: "Appointments" }]
    : navLinks;

  // Close the mobile menu whenever the route changes (e.g. a link was
  // tapped), so it never stays open over the next page.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Prevent background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#0F1B2E] bg-[#0B0E1A]/90 backdrop-blur text-white">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 relative">
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E4222A] text-sm font-extrabold text-white">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Slipways<span className="text-[#E4222A]">Auto</span>
            </span>
          </Link>

          {/* Centered nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            {links.map((link) => {
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
            className="md:hidden text-white p-1"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu panel */}
        <div
          id="mobile-nav-panel"
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ease-out border-t border-white/10 ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-0"
          }`}
        >
          <div className="px-5 sm:px-8 py-4 flex flex-col gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && isAdmin && (
              <Link
                to="/dashboard"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  location.pathname === "/dashboard"
                    ? "bg-[#E4222A]/20 text-[#E4222A]"
                    : "text-[#E4222A] hover:bg-[#E4222A]/10"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Admin Console
              </Link>
            )}

            <div className="mt-2 pt-3 border-t border-white/10">
              {isAuthenticated ? (
                <div className="flex items-center justify-between gap-3 px-3">
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="truncate font-medium text-slate-200">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={logout}
                    className="h-9 px-3 flex items-center gap-1.5 rounded-full shrink-0"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-3">
                  <Link
                    to="/login"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/login"
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#E4222A] hover:bg-[#B8181F] transition-colors text-white px-5 py-2.5 rounded-full text-sm font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop to close the menu on outside tap, and to dim the page
          behind it — sits below the header (z-40 < header's z-50). */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Navbar;