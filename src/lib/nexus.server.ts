// Nexus Gateway helpers. Docs: https://nexuspag.com/docs

export const NEXUS_API_BASE_URL = "https://api.nexuspag.com/v1";

export function getNexusHeaders() {
  const apiKey = process.env.NEXUS_API_KEY || "sk_live_..."; // User will need to provide or I'll use a placeholder for now
  return {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
}

export function limparNomeProduto(nome: string): string {
  let limpo = nome.replace(/^combo\s*/i, "");
  limpo = limpo.replace(/\s*\([^)]*\)/g, "");
  return limpo.trim();
}
