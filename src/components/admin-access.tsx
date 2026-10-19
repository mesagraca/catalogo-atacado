"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "./brand-logo";

export function AdminAccess() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/admin/acesso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "PIN ou senha incorreta.");
      setSubmitting(false);
      return;
    }

    router.refresh();
  };

  return (
    <main className="retail-access-page">
      <section className="retail-access-card" aria-labelledby="admin-access-title">
        <BrandLogo priority />
        <p className="eyebrow">GESTÃO DE CATÁLOGO</p>
        <h1 id="admin-access-title">Painel Administrativo</h1>
        <p>
          Área restrita para edição de preços, ativação de produtos e gestão de fotos do catálogo Mesa &amp; Graça.
        </p>
        <form onSubmit={submit}>
          <label>
            PIN de Acesso Administrativo
            <input
              autoComplete="current-password"
              autoFocus
              onChange={(event) => setPin(event.target.value)}
              placeholder="Digite o PIN ou senha"
              required
              type="password"
              value={pin}
            />
          </label>
          {message && <p className="retail-access-error" role="alert">{message}</p>}
          <button disabled={submitting} type="submit">
            {submitting ? "Autenticando…" : "Entrar no painel"}
          </button>
        </form>
      </section>
    </main>
  );
}
