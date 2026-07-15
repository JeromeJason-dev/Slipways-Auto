import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, ShieldAlert } from "lucide-react";
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
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex justify-between items-center p-4 text-foreground relative">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#C81E2C] text-xs font-bold text-white">
            S
          </div>
          <span className="text-2xl font-bold">Slipways Auto</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {/* Conditionally render authenticated profile layout vs guest authentication layout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-muted">
              {isAdmin && (
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center gap-1 text-xs font-semibold border px-2.5 py-1 rounded-md transition-colors ${
                    location.pathname === "/dashboard"
                      ? "bg-primary/20 text-primary border-primary/40"
                      : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  }`}
                >
                  <ShieldAlert className="h-3 w-3" />
                  <span>Admin Console</span>
                </Link>
              )}

              {/* Profile Badge Wrapper */}
              <div className="flex items-center gap-2 text-sm max-w-37.5">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary border shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <span className="truncate font-medium hidden md:inline">
                  {user?.name || user?.email}
                </span>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={logout}
                className="h-8 px-2 sm:px-3 flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-2 border-l border-muted text-sm font-medium">
              <Link
                to="/login"
                className={`transition-colors ${
                  location.pathname === "/login"
                    ? "text-primary"
                    : "text-foreground hover:text-foreground"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;