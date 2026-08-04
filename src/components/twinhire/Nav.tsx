"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Boxes, Key, LogOut, Moon, Settings, Shield, Sparkles, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { LiveDot } from "./primitives";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ViewKey = "hero" | "dashboard" | "simulate" | "evidence";

const NAV_ITEMS: { key: ViewKey; label: string; n: string }[] = [
  { key: "hero", label: "Overview", n: "00" },
  { key: "dashboard", label: "Twin Network", n: "01" },
  { key: "simulate", label: "Work Simulation", n: "02" },
  { key: "evidence", label: "Evidence & Hiring", n: "03" },
];

export function Nav({
  view,
  onNavigate,
  hasSession,
  isAuthenticated,
  isAdmin,
  onAuthClick,
  onSignOut,
  onAdminClick,
  onSettingsClick,
  adminMode,
  userEmail,
}: {
  view: ViewKey;
  onNavigate: (v: ViewKey) => void;
  hasSession: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onAuthClick: () => void;
  onSignOut: () => void;
  onAdminClick: () => void;
  onSettingsClick: () => void;
  adminMode: boolean;
  userEmail?: string | null;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("th-theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass border-b border-border/60" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          onClick={() => onNavigate("hero")}
          className="group flex items-center gap-2.5"
          aria-label="TwinHire home"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-foreground text-background">
            <Boxes className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[oklch(0.74_0.135_70)] ring-2 ring-background" />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="font-display text-lg tracking-tight">TwinHire</span>
            <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <LiveDot className="h-1.5 w-1.5" /> Talent Intelligence
            </span>
          </span>
        </button>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = view === item.key;
            const disabled = (item.key === "evidence" || item.key === "simulate") && !hasSession && item.key !== view;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                disabled={disabled && item.key !== view}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  disabled && "opacity-40",
                )}
              >
                <span className="mr-1.5 font-mono text-[10px] text-muted-foreground/70">{item.n}</span>
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg bg-secondary"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9"
          >
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </Button>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button
                  size="sm"
                  variant={adminMode ? "default" : "outline"}
                  onClick={onAdminClick}
                  className="h-9 gap-1.5 rounded-full"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-2.5 py-1.5 text-sm transition-colors hover:border-foreground/20">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {userEmail?.charAt(0).toUpperCase() ?? "U"}
                    </span>
                    <span className="hidden max-w-[120px] truncate sm:inline">{userEmail}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userEmail}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {isAdmin ? "Admin" : "Candidate"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                    <Key className="mr-2 h-4 w-4" />
                    API keys
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-rose-600 focus:text-rose-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              size="sm"
              onClick={onAuthClick}
              className="h-9 gap-1.5 rounded-full"
            >
              <User className="h-3.5 w-3.5" />
              Sign in
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="border-t border-border/50 px-4 py-2 md:hidden">
        <div className="flex items-center gap-1 overflow-x-auto scroll-slim">
          {NAV_ITEMS.map((item) => {
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
