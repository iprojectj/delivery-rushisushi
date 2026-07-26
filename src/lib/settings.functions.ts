import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getActiveGateway = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("app_settings")
      .select("value")
      .eq("key", "active_gateway")
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching active gateway:", error);
      return "paradise";
    }
    
    let value = data?.value;
    // value is JSONB, if it was stored as "paradise" it might be just that string
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        // ignore
      }
    }
    
    return (value as string) || "paradise";
  });

export const setActiveGateway = createServerFn({ method: "POST" })
  .handler(async ({ data: gateway }: { data: string }) => {
    // Basic validation
    if (!["paradise", "nexus"].includes(gateway)) {
      throw new Error("Gateway inválido");
    }

    const { error } = await supabaseAdmin
      .from("app_settings")
      .upsert({ key: "active_gateway", value: JSON.stringify(gateway) });

    if (error) {
      console.error("Error setting active gateway:", error);
      throw error;
    }

    return { success: true, gateway };
  });
