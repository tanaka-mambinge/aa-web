import { NextResponse } from "next/server";

import { getBackendUrl } from "@/lib/api";

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  const requestUrl = new URL(request.url);
  const backendUrl = new URL(`/api/v1/auth/social/${provider}/callback`, getBackendUrl());
  backendUrl.search = requestUrl.search;

  const backendResponse = await fetch(backendUrl, {
    method: "GET",
    headers: {
      accept: request.headers.get("accept") ?? "*/*",
    },
    cache: "no-store",
    redirect: "manual",
  });

  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
  });

  const setCookie = backendResponse.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  const location = backendResponse.headers.get("location");
  if (location) {
    response.headers.set("location", location);
  }

  const contentType = backendResponse.headers.get("content-type");
  if (contentType) {
    response.headers.set("content-type", contentType);
  }

  return response;
}
