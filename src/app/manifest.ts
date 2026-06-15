import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agent Approvals",
    short_name: "AA",
    description: "A control surface for approvals and CLI token operations",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#eceff3",
    theme_color: "#16191d",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
