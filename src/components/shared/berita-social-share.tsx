"use client";

import { useSyncExternalStore, useCallback } from "react";
import { SocialShareButtons } from "@/components/shared/social-share-buttons";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function BeritaSocialShare() {
  const isMounted = useIsMounted();

  const getUrl = useCallback(() => {
    if (!isMounted) return "";
    return window.location.href;
  }, [isMounted]);

  const getTitle = useCallback(() => {
    if (!isMounted) return "";
    return document.title;
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <SocialShareButtons
      url={getUrl()}
      title={getTitle()}
    />
  );
}
