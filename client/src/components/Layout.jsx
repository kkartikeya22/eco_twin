import { useState } from "react";
import Sidebar from "./Sidebar";
import { IconMenu, IconX } from "./icons";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-canvas">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="flex">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex-1 bg-ink/20 backdrop-blur-[1px]"
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-canvas/90 px-4 py-3 backdrop-blur md:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-2 hover:bg-hover"
          >
            {mobileOpen ? (
              <IconX className="h-5 w-5" />
            ) : (
              <IconMenu className="h-5 w-5" />
            )}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-brand text-[10px] font-bold text-white">
              E
            </span>
            <span className="text-[13.5px] font-semibold text-ink">
              EcoTwin
            </span>
          </div>
        </div>

        <main className="fade-in mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
