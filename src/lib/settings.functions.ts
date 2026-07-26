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
    
    return (data?.value as string) || "paradise";
  });

export const setActiveGateway = createServerFn({ method: "POST" })
  .input(z.string())
  .handler(async ({ data: gateway }) => {
    // Basic validation
    if (!["paradise", "nexus"].includes(gateway)) {
      throw new Error("Gateway inválido");
    }

    const { error } = await supabaseAdmin
      .from("app_settings")
      .upsert({ key: "active_gateway", value: gateway });

    if (error) {
      console.error("Error setting active gateway:", error);
      throw error;
    }

    return { success: true, gateway };
  });
