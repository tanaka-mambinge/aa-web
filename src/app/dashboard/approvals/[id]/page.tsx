"use client";

import { useParams } from "next/navigation";

import ApprovalDetailDialog from "@/components/approval-detail-dialog";

export default function ApprovalDetailPage() {
  const params = useParams<{ id: string }>();
  const approvalId = params.id;

  return <ApprovalDetailDialog approvalId={approvalId} closeHref="/dashboard" />;
}
