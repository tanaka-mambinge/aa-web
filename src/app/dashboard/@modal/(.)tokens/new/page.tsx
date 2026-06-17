"use client";

import CreateTokenDialog from "@/components/create-token-dialog";
import { useCliTokens } from "@/hooks/use-cli-tokens";

export default function NewTokenModalPage() {
  const { mutate } = useCliTokens();

  return <CreateTokenDialog closeHref="/dashboard/tokens" onCreated={mutate} />;
}
