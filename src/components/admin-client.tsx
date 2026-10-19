"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { CATEGORIES, type Product, type ProductInput } from "@/types/catalog";
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

const blank = (): ProductInput => ({
  name: "",
  category: "Lugar Americano",
  sku: "",
  collection: "",
  color_name: "",
  color_hex: "#E8DEC8",
  retail_price: null,
  wholesale_price: null,
  image_url: null,
  editorial_image_url: null,
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
 * 2. Fluxo guiado (Wizard em 4 etapas) para inclusão e edição de produtos
 * 3. Seleção visual de cores, paleta rápida e gerador inteligente de SKU
 * 4. Pré-visualização imediata de fotos de estúdio (capa) e editorial (em uso)
 * 5. Cálculo automático de margem/desconto de atacado vs varejo
 * 
 * @returns {JSX.Element} Painel administrativo com controle em tempo real
 * @since v2.4.0
 * @category Admin
 */
export function AdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ProductInput>(blank());
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
    setForm(product ? { ...product } : blank());
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
        collection: form.collection || null,
        color_name: form.color_name || null,
        color_hex: form.color_hex || null,
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
          Gerencie preços de atacado, visibilidade na vitrine e fotos com persistência em tempo real.
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
                  {p.category} · {p.color_name || "Sem cor"} · SKU: {p.sku || "—"}
                  <span className={`status-pill ${p.is_visible ? "active" : "inactive"}`}>
                    {p.is_visible ? "Ativo" : "Oculto"}
                  </span>
                </small>
              </div>
              <strong>{money(p.wholesale_price)}</strong>
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

      {/* Modal Guiado em 4 Etapas */}
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
                <span>1</span> Informações
              </button>
              <button
                type="button"
                className={`wizard-step-btn ${wizardStep === 2 ? "active" : ""} ${wizardStep > 2 ? "completed" : ""}`}
                onClick={() => setWizardStep(2)}
              >
                <span>2</span> Cores
              </button>
              <button
                type="button"
                className={`wizard-step-btn ${wizardStep === 3 ? "active" : ""} ${wizardStep > 3 ? "completed" : ""}`}
                onClick={() => setWizardStep(3)}
              >
                <span>3</span> Preços
              </button>
              <button
                type="button"
                className={`wizard-step-btn ${wizardStep === 4 ? "active" : ""}`}
                onClick={() => setWizardStep(4)}
              >
                <span>4</span> Fotos &amp; Publicação
              </button>
            </nav>

            {/* Conteúdo das Etapas */}
            <div className="wizard-body">
              {/* ETAPA 1: Dados Gerais */}
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
                        placeholder="Ex: Jogo Americano Redondo Xadrez"
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
                          onClick={() => change("category", c)}
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
                  </div>
                </div>
              )}

              {/* ETAPA 2: Cores & Variações */}
              {wizardStep === 2 && (
                <div className="wizard-pane">
                  <div className="form-row">
                    <label>
                      Nome da Cor ou Padrão *
                      <input
                        value={form.color_name || ""}
                        onChange={(e) => change("color_name", e.target.value)}
                        placeholder="Ex: Linho Cru, Terracota, Verde Alecrim"
                      />
                    </label>
                  </div>

                  <div className="form-row">
                    <label>Seletor Rápido de Cor:</label>
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
                      Código Hexadecimal Customizado
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
              )}

              {/* ETAPA 3: Precificação */}
              {wizardStep === 3 && (
                <div className="wizard-pane">
                  <div className="form-grid">
                    <label>
                      Preço Atacado (Lojista) *
                      <input
                        required
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
                    <div className="margin-feedback-card">
                      <span className="margin-pill">{discountPercent}% de Margem</span>
                      <p>
                        O revendedor compra por <strong>{money(form.wholesale_price)}</strong> e pode revender por <strong>{money(form.retail_price)}</strong>.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 4: Fotos e Publicação */}
              {wizardStep === 4 && (
                <div className="wizard-pane">
                  <div className="photo-upload-grid">
                    {/* Foto Principal / Capa */}
                    <div className="photo-card-dropzone">
                      <p className="photo-title">Foto de Capa (Estúdio / Fundo Limpo)</p>
                      {form.image_url ? (
                        <div className="photo-preview-wrap">
                          <img src={form.image_url} alt="Capa" />
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
                    <div className="photo-card-dropzone">
                      <p className="photo-title">Foto Editorial (Mesa Posta / Hover)</p>
                      {form.editorial_image_url ? (
                        <div className="photo-preview-wrap">
                          <img src={form.editorial_image_url} alt="Editorial" />
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
                      Posição de Destaque (Ordem):
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

                {wizardStep < 4 ? (
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
