"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "./brand-logo";

export function RetailAccess() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/varejo/acesso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "Não foi possível liberar o acesso.");
      setSubmitting(false);
      return;
    }

    router.refresh();
  };

  return (
    <main className="retail-access-page">
      <section className="retail-access-card" aria-labelledby="retail-access-title">
        <BrandLogo priority />
        <p className="eyebrow">ÁREA INTERNA</p>
        <h1 id="retail-access-title">Catálogo de varejo</h1>
        <p>
          Acesse a base que reunirá produtos avulsos, composições de kits e o
          controle de estoque da Mesa &amp; Graça.
        </p>
        <form onSubmit={submit}>
          <label>
            Senha de acesso
            <input
              autoComplete="current-password"
              autoFocus
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {message && <p className="retail-access-error" role="alert">{message}</p>}
          <button disabled={submitting} type="submit">
            {submitting ? "Verificando…" : "Acessar catálogo"}
          </button>
        </form>
      </section>
    </main>
  );
}
