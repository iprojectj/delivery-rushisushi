import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPixPayment, getPaymentStatus } from "./payments.server";

export const createPix = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        valorTotal: z.number(),
        nome: z.string(),
        whatsapp: z.string(),
        cep: z.string().optional(),
        products: z.array(z.any()).optional(),
        trackingParameters: z.any().optional(),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    return createPixPayment(data);
  });

export const checkStatus = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    return getPaymentStatus(data.id);
  });
