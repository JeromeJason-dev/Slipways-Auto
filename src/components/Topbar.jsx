import { Bell, Plus } from "lucide-react";
import { PAGE_META } from "../utils/constants";

export function Topbar({ page, saveState, openWOModal, newWOBtnRef }) {
  const meta = PAGE_META[page] || PAGE_META.dashboard;

  return (
    <div className="bg-white border-b border-slate-100 px-6 h-14 flex items-center justify-between flex-shrink-0 shadow-xs">
      <div>
        <div className="text-lg font-semibold text-slate-900">{meta.title}</div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          {meta.breadcrumb}
          {saveState !== "idle" && (
            <span className="text-teal-600 font-medium" aria-live="polite">
              · {saveState === "saving" ? "Saving…" : "Saved"}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl border border-slate-100 bg-white flex items-center justify-center relative text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors" aria-label="Notifications">
          <Bell size={15} />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
        </div>
        <button 
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors" 
          ref={newWOBtnRef} 
          onClick={openWOModal}
        >
          <Plus size={14} /> New work order
        </button>
      </div>
    </div>
  );
}