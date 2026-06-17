"use client";

import { useState } from "react";
import { IconBan, IconKey, IconTerminal2, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import CreateTokenDialog from "@/components/create-token-dialog";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import Tooltip from "@/components/ui/tooltip";
import { useCliTokens } from "@/hooks/use-cli-tokens";
import { formatRelativeTime } from "@/lib/format";
import { apiRequest } from "@/lib/http";
import type { CliToken } from "@/lib/types";

export default function TokensPanel() {
  const [tokenToDelete, setTokenToDelete] = useState<CliToken | null>(null);
  const router = useRouter();
  const { data: tokens, isLoading: tokensLoading, mutate: mutateTokens } = useCliTokens();

  async function deleteToken(token: CliToken) {
    await mutateTokens(
      async (current) => {
        await apiRequest(`/cli-tokens/${token.id}`, { method: "DELETE" });
        return current?.filter((item) => item.id !== token.id);
      },
      {
        optimisticData: (current) => (current ?? []).filter((item) => item.id !== token.id),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      },
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Project tokens</h1>
          <p className="max-w-xl text-sm leading-7 text-ink-muted">
            Create one token per project. Set it as <code className="font-mono text-ink-muted">AA_TOKEN</code> in
            that project&apos;s environment so the AA SDK can authenticate and approvals can be
            filtered by project.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/tokens/new")}>
          <IconKey className="h-4 w-4" />
          New token
        </Button>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-raised">
            <IconTerminal2 className="h-5 w-5 text-ink-muted" stroke={1.75} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">Project tokens</p>
            <p className="text-sm text-ink-muted">Each token authenticates one project&apos;s AA SDK via <code className="font-mono">AA_TOKEN</code>.</p>
          </div>
        </div>
        <div className="mt-2 divide-y divide-border">
          {tokensLoading ? (
            <p className="py-4 text-sm text-ink-muted">Loading tokens…</p>
          ) : !tokens || tokens.length === 0 ? (
            <p className="py-4 text-sm text-ink-muted">No project tokens created yet.</p>
          ) : (
            tokens.map((token) => (
              <div key={token.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink">{token.name}</p>
                    {token.revoked_at ? <Badge tone="cancelled">revoked</Badge> : null}
                  </div>
                  <p className="font-mono text-xs text-ink-faint">{token.token_prefix}&hellip;</p>
                  <p className="text-sm text-ink-muted">
                    {token.revoked_at
                      ? `Revoked ${formatRelativeTime(token.revoked_at)}`
                      : token.last_used_at
                        ? `Last used ${formatRelativeTime(token.last_used_at)}`
                        : "Never used"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!token.revoked_at ? (
                    <Tooltip label="Revoke">
                      <Button
                        variant="soft"
                        size="icon"
                        aria-label={`Revoke ${token.name}`}
                        onClick={async () => {
                          await mutateTokens(
                            async (current) => {
                              const updated = await apiRequest<CliToken>(`/cli-tokens/${token.id}/revoke`, { method: "POST" });
                              return current?.map((item) => (item.id === updated.id ? updated : item));
                            },
                            {
                              optimisticData: (current) =>
                                (current ?? []).map((item) =>
                                  item.id === token.id ? { ...item, revoked_at: new Date().toISOString() } : item,
                                ),
                              rollbackOnError: true,
                              populateCache: true,
                              revalidate: false,
                            },
                          );
                        }}
                      >
                        <IconBan className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  ) : null}
                  <Tooltip label="Delete">
                    <Button
                      variant="soft-danger"
                      size="icon"
                      aria-label={`Delete ${token.name}`}
                      onClick={() => setTokenToDelete(token)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <CreateTokenDialog closeHref="/dashboard/tokens" onCreated={mutateTokens} />
      <ConfirmDialog
        open={Boolean(tokenToDelete)}
        onOpenChange={(open) => !open && setTokenToDelete(null)}
        title={`Delete "${tokenToDelete?.name}"?`}
        description="This permanently removes the token. Any client still using it will immediately lose access."
        confirmLabel="Delete token"
        variant="danger"
        confirmationText={tokenToDelete?.name}
        onConfirm={() => {
          if (tokenToDelete) return deleteToken(tokenToDelete);
        }}
      />
    </div>
  );
}
