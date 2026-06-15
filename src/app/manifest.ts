import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AAP Control Surface",
    short_name: "AAP Control",
    description: "A control surface for approvals and CLI token operations",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#eceff3",
    theme_color: "#16191d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
