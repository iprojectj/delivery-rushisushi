// Nexus Gateway helpers. Docs: https://nexuspag.com/docs

export const NEXUS_API_BASE_URL = "https://api.nexuspag.com/v1";

export function getNexusHeaders() {
  const apiKey = process.env.NEXUS_API_KEY || "sk_live_85c35aae9e766226aecba7fad68915d9dd5589f2c9f3f06f";
  const accountId = "019f2446-2414-7bed-88ef-9c55d40485df";
  
  return {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Account-Id": accountId
  };
}

export function limparNomeProdutoNexus(nome: string): string {
  let limpo = nome.replace(/^combo\s*/i, "");
  limpo = limpo.replace(/\s*\([^)]*\)/g, "");
  return limpo.trim();
}
