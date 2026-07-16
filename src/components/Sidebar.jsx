import { Wrench } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { NAV } from "../utils/constants";

export function Sidebar({ derived, resetData }) {
  return (
    <aside className="w-56 min-w-56 bg-slate-950 flex flex-col h-screen overflow-y-auto">
      <div className="p-5 pb-4 border-b border-white/5 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white shadow-sm">
          <Wrench size={16} />
        </div>
        <div>
          <Link to="/home">
            <div className="text-lg font-semibold text-white tracking-wide">
              Slipways Auto
            </div>
          </Link>
          <div className="text-[10px] color text-slate-500">
            Benson's garage· Nairobi
          </div>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex-1 mt-2">
        {["Main", "Shop"].map((section) => (
          <div key={section} className="mb-4">
            <div className="text-[10px] font-semibold tracking-wider text-slate-600 px-4 py-1.5 uppercase">
              {section}
            </div>
            <div role="tablist" aria-orientation="vertical" className="flex flex-col">
              {NAV.filter((n) => n.section === section).map((n) => {
                const Icon = n.icon;
                const badge =
                  n.id === "workorders"
                    ? derived.open.length
                    : n.id === "inventory"
                      ? derived.lowStock.length
                      : null;
                // "dashboard" lives at the index route, everything else nests under it
                const to = n.id === "dashboard" ? "/dashboard" : `/dashboard/${n.id}`;

                return (
                  <NavLink
                    key={n.id}
                    to={to}
                    end={n.id === "dashboard"} // don't match sub-routes for the index link
                    role="tab"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all border-l-2 ${
                        isActive
                          ? "text-white bg-orange-500/10 border-red-500 font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={14} className={isActive ? "text-red-500" : "text-slate-400"} />
                        <span className="flex-1">{n.label}</span>
                        {!!badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white bg-red-500">
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3">
        <button
          className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 rounded-lg w-full transition-colors group text-left"
          onClick={resetData}
          title="Reset demo data"
        >
          <div className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-semibold">
            MO
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
              Benson Mwangi
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Shop Owner · reset data
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}