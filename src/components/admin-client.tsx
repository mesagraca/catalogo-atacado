"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { CATEGORIES, type Product, type ProductInput } from "@/types/catalog";
import { isSupabaseReady, supabase } from "@/lib/supabase";

const blank = (): ProductInput => ({
  name: "",
  category: "Lugar Americano",
  sku: "",
  collection: "",
  color_name: "",
  color_hex: "",
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

export function AdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ProductInput>(blank());
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
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

  async function upload(
    e: ChangeEvent<HTMLInputElement>,
    field: "image_url" | "editorial_image_url",
  ) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setSaving(true);
    const path = `products/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: false });

    if (error) {
      setMessage("Falha no upload: " + error.message);
      setSaving(false);
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);

    setForm((f) => ({ ...f, [field]: data.publicUrl, image_status: "final" }));
    setSaving(false);
  }

  function start(product?: Product) {
    setEditing(product || null);
    setForm(product ? { ...product } : blank());
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
      setMessage("Produto salvo com sucesso no banco de dados!");
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

  return (
    <main className="admin-page">
      <header className="admin-top">
        <Link className="wordmark" href="/">
          Mesa<span>&amp;</span>Graça
        </Link>
        <div>
          <Link href="/catalogo">Visualizar catálogo</Link>
          <Link href="/catalogo/imprimir">Exportar PDF</Link>
          <button onClick={() => start()}>+ Novo produto</button>
        </div>
      </header>

      <section className="admin-heading">
        <p className="category-label">GESTÃO DE CATÁLOGO SUPABASE</p>
        <h1>Catálogo Mesa<span>&amp;</span>Graça</h1>
        <p>Gerencie preços, visibilidade e fotos conectados diretamente ao PostgreSQL.</p>
      </section>

      <div className="admin-controls">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, cor ou SKU"
        />
        <div>
          {["Todos", ...CATEGORIES].map((x) => (
            <button
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
          Modo de demonstração: conecte o Supabase para persistir produtos e fotos.
        </p>
      )}

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
                <button onClick={() => start(p)}>Editar</button>
                <button onClick={() => toggle(p)}>
                  {p.is_visible ? "Ocultar" : "Mostrar"}
                </button>
                <button className="danger" onClick={() => remove(p)}>
                  Excluir
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="no-products">Nenhum produto encontrado.</div>
        )}
      </section>

      {open && (
        <div className="modal-backdrop">
          <form className="product-form" onSubmit={save}>
            <div className="form-head">
              <div>
                <p className="category-label">
                  {editing ? "EDITAR PRODUTO" : "NOVO PRODUTO"}
                </p>
                <h2>{editing ? editing.name || "Produto" : "Cadastrar produto"}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>

            <div className="form-grid">
              <label>
                Nome
                <input
                  required
                  value={form.name}
                  onChange={(e) => change("name", e.target.value)}
                />
              </label>
              <label>
                Categoria
                <select
                  value={form.category}
                  onChange={(e) => change("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                SKU
                <input
                  value={form.sku || ""}
                  onChange={(e) => change("sku", e.target.value)}
                />
              </label>
              <label>
                Coleção
                <input
                  value={form.collection || ""}
                  onChange={(e) => change("collection", e.target.value)}
                />
              </label>
              <label>
                Cor
                <input
                  value={form.color_name || ""}
                  onChange={(e) => change("color_name", e.target.value)}
                />
              </label>
              <label>
                Cor hexadecimal
                <input
                  placeholder="#C8A2C8"
                  value={form.color_hex || ""}
                  onChange={(e) => change("color_hex", e.target.value)}
                />
              </label>
              <label>
                Preço atacado
                <input
                  type="number"
                  step="0.01"
                  value={form.wholesale_price ?? ""}
                  onChange={(e) =>
                    change(
                      "wholesale_price",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </label>
              <label>
                Preço varejo
                <input
                  type="number"
                  step="0.01"
                  value={form.retail_price ?? ""}
                  onChange={(e) =>
                    change(
                      "retail_price",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </label>
              <label>
                Ordem (Sort Order)
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => change("sort_order", Number(e.target.value))}
                />
              </label>
              <label className="file-label">
                Foto principal
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => upload(e, "image_url")}
                />
                {form.image_url && <span>✓ Foto principal selecionada</span>}
              </label>
              <label className="file-label">
                Foto editorial (hover)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => upload(e, "editorial_image_url")}
                />
                {form.editorial_image_url && <span>✓ Foto editorial selecionada</span>}
              </label>
            </div>

            <label className="visible">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) => change("is_visible", e.target.checked)}
              />{" "}
              Mostrar no catálogo
            </label>

            <button className="save-product" disabled={saving}>
              {saving ? "Salvando…" : "Salvar produto no Supabase"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
