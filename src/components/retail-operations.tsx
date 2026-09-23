"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type Validation = {
  summary: Record<string, number>;
  issues: Array<{ severity: "error" | "warning"; code: string; sourceId?: number; message: string }>;
  message?: string;
};

type MediaMigration = {
  localImages: number;
  safeMatches: number;
  migrated: number;
  remaining: number;
  unmatched: number;
  ambiguous: string[];
  candidates: Array<{ relativePath: string; productName: string; sku: string | null; role: string }>;
  failures: string[];
  message?: string;
};

const summaryLabels: Record<string, string> = {
  trayProducts: "Produtos na Tray",
  operationalProducts: "Produtos na operação",
  catalogOnlyProducts: "Somente na Tray",
  zeroStockProducts: "Estoque zerado",
  provisionalStockProducts: "Saldo 50 para confirmar",
  zeroPriceProducts: "Sem preço de varejo",
  missingCostProducts: "Sem custo",
};

export function RetailOperations() {
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<Validation | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncInventory, setSyncInventory] = useState(false);
  const [mediaMigration, setMediaMigration] = useState<MediaMigration | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);

  const inspectMedia = async (apply = false) => {
    setMediaLoading(true);
    const response = await fetch("/api/varejo/midias/migrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apply }),
    });
    setMediaMigration(await response.json() as MediaMigration);
    setMediaLoading(false);
    if (apply && response.ok) window.location.reload();
  };

  const validate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.set("file", file);
    const response = await fetch("/api/varejo/importar", { method: "POST", body: form });
    const result = (await response.json()) as Validation;
    setValidation(result);
    setLoading(false);
  };
  const blockingIssues = validation?.issues.some((issue) => issue.severity === "error");
  const apply = async () => {
    if (!file || blockingIssues) return;
    setLoading(true);
    const form = new FormData();
    form.set("file", file);
    form.set("apply", "true");
    form.set("syncInventory", String(syncInventory));
    const response = await fetch("/api/varejo/importar", { method: "POST", body: form });
    const result = (await response.json()) as Validation;
    setValidation(result);
    setLoading(false);
    if (response.ok) window.location.reload();
  };

  return (
    <section className="retail-operations" aria-labelledby="operations-title">
      <div>
        <p className="eyebrow">OPERAÇÃO</p>
        <h2 id="operations-title">Validar antes de importar.</h2>
        <p>
          Envie o XLSX ou CSV atual da Tray. Saldos marcados como provisórios entram
          como pendência, sem afetar o estoque, até serem confirmados.
        </p>
      </div>
      <form onSubmit={validate}>
        <label>
          Arquivo da Tray
          <input
            accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null)}
            required
            type="file"
          />
        </label>
        <button disabled={!file || loading} type="submit">
          {loading ? "Validando…" : "Validar planilha"}
        </button>
        <a className="retail-export-link" href="/api/varejo/exportar/tray">
          Baixar exportação Tray
        </a>
        <a className="retail-export-link" href="/api/varejo/exportar/estoque">
          Baixar conferência de estoque
        </a>
      </form>
      {validation && (
        <div className="retail-validation" aria-live="polite">
          {validation.message ? (
            <p className="retail-access-error">{validation.message}</p>
          ) : (
            <>
              <div className="retail-summary">
                {Object.entries(validation.summary).map(([key, value]) => (
                  <p key={key}><strong>{value}</strong><span>{summaryLabels[key] ?? key}</span></p>
                ))}
              </div>
              <div className="retail-issues">
                <b>Pendências encontradas</b>
                {validation.issues.length ? validation.issues.slice(0, 12).map((issue, index) => (
                  <p className={issue.severity} key={`${issue.code}-${issue.sourceId ?? index}`}>
                    {issue.sourceId ? `#${issue.sourceId} · ` : ""}{issue.message}
                  </p>
                )) : <p className="ok">Nenhuma pendência crítica encontrada.</p>}
              </div>
              <button className="retail-apply" disabled={Boolean(blockingIssues) || loading} onClick={apply} type="button">
                {blockingIssues ? "Corrija os bloqueios para aplicar" : loading ? "Aplicando…" : "Aplicar importação validada"}
              </button>
              <label className="retail-sync-stock">
                <input checked={syncInventory} onChange={(event) => setSyncInventory(event.target.checked)} type="checkbox" />
                Conciliar estoque desta planilha
                <span>Cria somente ajustes pela diferença encontrada; saldo provisório 50 continua ignorado.</span>
              </label>
            </>
          )}
        </div>
      )}
      <div className="retail-media-migration">
        <div>
          <p className="eyebrow">ACERVO LOCAL</p>
          <h2>Migrar imagens já aprovadas.</h2>
          <p>O sistema encontra apenas correspondências seguras pelo nome, cria uma cópia original privada e publica a versão otimizada no domínio.</p>
        </div>
        <button disabled={mediaLoading} onClick={() => inspectMedia(false)} type="button">
          {mediaLoading ? "Analisando…" : "Analisar imagens locais"}
        </button>
        {mediaMigration && (
          <div className="retail-media-migration-result" aria-live="polite">
            {mediaMigration.message ? <p className="retail-access-error">{mediaMigration.message}</p> : <>
              <p><strong>{mediaMigration.localImages}</strong> imagens locais · <strong>{mediaMigration.safeMatches}</strong> correspondências seguras · <strong>{mediaMigration.unmatched}</strong> sem vínculo automático.</p>
              {mediaMigration.candidates.length > 0 && <ul>{mediaMigration.candidates.map((candidate) => <li key={candidate.relativePath}>{candidate.productName} <span>({candidate.role})</span></li>)}</ul>}
              {mediaMigration.ambiguous.length > 0 && <p className="retail-muted">{mediaMigration.ambiguous.length} nomes ambíguos ficaram fora da migração automática para revisão.</p>}
              {mediaMigration.failures.length > 0 && <p className="retail-access-error">{mediaMigration.failures[0]}</p>}
              {mediaMigration.safeMatches > 0 && <button className="retail-apply" disabled={mediaLoading} onClick={() => inspectMedia(true)} type="button">Migrar {mediaMigration.safeMatches} imagem(ns) segura(s)</button>}
            </>}
          </div>
        )}
      </div>
    </section>
  );
}
