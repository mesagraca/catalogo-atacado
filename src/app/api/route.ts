import { NextResponse } from "next/server";
import { FEATURED_PRODUCTS, CATEGORIES } from "@/types/catalog";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const format = url.searchParams.get("format");
  const acceptHeader = request.headers.get("accept") ?? "";

  const totalProducts = FEATURED_PRODUCTS.length;
  const pendingCount = FEATURED_PRODUCTS.filter((p) => p.tray_id == null).length;
  const syncedCount = FEATURED_PRODUCTS.filter((p) => p.tray_id != null).length;

  const routes = {
    overview: {
      title: "Mesa & Graça — API do Catálogo (Sitemap & Rotas)",
      total_products: totalProducts,
      pending_tray: pendingCount,
      synced_tray: syncedCount,
      version: "1.0.0",
    },
    endpoints: [
      {
        group: "Lote Geral",
        items: [
          {
            name: "Todos os Produtos (Catálogo Completo)",
            url: `${baseUrl}/api/produtos`,
            description: "Lista canônica com todos os 70 produtos e suas variações",
            method: "GET",
          },
          {
            name: "Paginação (10 primeiros itens)",
            url: `${baseUrl}/api/produtos?limit=10&offset=0`,
            description: "Exemplo com paginação controlada via query params",
            method: "GET",
          },
        ],
      },
      {
        group: "Filtros por Status Tray",
        items: [
          {
            name: "Pendentes de Envio à Tray",
            url: `${baseUrl}/api/produtos?status=pendente_tray`,
            description: `Produtos sem tray_product_id vinculado (${pendingCount} itens prontos para POST /products)`,
            method: "GET",
          },
          {
            name: "Já Vinculados na Tray",
            url: `${baseUrl}/api/produtos?status=vinculado_tray`,
            description: `Produtos já cadastrados com tray_product_id existente (${syncedCount} itens para PUT /products)`,
            method: "GET",
          },
        ],
      },
      {
        group: "Filtros por Categoria",
        items: [
          {
            name: "Categoria: Jogos",
            url: `${baseUrl}/api/produtos?categoria=Jogos`,
            description: "Jogos completos com somatório de preços e especificações de itens",
            method: "GET",
          },
          {
            name: "Categoria: Lugar Americano",
            url: `${baseUrl}/api/produtos?categoria=Lugar+Americano`,
            description: "Lugares americanos avulsos, estampas dupla face e coleções especiais",
            method: "GET",
          },
          {
            name: "Categoria: Porta-guardanapos",
            url: `${baseUrl}/api/produtos?categoria=Porta-guardanapos`,
            description: "Porta-guardanapos com NCM metálico (73239300)",
            method: "GET",
          },
        ],
      },
      {
        group: "Filtros Combinados",
        items: [
          {
            name: "Pendentes Tray + Categoria Jogos",
            url: `${baseUrl}/api/produtos?status=pendente_tray&categoria=Jogos`,
            description: "Filtro com múltiplos critérios simultâneos",
            method: "GET",
          },
          {
            name: "Pendentes Tray + Categoria Lugar Americano",
            url: `${baseUrl}/api/produtos?status=pendente_tray&categoria=Lugar+Americano`,
            description: "Filtro combinado de status e categoria",
            method: "GET",
          },
        ],
      },
      {
        group: "Exemplos Canônicos Individuais",
        items: [
          {
            name: "Lugar Americano Redondo Xadrez (12 variantes)",
            url: `${baseUrl}/api/produtos/lugar-americano-redondo-xadrez`,
            description: "Produto com grade de 12 variantes de cor/estampa e estoque zero seguro",
            method: "GET",
          },
          {
            name: "Kit Feijoada (Jogo com Composição)",
            url: `${baseUrl}/api/produtos/kit-feijoada`,
            description: "Jogo completo com cálculo automático de preço por atacado agregado",
            method: "GET",
          },
          {
            name: "Porta-guardanapo Lírio Provence",
            url: `${baseUrl}/api/produtos/porta-guardanapo-lirio-provence`,
            description: "Item avulso metálico com tributação NCM 73239300",
            method: "GET",
          },
          {
            name: "Coleção Natal Majestosa Vinho",
            url: `${baseUrl}/api/produtos/lugar-americano-natal-majestosa-vinho`,
            description: "Produto de coleção sazonal com metadados de Natal",
            method: "GET",
          },
        ],
      },
    ],
  };

  // Se o cliente solicitar JSON explicitamente via header ou query param
  if (format === "json" || (!acceptHeader.includes("text/html") && acceptHeader.includes("application/json"))) {
    return NextResponse.json(routes, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  // Renderiza HTML simples e limpo (Sitemap) para navegadores
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mesa &amp; Graça — API Sitemap</title>
  <style>
    :root {
      --bg: #FBF9F5;
      --card-bg: #FFFFFF;
      --text: #2C2623;
      --text-muted: #736B63;
      --accent: #B45309;
      --accent-light: #FEF3C7;
      --border: #E8E2D9;
      --tag-bg: #F3ECE2;
      --tag-text: #6B4E2E;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 32px 16px;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    h1 {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 12px;
    }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      background: var(--tag-bg);
      color: var(--tag-text);
    }
    .badge-accent {
      background: var(--accent-light);
      color: var(--accent);
    }
    .json-toggle {
      float: right;
      font-size: 0.85rem;
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
      padding: 4px 10px;
      border: 1px solid var(--accent);
      border-radius: 6px;
      transition: all 0.2s;
    }
    .json-toggle:hover {
      background: var(--accent);
      color: #fff;
    }
    .group {
      margin-top: 28px;
    }
    .group-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: transform 0.15s, border-color 0.15s;
    }
    .card:hover {
      border-color: var(--accent);
      transform: translateY(-1px);
    }
    .card-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .link {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--accent);
      text-decoration: none;
      word-break: break-all;
    }
    .link:hover {
      text-decoration: underline;
    }
    .card-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .url-preview {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.78rem;
      color: #64748B;
      background: #F1F5F9;
      padding: 2px 6px;
      border-radius: 4px;
      width: fit-content;
      word-break: break-all;
    }
    footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <a class="json-toggle" href="/api?format=json" target="_blank">Ver JSON Puro &rarr;</a>
      <h1>Mesa &amp; Graça — API Sitemap</h1>
      <p class="subtitle">Guia de navegação direta para rotas, filtros e integração do catálogo com a Tray e marketplaces.</p>
      <div class="stats">
        <span class="badge">📦 ${totalProducts} Produtos</span>
        <span class="badge badge-accent">⚡ ${pendingCount} Pendentes Tray</span>
        <span class="badge">✅ ${syncedCount} Vinculados Tray</span>
        <span class="badge">🏷️ 3 Categorias</span>
      </div>
    </header>

    <main>
      ${routes.endpoints
        .map(
          (group) => `
        <section class="group">
          <h2 class="group-title">${group.group}</h2>
          <div class="card-list">
            ${group.items
              .map(
                (item) => `
              <div class="card">
                <div class="card-header">
                  <a class="link" href="${item.url}" target="_blank">${item.name} &rarr;</a>
                  <span class="url-preview">${item.url.replace(baseUrl, "")}</span>
                </div>
                <div class="card-desc">${item.description}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </section>
      `,
        )
        .join("")}
    </main>

    <footer>
      Mesa &amp; Graça &bull; Catálogo Atacado &bull; API v1.0.0 &bull; Imagens otimizadas Tray JPEG &lt; 350 KB &bull; Estoque seguro zero inventado
    </footer>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
