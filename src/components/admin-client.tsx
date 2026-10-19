"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type DragEvent } from "react";
import Link from "next/link";
import { CATEGORIES, type Category, type Product, type ProductInput, type Variation, type MaterialDetail, type GameItem } from "@/types/catalog";
import { isSupabaseReady, supabase } from "@/lib/supabase";

const PRESET_COLORS = [
  { name: "Cru / Linho", hex: "#E8DEC8" },
  { name: "Branco Neve", hex: "#FFFFFF" },
  { name: "Off-White", hex: "#F7F5EE" },
  { name: "Verde Oliva", hex: "#6E7A5A" },
  { name: "Terracota", hex: "#C46549" },
  { name: "Rosa Bebê", hex: "#F3D5D7" },
  { name: "Azul Marinho", hex: "#233348" },
  { name: "Mostarda", hex: "#D49E35" },
  { name: "Vinho Tinto", hex: "#682531" },
  { name: "Preto Ébano", hex: "#22201E" },
];

const KIT_OPTIONS = [
  { label: "Venda Avulsa (Unitário)", value: null },
  { label: "Kit com 2 peças", value: 2 },
  { label: "Kit com 4 peças", value: 4 },
  { label: "Kit com 6 peças", value: 6 },
  { label: "Kit com 8 peças", value: 8 },
  { label: "Kit com 12 peças", value: 12 },
];

const blank = (): ProductInput => ({
  name: "",
  category: "Lugar Americano",
  sku: "",
  tray_id: null,
  collection: "",
  color_name: "",
  color_hex: "#E8DEC8",
  retail_price: null,
  wholesale_price: null,
  image_url: null,
  editorial_image_url: null,
  description: "",
  materials: [],
  dimensions: [],
  kit_quantity: null,
  variations: [],
  game_items: [],
  image_status: "final",
  sort_order: 0,
  is_visible: true,
});

const money = (v: number | null) =>
  v == null
    ? "—"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(v);

/**
 * Painel Administrativo de Gestão do Catálogo Mesa & Graça.
 * 
 * @description
 * Interface completa conectada ao Supabase PostgreSQL para controle de produtos:
 * 1. Listagem pesquisável e filtrável por categoria com badges de status
 * 2. Fluxo guiado em 5 etapas para inclusão e edição abrangente de produtos
 * 3. Gerenciamento de Descrição, Venda em Kit, Materiais e Medidas dinâmicas
 * 4. Matriz de Variantes avançada com suporte a Estampas (Xadrez vs Liso) e SKUs
 * 5. Reordenação interativa de fotos com Drag & Drop e botão de troca rápida 1-Click
 * 6. Cálculo automático de margens e descontos atacado vs varejo
 * 
 * @returns {JSX.Element} Painel administrativo com controle em tempo real
 * @since v2.5.0
 * @category Admin
 */
export function AdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ProductInput>(blank());
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [pricingMode, setPricingMode] = useState<"standard" | "game_items">("standard");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [draggedTarget, setDraggedTarget] = useState<"cover" | "editorial" | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<"cover" | "editorial" | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/produtos");
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: não foi possível carregar produtos.`);
      }
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setMessage("Não foi possível carregar produtos: " + err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (filter === "Todos" || p.category === filter) &&
          `${p.name} ${p.sku || ""} ${p.color_name || ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [products, filter, search],
  );

  const change = (key: keyof ProductInput, value: any) =>
    setForm((old) => ({ ...old, [key]: value }));

  const generateAutoSku = () => {
    const prefix = form.category === "Porta-guardanapos" ? "PG" : form.category === "Jogos" ? "KT" : "LA";
    const cleanName = form.name
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4);
    const rand = Math.floor(100 + Math.random() * 900);
    change("sku", `MG-${prefix}-${cleanName || "PROD"}-${rand}`);
  };

  // Reordenação de fotos 1-Click
  const swapPhotos = () => {
    setForm((old) => ({
      ...old,
      image_url: old.editorial_image_url ?? null,
      editorial_image_url: old.image_url ?? null,
    }));
  };

  // Handlers de Drag and Drop para fotos
  const handleDragStart = (e: DragEvent, source: "cover" | "editorial") => {
    setDraggedTarget(source);
    e.dataTransfer.setData("text/plain", source);
  };

  const handleDragOver = (e: DragEvent, target: "cover" | "editorial") => {
    e.preventDefault();
    if (draggedTarget && draggedTarget !== target) {
      setDragOverTarget(target);
    }
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDrop = (e: DragEvent, target: "cover" | "editorial") => {
    e.preventDefault();
    setDragOverTarget(null);
    if (draggedTarget && draggedTarget !== target) {
      swapPhotos();
    }
    setDraggedTarget(null);
  };

  // Gerenciamento dinâmico de Materiais
  const addMaterialRow = () => {
    setForm((old) => ({
      ...old,
      materials: [...(old.materials || []), { label: "", value: "" }],
    }));
  };

  const updateMaterialRow = (index: number, field: "label" | "value", val: string) => {
    setForm((old) => {
      const copy = [...(old.materials || [])];
      copy[index] = { ...copy[index], [field]: val };
      return { ...old, materials: copy };
    });
  };

  const removeMaterialRow = (index: number) => {
    setForm((old) => ({
      ...old,
      materials: (old.materials || []).filter((_, i) => i !== index),
    }));
  };

  // Gerenciamento dinâmico de Medidas
  const addDimensionRow = () => {
    setForm((old) => ({
      ...old,
      dimensions: [...(old.dimensions || []), { label: "", value: "" }],
    }));
  };

  const updateDimensionRow = (index: number, field: "label" | "value", val: string) => {
    setForm((old) => {
      const copy = [...(old.dimensions || [])];
      copy[index] = { ...copy[index], [field]: val };
      return { ...old, dimensions: copy };
    });
  };

  const removeDimensionRow = (index: number) => {
    setForm((old) => ({
      ...old,
      dimensions: (old.dimensions || []).filter((_, i) => i !== index),
    }));
  };

  // Gerenciamento dinâmico de Variantes (Xadrez vs Liso, Cor, SKU)
  const addVariationRow = () => {
    setForm((old) => ({
      ...old,
      variations: [
        ...(old.variations || []),
        { name: "", hex: "#E8DEC8", pattern: "liso", sku: "" },
      ],
    }));
  };

  const updateVariationRow = (index: number, field: keyof Variation, val: any) => {
    setForm((old) => {
      const copy = [...(old.variations || [])];
      copy[index] = { ...copy[index], [field]: val };
      return { ...old, variations: copy };
    });
  };

  const removeVariationRow = (index: number) => {
    setForm((old) => ({
      ...old,
      variations: (old.variations || []).filter((_, i) => i !== index),
    }));
  };

  // Atalhos rápidos para Materiais e Medidas
  const quickAddMaterial = (label: string) => {
    setForm((old) => ({
      ...old,
      materials: [...(old.materials || []), { label, value: "" }],
    }));
  };

  const quickAddDimension = (label: string) => {
    setForm((old) => ({
      ...old,
      dimensions: [...(old.dimensions || []), { label, value: "" }],
    }));
  };

  // Gerenciamento dinâmico de Itens de Jogo Completo (preços por peça)
  const addGameItem = (label = "", wholesale_price: number | null = null, retail_price: number | null = null) => {
    setForm((old) => ({
      ...old,
      game_items: [...(old.game_items || []), { label, wholesale_price, retail_price }],
    }));
  };

  const updateGameItem = (index: number, field: keyof GameItem, val: any) => {
    setForm((old) => {
      const copy = [...(old.game_items || [])];
      copy[index] = { ...copy[index], [field]: val };
      return { ...old, game_items: copy };
    });
  };

  const removeGameItem = (index: number) => {
    setForm((old) => ({
      ...old,
      game_items: (old.game_items || []).filter((_, i) => i !== index),
    }));
  };

  const populateStandardGameItems = () => {
    setForm((old) => {
      const existing = old.game_items || [];
      const standardLabels = ["Lugar americano", "Guardanapo", "Porta-guardanapo"];
      const newItems = [...existing];
      standardLabels.forEach((lbl) => {
        if (!newItems.some((item) => item.label.toLowerCase() === lbl.toLowerCase())) {
          newItems.push({ label: lbl, wholesale_price: null, retail_price: null });
        }
      });
      return { ...old, game_items: newItems };
    });
  };

  const syncGlobalPriceFromGameItems = () => {
    if (!form.game_items || form.game_items.length === 0) return;
    const totalWholesale = form.game_items.reduce(
      (acc, item) => acc + (item.wholesale_price ? Number(item.wholesale_price) : 0),
      0,
    );
    const totalRetail = form.game_items.reduce(
      (acc, item) => acc + (item.retail_price ? Number(item.retail_price) : 0),
      0,
    );
    setForm((old) => ({
      ...old,
      wholesale_price: totalWholesale > 0 ? Number(totalWholesale.toFixed(2)) : old.wholesale_price,
      retail_price: totalRetail > 0 ? Number(totalRetail.toFixed(2)) : old.retail_price,
    }));
  };

  async function upload(
    e: ChangeEvent<HTMLInputElement>,
    field: "image_url" | "editorial_image_url",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      // Fallback local caso Supabase storage não esteja conectado (gera preview dataURL)
      const reader = new FileReader();
      reader.onload = () => {
        change(field, reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    setSaving(true);
    try {
      const path = `products/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false });

      if (error) {
        setMessage("Falha no upload da foto: " + error.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      change(field, data.publicUrl);
    } catch (err: any) {
      setMessage("Erro ao enviar imagem: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  function start(product?: Product) {
    setEditing(product || null);
    if (product) {
      const hasGame = Boolean(product.game_items && product.game_items.length > 0);
      setPricingMode(hasGame || product.category === "Jogos" ? "game_items" : "standard");
      setForm({
        ...product,
        tray_id: product.tray_id ?? null,
        description: product.description || "",
        materials: product.materials ? [...product.materials] : [],
        dimensions: product.dimensions ? [...product.dimensions] : [],
        kit_quantity: product.kit_quantity ?? null,
        variations: product.variations ? [...product.variations] : [],
        game_items: product.game_items ? product.game_items.map((g) => ({ ...g })) : [],
      });
    } else {
      setPricingMode("standard");
      setForm(blank());
    }
    setWizardStep(1);
    setOpen(true);
    setMessage("");
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        sku: form.sku || null,
        tray_id: form.tray_id ? Number(form.tray_id) : null,
        collection: form.collection || null,
        color_name: form.color_name || null,
        color_hex: form.color_hex || null,
        kit_quantity: form.kit_quantity != null ? Number(form.kit_quantity) : null,
        materials: (form.materials || []).filter((m) => m.label.trim() || m.value.trim()),
        dimensions: (form.dimensions || []).filter((d) => d.label.trim() || d.value.trim()),
        variations: (form.variations || []).filter((v) => v.name.trim()),
        game_items:
          pricingMode === "game_items"
            ? (form.game_items || []).filter((g) => g.label.trim())
            : [],
        ...(editing ? { id: editing.id } : {}),
      };

      const res = await fetch("/api/admin/produtos", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Falha ao salvar produto.");

      setOpen(false);
      setMessage(`Produto "${form.name}" gravado com sucesso no catálogo!`);
      await load();
    } catch (err: any) {
      setMessage("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggle(product: Product) {
    try {
      const res = await fetch("/api/admin/produtos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          is_visible: !product.is_visible,
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar status");
      await load();
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  async function remove(product: Product) {
    if (!confirm(`Tem certeza que deseja excluir "${product.name}" do catálogo?`))
      return;

    try {
      const res = await fetch(`/api/admin/produtos?id=${encodeURIComponent(product.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir produto.");
      setMessage(`"${product.name}" excluído.`);
      await load();
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  const discountPercent =
    form.wholesale_price && form.retail_price && form.retail_price > form.wholesale_price
      ? Math.round((1 - form.wholesale_price / form.retail_price) * 100)
      : null;

  return (
    <main className="admin-page">
      <header className="admin-top">
        <Link className="wordmark" href="/">
          Mesa<span>&amp;</span>Graça
        </Link>
        <div>
          <Link href="/catalogo">Visualizar catálogo ↗</Link>
          <Link href="/catalogo/imprimir">Exportar PDF 🖨️</Link>
          <button type="button" onClick={() => start()}>+ Novo produto</button>
        </div>
      </header>

      <section className="admin-heading">
        <p className="category-label">GESTÃO DE CATÁLOGO SUPABASE</p>
        <h1>Painel de Controle de Produtos</h1>
        <p>
          Gerencie preços de atacado, especificações completas, fotos e visibilidade com persistência em tempo real.
        </p>
      </section>

      <div className="admin-controls">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, cor ou SKU..."
        />
        <div>
          {["Todos", ...CATEGORIES].map((x) => (
            <button
              type="button"
              className={filter === x ? "active" : ""}
              onClick={() => setFilter(x)}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}
      {!isSupabaseReady && (
        <p className="admin-message">
          Modo local ativo: configure o Supabase para sincronização em nuvem.
        </p>
      )}

      {/* Lista de Produtos Cadastrados */}
      <section className="admin-list">
        {list.length ? (
          list.map((p) => (
            <article className={`admin-item ${!p.is_visible ? "inactive-item" : ""}`} key={p.id}>
              <div className="admin-thumb">
                {p.image_url ? (
                  <img src={p.image_url} alt="" />
                ) : (
                  <span>Sem foto</span>
                )}
              </div>
              <div>
                <b>{p.name}</b>
                <small>
                  {p.category} · {p.color_name || "Sem cor"} · REF: {p.sku ? p.sku.replace(/^MG-/, "") : p.id.slice(0, 8)}
                  <span className={`status-pill ${p.is_visible ? "active" : "inactive"}`}>
                    {p.is_visible ? "Ativo" : "Oculto"}
                  </span>
                  {p.kit_quantity && (
                    <span className="status-pill active" style={{ background: "#2b1d14", color: "#fff" }}>
                      Kit {p.kit_quantity} un
                    </span>
                  )}
                  {p.game_items && p.game_items.length > 0 && (
                    <span className="status-pill active" style={{ background: "#734e34", color: "#fff" }}>
                      Jogo ({p.game_items.length} itens)
                    </span>
                  )}
                </small>
              </div>
              <strong>
                {p.wholesale_price != null ? (
                  money(p.wholesale_price)
                ) : p.game_items && p.game_items.length > 0 ? (
                  <span className="price-game-summary" title="Preço total dos itens do jogo">
                    {money(p.game_items.reduce((acc, i) => acc + (i.wholesale_price || 0), 0))}
                  </span>
                ) : (
                  "—"
                )}
              </strong>
              <div className="item-actions">
                <button type="button" onClick={() => start(p)}>Editar</button>
                <button type="button" onClick={() => toggle(p)}>
                  {p.is_visible ? "Ocultar" : "Mostrar"}
                </button>
                <button type="button" className="danger" onClick={() => remove(p)}>
                  Excluir
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="no-products">Nenhum produto cadastrado ou encontrado nesta busca.</div>
        )}
      </section>

      {/* Modal Guiado em 5 Etapas */}
      {open && (
        <div className="modal-backdrop">
          <form className="product-form wizard-form" onSubmit={save}>
            {/* Topo do Modal */}
            <div className="form-head">
              <div>
                <p className="category-label">
                  {editing ? "EDITAR PRODUTO" : "NOVO PRODUTO"}
                </p>
                <h2>{editing ? form.name || "Editar Peça" : "Cadastrar Nova Peça"}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar modal">
                ×
              </button>
            </div>

            {/* Navegador Visual de Etapas */}
            <nav className="wizard-nav" aria-label="Etapas do formulário">
              <button
                type="button"
                className={`wizard-step-btn ${wizardStep === 1 ? "active" : ""} ${wizardStep > 1 ? "completed" : ""}`}
                onClick={() => setWizardStep(1)}
              >
                <span>1</span> Geral &amp; Kit
              </button>
              <button
                type="button"
                className={`wizard-step-btn ${wizardStep === 2 ? "active" : ""} ${wizardStep > 2 ? "completed" : ""}`}
                onClick={() => setWizardStep(2)}
              >
                <span>2</span> Cores &amp; Estampas
              </button>
              <button
                type="button"
                className={`wizard-step-btn ${wizardStep === 3 ? "active" : ""} ${wizardStep > 3 ? "completed" : ""}`}
                onClick={() => setWizardStep(3)}
              >
                <span>3</span> Ficha Técnica
              </button>
              <button
                type="button"
                className={`wizard-step-btn ${wizardStep === 4 ? "active" : ""} ${wizardStep > 4 ? "completed" : ""}`}
                onClick={() => setWizardStep(4)}
              >
                <span>4</span> Preços
              </button>
              <button
                type="button"
                className={`wizard-step-btn ${wizardStep === 5 ? "active" : ""}`}
                onClick={() => setWizardStep(5)}
              >
                <span>5</span> Fotos &amp; Publicação
              </button>
            </nav>

            {/* Conteúdo das Etapas */}
            <div className="wizard-body">
              {/* ETAPA 1: Dados Gerais, Kit & Descrição */}
              {wizardStep === 1 && (
                <div className="wizard-pane">
                  <div className="form-row">
                    <label>
                      Nome do Produto *
                      <input
                        required
                        autoFocus
                        value={form.name}
                        onChange={(e) => change("name", e.target.value)}
                        placeholder="Ex: Jogo Americano Redondo Xadrez Provence"
                      />
                    </label>
                  </div>

                  <div className="form-row">
                    <label>Categoria do Produto *</label>
                    <div className="category-pills-select">
                      {CATEGORIES.map((c) => (
                        <button
                          type="button"
                          key={c}
                          className={`category-pill-opt ${form.category === c ? "selected" : ""}`}
                          onClick={() => {
                            change("category", c);
                            if (c === "Jogos") {
                              setPricingMode("game_items");
                              if (!form.game_items || form.game_items.length === 0) {
                                populateStandardGameItems();
                              }
                            }
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-grid">
                    <label>
                      Coleção (Opcional)
                      <input
                        value={form.collection || ""}
                        onChange={(e) => change("collection", e.target.value)}
                        placeholder="Ex: Provence, Tropical, Páscoa"
                      />
                    </label>

                    <label>
                      SKU / Código de Referência
                      <div className="sku-input-wrapper">
                        <input
                          value={form.sku || ""}
                          onChange={(e) => change("sku", e.target.value)}
                          placeholder="Ex: MG-LA-XADR-01"
                        />
                        <button
                          type="button"
                          className="sku-auto-btn"
                          onClick={generateAutoSku}
                          title="Gerar código SKU automático"
                        >
                          Gerar
                        </button>
                      </div>
                    </label>

                    <label>
                      ID Tray E-commerce (Opcional)
                      <input
                        type="number"
                        value={form.tray_id ?? ""}
                        onChange={(e) =>
                          change("tray_id", e.target.value ? Number(e.target.value) : null)
                        }
                        placeholder="Ex: 250"
                      />
                    </label>
                  </div>

                  <div className="form-section-card">
                    <div className="form-section-header">
                      <p className="form-section-title">📦 Formato de Venda (Kit ou Unitário)</p>
                      <p className="form-helper-text">Se for vendido exclusivamente em conjunto</p>
                    </div>
                    <div className="form-row">
                      <label>
                        Quantidade de Peças por Kit
                        <select
                          value={form.kit_quantity ?? ""}
                          onChange={(e) =>
                            change("kit_quantity", e.target.value ? Number(e.target.value) : null)
                          }
                        >
                          {KIT_OPTIONS.map((opt) => (
                            <option key={String(opt.value)} value={opt.value ?? ""}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="form-row">
                    <label>
                      Descrição Comercial do Produto
                      <textarea
                        rows={3}
                        value={form.description || ""}
                        onChange={(e) => change("description", e.target.value)}
                        placeholder="Texto comercial elegante com detalhes sobre a composição da mesa posta, acabamento e diferenciais..."
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* ETAPA 2: Cores, Padrões e Variantes Avançadas */}
              {wizardStep === 2 && (
                <div className="wizard-pane">
                  <div className="form-section-card">
                    <div className="form-section-header">
                      <p className="form-section-title">🎨 Cor Principal e Preset Rápido</p>
                      <p className="form-helper-text">Usada na identificação primária da peça</p>
                    </div>

                    <div className="form-row">
                      <label>
                        Nome da Cor Principal *
                        <input
                          value={form.color_name || ""}
                          onChange={(e) => change("color_name", e.target.value)}
                          placeholder="Ex: Linho Cru, Terracota, Verde Alecrim"
                        />
                      </label>
                    </div>

                    <div className="form-row">
                      <label>Seletor Rápido de Paleta:</label>
                      <div className="preset-colors-row">
                        {PRESET_COLORS.map((pc) => (
                          <button
                            type="button"
                            key={pc.name}
                            className={`preset-color-dot ${form.color_hex === pc.hex ? "active" : ""}`}
                            style={{ backgroundColor: pc.hex }}
                            title={pc.name}
                            onClick={() => {
                              change("color_hex", pc.hex);
                              if (!form.color_name) change("color_name", pc.name);
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="form-grid color-custom-grid">
                      <label>
                        Código Hexadecimal
                        <input
                          value={form.color_hex || ""}
                          onChange={(e) => change("color_hex", e.target.value)}
                          placeholder="#C46549"
                        />
                      </label>
                      <label>
                        Color Picker
                        <input
                          type="color"
                          className="color-picker-input"
                          value={form.color_hex || "#E8DEC8"}
                          onChange={(e) => change("color_hex", e.target.value)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Gerenciador de Variantes (Xadrez, Liso, Cores adicionais) */}
                  <div className="form-section-card">
                    <div className="form-section-header">
                      <p className="form-section-title">✨ Grade de Variações (Xadrez, Liso, Outras Cores)</p>
                      <button
                        type="button"
                        className="btn-add-item"
                        onClick={addVariationRow}
                      >
                        + Adicionar Variação
                      </button>
                    </div>
                    <p className="form-helper-text">
                      Cadastre diferentes estampas (como Xadrez e Lisa) ou paletas no mesmo produto para escolha do lojista.
                    </p>

                    {(form.variations && form.variations.length > 0) ? (
                      <div className="dynamic-list">
                        {form.variations.map((v, idx) => (
                          <div className="dynamic-row-variant" key={idx}>
                            <input
                              placeholder="Nome da variante (ex: Xadrez Azul)"
                              value={v.name}
                              onChange={(e) => updateVariationRow(idx, "name", e.target.value)}
                            />
                            <select
                              value={v.pattern}
                              onChange={(e) =>
                                updateVariationRow(idx, "pattern", e.target.value as "xadrez" | "liso")
                              }
                            >
                              <option value="liso">Estampa: Lisa</option>
                              <option value="xadrez">Estampa: Xadrez</option>
                            </select>
                            <input
                              type="color"
                              title="Cor da variação"
                              className="color-picker-input"
                              style={{ width: "100%", height: "2.75rem" }}
                              value={v.hex || "#E8DEC8"}
                              onChange={(e) => updateVariationRow(idx, "hex", e.target.value)}
                            />
                            <input
                              placeholder="SKU variante (opc)"
                              value={v.sku || ""}
                              onChange={(e) => updateVariationRow(idx, "sku", e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn-remove-row"
                              onClick={() => removeVariationRow(idx)}
                              title="Remover variação"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="form-helper-text" style={{ fontStyle: "italic" }}>
                        Nenhuma variação extra cadastrada. O produto usará apenas a cor principal.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ETAPA 3: Ficha Técnica (Materiais & Medidas) */}
              {wizardStep === 3 && (
                <div className="wizard-pane">
                  {/* Materiais e Tecidos */}
                  <div className="form-section-card">
                    <div className="form-section-header">
                      <div>
                        <p className="form-section-title">🧵 Materiais e Composição por Componente</p>
                        <div className="quick-chip-row">
                          <span className="quick-chip-label">Atalhos rápidos:</span>
                          <button type="button" className="quick-chip-btn" onClick={() => quickAddMaterial("Lugar americano")}>+ Lugar americano</button>
                          <button type="button" className="quick-chip-btn" onClick={() => quickAddMaterial("Guardanapo")}>+ Guardanapo</button>
                          <button type="button" className="quick-chip-btn" onClick={() => quickAddMaterial("Porta-guardanapo")}>+ Porta-guardanapo</button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-add-item"
                        onClick={addMaterialRow}
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    {(form.materials && form.materials.length > 0) ? (
                      <div className="dynamic-list">
                        {form.materials.map((m, idx) => (
                          <div className="dynamic-row" key={idx}>
                            <input
                              placeholder="Componente (ex: Tecido principal, Argola)"
                              value={m.label}
                              onChange={(e) => updateMaterialRow(idx, "label", e.target.value)}
                            />
                            <input
                              placeholder="Composição (ex: Sarja 100% Algodão, Madeira Natural)"
                              value={m.value}
                              onChange={(e) => updateMaterialRow(idx, "value", e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn-remove-row"
                              onClick={() => removeMaterialRow(idx)}
                              title="Remover linha"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="form-helper-text" style={{ fontStyle: "italic" }}>
                        Nenhum material adicionado. Use os atalhos acima para preencher rapidamente.
                      </p>
                    )}
                  </div>

                  {/* Medidas e Dimensões */}
                  <div className="form-section-card">
                    <div className="form-section-header">
                      <div>
                        <p className="form-section-title">📏 Medidas e Dimensões por Peça</p>
                        <div className="quick-chip-row">
                          <span className="quick-chip-label">Atalhos rápidos:</span>
                          <button type="button" className="quick-chip-btn" onClick={() => quickAddDimension("Lugar americano")}>+ Lugar americano</button>
                          <button type="button" className="quick-chip-btn" onClick={() => quickAddDimension("Guardanapo")}>+ Guardanapo</button>
                          <button type="button" className="quick-chip-btn" onClick={() => quickAddDimension("Porta-guardanapo")}>+ Porta-guardanapo</button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-add-item"
                        onClick={addDimensionRow}
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    {(form.dimensions && form.dimensions.length > 0) ? (
                      <div className="dynamic-list">
                        {form.dimensions.map((d, idx) => (
                          <div className="dynamic-row" key={idx}>
                            <input
                              placeholder="Dimensão (ex: Diâmetro, Medida da peça)"
                              value={d.label}
                              onChange={(e) => updateDimensionRow(idx, "label", e.target.value)}
                            />
                            <input
                              placeholder="Valor (ex: 38 cm, 45 cm x 45 cm)"
                              value={d.value}
                              onChange={(e) => updateDimensionRow(idx, "value", e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn-remove-row"
                              onClick={() => removeDimensionRow(idx)}
                              title="Remover linha"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="form-helper-text" style={{ fontStyle: "italic" }}>
                        Nenhuma medida adicionada. Clique no botão acima para especificar diâmetro ou tamanho.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ETAPA 4: Precificação */}
              {wizardStep === 4 && (
                <div className="wizard-pane">
                  {/* Seletor de Modalidade de Preço */}
                  <div className="form-section-card">
                    <div className="form-section-header">
                      <div>
                        <p className="form-section-title">💰 Formato de Precificação</p>
                        <p className="form-helper-text">Escolha como este produto é cobrado do lojista</p>
                      </div>
                    </div>
                    <div className="pricing-mode-pills">
                      <button
                        type="button"
                        className={`pricing-mode-pill ${pricingMode === "standard" ? "active" : ""}`}
                        onClick={() => setPricingMode("standard")}
                      >
                        🏷️ Preço Único / Global (Peça ou Kit)
                      </button>
                      <button
                        type="button"
                        className={`pricing-mode-pill ${pricingMode === "game_items" ? "active" : ""}`}
                        onClick={() => {
                          setPricingMode("game_items");
                          if (!form.game_items || form.game_items.length === 0) {
                            populateStandardGameItems();
                          }
                        }}
                      >
                        🍽️ Preços por Item (Jogo Completo de Mesa)
                      </button>
                    </div>
                  </div>

                  {pricingMode === "game_items" ? (
                    <div className="form-section-card">
                      <div className="form-section-header">
                        <div>
                          <p className="form-section-title">🍽️ Itens do Jogo &amp; Preços Separados</p>
                          <p className="form-helper-text">
                            Defina os preços de atacado e varejo por item (ex: Lugar Americano, Guardanapo, Porta-guardanapo)
                          </p>
                        </div>
                        <div className="game-items-head-actions">
                          <button
                            type="button"
                            className="btn-quick-outline"
                            onClick={populateStandardGameItems}
                            title="Preenche automaticamente com Lugar Americano, Guardanapo e Porta-guardanapo"
                          >
                            ✨ Padrão 3 Peças
                          </button>
                          <button
                            type="button"
                            className="btn-add-item"
                            onClick={() => addGameItem("", null, null)}
                          >
                            + Adicionar Peça
                          </button>
                        </div>
                      </div>

                      {form.game_items && form.game_items.length > 0 ? (
                        <div className="game-items-table">
                          <div className="game-items-table-head">
                            <span>Componente / Peça *</span>
                            <span>Preço Atacado (R$) *</span>
                            <span>Varejo / De (R$)</span>
                            <span></span>
                          </div>
                          <div className="dynamic-list">
                            {form.game_items.map((item, idx) => (
                              <div className="dynamic-row-game-item" key={idx}>
                                <input
                                  required
                                  placeholder="Ex: Lugar americano, Guardanapo..."
                                  value={item.label}
                                  onChange={(e) => updateGameItem(idx, "label", e.target.value)}
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="Ex: 19,74"
                                  value={item.wholesale_price ?? ""}
                                  onChange={(e) =>
                                    updateGameItem(
                                      idx,
                                      "wholesale_price",
                                      e.target.value ? Number(e.target.value) : null,
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="Ex: 32,90 (opc)"
                                  value={item.retail_price ?? ""}
                                  onChange={(e) =>
                                    updateGameItem(
                                      idx,
                                      "retail_price",
                                      e.target.value ? Number(e.target.value) : null,
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  className="btn-remove-row"
                                  onClick={() => removeGameItem(idx)}
                                  title="Remover item"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="form-helper-text" style={{ fontStyle: "italic" }}>
                          Nenhum componente adicionado. Clique em &quot;Padrão 3 Peças&quot; para preencher rapidamente.
                        </p>
                      )}

                      {/* Card de Consolidação e Totalização do Jogo */}
                      {form.game_items && form.game_items.length > 0 && (
                        <div className="game-summary-card">
                          <div className="game-summary-stats">
                            <div className="summary-stat">
                              <span>Total Atacado (Soma):</span>
                              <strong>
                                {money(
                                  form.game_items.reduce(
                                    (acc, it) => acc + (it.wholesale_price ? Number(it.wholesale_price) : 0),
                                    0,
                                  ),
                                )}
                              </strong>
                            </div>
                            <div className="summary-stat">
                              <span>Total Varejo Sugerido:</span>
                              <strong>
                                {money(
                                  form.game_items.reduce(
                                    (acc, it) => acc + (it.retail_price ? Number(it.retail_price) : 0),
                                    0,
                                  ),
                                )}
                              </strong>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-sync-prices"
                            onClick={syncGlobalPriceFromGameItems}
                            title="Atualiza o Preço Atacado e Varejo global do produto com a soma dos itens"
                          >
                            🔄 Sincronizar com Preço Global do Jogo
                          </button>
                        </div>
                      )}

                      {/* Preço Global Opcional para o Jogo Fechado */}
                      <div className="form-section-card" style={{ marginTop: "1rem" }}>
                        <div className="form-section-header">
                          <p className="form-section-title">Preço Global do Jogo (Opcional)</p>
                          <p className="form-helper-text">
                            Preencha se o jogo fechado tiver um valor próprio de atacado além da soma avulsa
                          </p>
                        </div>
                        <div className="form-grid">
                          <label>
                            Atacado Jogo Completo
                            <input
                              type="number"
                              step="0.01"
                              value={form.wholesale_price ?? ""}
                              onChange={(e) =>
                                change("wholesale_price", e.target.value ? Number(e.target.value) : null)
                              }
                              placeholder="Opcional se itens preenchidos"
                            />
                          </label>
                          <label>
                            Varejo Sugerido Jogo Completo
                            <input
                              type="number"
                              step="0.01"
                              value={form.retail_price ?? ""}
                              onChange={(e) =>
                                change("retail_price", e.target.value ? Number(e.target.value) : null)
                              }
                              placeholder="Opcional se itens preenchidos"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="form-section-card">
                      <div className="form-section-header">
                        <p className="form-section-title">🏷️ Preço Atacado &amp; Varejo</p>
                        <p className="form-helper-text">Defina o valor por unidade ou pelo kit fechado</p>
                      </div>

                      <div className="form-grid">
                        <label>
                          Preço Atacado (Lojista) *
                          <input
                            required={pricingMode === "standard"}
                            type="number"
                            step="0.01"
                            value={form.wholesale_price ?? ""}
                            onChange={(e) =>
                              change("wholesale_price", e.target.value ? Number(e.target.value) : null)
                            }
                            placeholder="0,00"
                          />
                        </label>

                        <label>
                          Preço Sugerido de Varejo
                          <input
                            type="number"
                            step="0.01"
                            value={form.retail_price ?? ""}
                            onChange={(e) =>
                              change("retail_price", e.target.value ? Number(e.target.value) : null)
                            }
                            placeholder="0,00"
                          />
                        </label>
                      </div>

                      {discountPercent != null && (
                        <div className="margin-feedback-card" style={{ marginTop: "1.25rem" }}>
                          <span className="margin-pill">{discountPercent}% de Margem</span>
                          <p>
                            O revendedor adquire por <strong>{money(form.wholesale_price)}</strong> e pode revender por <strong>{money(form.retail_price)}</strong>.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 5: Fotos, Reordenação (Drag & Drop) e Publicação */}
              {wizardStep === 5 && (
                <div className="wizard-pane">
                  {/* Banner de Troca Rápida de Fotos */}
                  <div className="photo-swap-banner">
                    <button
                      type="button"
                      className="btn-swap-photos"
                      onClick={swapPhotos}
                      title="Inverter ordem das fotos (Capa ↔ Editorial)"
                    >
                      ⇄ Inverter Ordem (Capa ↔ Editorial)
                    </button>
                  </div>

                  <div className="photo-upload-grid">
                    {/* Foto Principal / Capa */}
                    <div
                      className={`photo-card-dropzone ${dragOverTarget === "cover" ? "drag-active" : ""}`}
                      onDragOver={(e) => handleDragOver(e, "cover")}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, "cover")}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="photo-badge-order">1ª Foto · Capa</span>
                        <p className="photo-title">Estúdio / Fundo Limpo</p>
                      </div>

                      {form.image_url ? (
                        <div
                          className="photo-preview-wrap"
                          draggable
                          onDragStart={(e) => handleDragStart(e, "cover")}
                        >
                          <img src={form.image_url} alt="Capa" />
                          <span className="photo-drag-hint">Arraste para a direita para trocar com a editorial</span>
                          <div className="photo-actions">
                            <label className="photo-replace-btn">
                              Trocar foto
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => upload(e, "image_url")}
                              />
                            </label>
                            <button
                              type="button"
                              className="photo-remove-btn"
                              onClick={() => change("image_url", null)}
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="photo-upload-empty">
                          <span className="photo-icon">📷</span>
                          <span>Clique ou arraste a foto de capa aqui</span>
                          <small>Recomendado: JPEG ou WebP quadrado (800x800px)</small>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => upload(e, "image_url")}
                          />
                        </label>
                      )}
                    </div>

                    {/* Foto Editorial / Ambiente */}
                    <div
                      className={`photo-card-dropzone ${dragOverTarget === "editorial" ? "drag-active" : ""}`}
                      onDragOver={(e) => handleDragOver(e, "editorial")}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, "editorial")}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="photo-badge-order" style={{ background: "#746b61" }}>2ª Foto · Editorial</span>
                        <p className="photo-title">Mesa Posta / Hover</p>
                      </div>

                      {form.editorial_image_url ? (
                        <div
                          className="photo-preview-wrap"
                          draggable
                          onDragStart={(e) => handleDragStart(e, "editorial")}
                        >
                          <img src={form.editorial_image_url} alt="Editorial" />
                          <span className="photo-drag-hint">Arraste para a esquerda para tornar esta a capa</span>
                          <div className="photo-actions">
                            <label className="photo-replace-btn">
                              Trocar foto
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => upload(e, "editorial_image_url")}
                              />
                            </label>
                            <button
                              type="button"
                              className="photo-remove-btn"
                              onClick={() => change("editorial_image_url", null)}
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="photo-upload-empty">
                          <span className="photo-icon">🍽️</span>
                          <span>Clique para foto em ambiente</span>
                          <small>Exibida no efeito de hover do catálogo</small>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => upload(e, "editorial_image_url")}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="visibility-settings-card">
                    <label className="toggle-switch-label">
                      <input
                        type="checkbox"
                        checked={form.is_visible}
                        onChange={(e) => change("is_visible", e.target.checked)}
                      />
                      <span className="toggle-slider" />
                      <span>Exibir este produto ativamente no catálogo online</span>
                    </label>

                    <label className="order-input-label">
                      Posição de Destaque:
                      <input
                        type="number"
                        value={form.sort_order}
                        onChange={(e) => change("sort_order", Number(e.target.value))}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé de Navegação do Wizard */}
            <div className="wizard-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>

              <div className="wizard-step-actions">
                {wizardStep > 1 && (
                  <button
                    type="button"
                    className="btn-prev"
                    onClick={() => setWizardStep((s) => (s - 1) as any)}
                  >
                    ← Anterior
                  </button>
                )}

                {wizardStep < 5 ? (
                  <button
                    type="button"
                    className="btn-next"
                    onClick={() => setWizardStep((s) => (s + 1) as any)}
                  >
                    Próximo Passo →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={saving}
                  >
                    {saving ? "Salvando no Banco..." : "💾 Salvar Produto no Catálogo"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
