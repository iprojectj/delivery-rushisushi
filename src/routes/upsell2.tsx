import { createFileRoute } from "@tanstack/react-router";
import upsell2Html from "../../public/upsell2.html?raw";

export const Route = createFileRoute("/upsell2")({
  server: {
    handlers: {
      GET: async () =>
        new Response(upsell2Html, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
