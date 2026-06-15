"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Binds a modal's open state to a URL hash route (e.g. "#filters") so the
 * browser back button closes it instead of leaving the page. Use this for
 * any new modal/dialog instead of local-only `useState` open state.
 */
export function useHashModal(hash: string) {
  const target = `#${hash}`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === target);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [target]);

  const openModal = useCallback(() => {
    if (window.location.hash !== target) {
      window.location.hash = hash;
    }
  }, [hash, target]);

  const close = useCallback(() => {
    if (window.location.hash === target) {
      window.history.back();
    }
  }, [target]);

  return { open, openModal, close };
}

/**
 * Like `useHashModal`, but for dialogs whose open state is driven by external
 * state (e.g. a Zustand store or a prop) rather than owned by this hook.
 * Keeps the URL hash in sync with `open` and calls `onClose` when the hash
 * route is left (e.g. via the back button), so the caller's state stays
 * consistent. Pass the result's `requestClose` to `Dialog.onOpenChange`.
 */
export function useHashDialog(hash: string, open: boolean, onClose: () => void) {
  const target = `#${hash}`;

  useEffect(() => {
    if (open && window.location.hash !== target) {
      window.location.hash = hash;
    } else if (!open && window.location.hash === target) {
      window.history.back();
    }
  }, [open, hash, target]);

  useEffect(() => {
    function onHashChange() {
      if (open && window.location.hash !== target) {
        onClose();
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [open, target, onClose]);

  return { requestClose: onClose };
}
