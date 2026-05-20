"use client";

import { useState, useEffect, useCallback } from "react";

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Simple in-memory cache so that navigating between admin pages
// does NOT trigger a redundant /api/auth/check round-trip every time.
let cachedState: AdminAuthState | null = null;
let lastChecked = 0;
const CACHE_TTL = 10_000; // 10 seconds — re-verify after this

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>(() => {
    // If we have a fresh cached result, use it immediately (no loading spinner)
    if (cachedState && Date.now() - lastChecked < CACHE_TTL) {
      return cachedState;
    }
    return { isAuthenticated: false, isLoading: true };
  });

  useEffect(() => {
    // If we already have a fresh cached result, skip the fetch entirely
    if (cachedState && Date.now() - lastChecked < CACHE_TTL) {
      return;
    }

    let cancelled = false;

    fetch("/api/auth/check")
      .then((res) => {
        if (cancelled) return;
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        if (cancelled) return;
        const result: AdminAuthState = {
          isAuthenticated: !!data.authenticated,
          isLoading: false,
        };
        cachedState = result;
        lastChecked = Date.now();
        setState(result);
      })
      .catch(() => {
        if (cancelled) return;
        const result: AdminAuthState = { isAuthenticated: false, isLoading: false };
        cachedState = result;
        lastChecked = Date.now();
        setState(result);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // proceed regardless
    }
    // Bust cache so next mount re-checks
    cachedState = { isAuthenticated: false, isLoading: false };
    lastChecked = Date.now();
    window.location.href = "/";
  }, []);

  return { ...state, logout };
}
