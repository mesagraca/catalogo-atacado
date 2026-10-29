import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Import pure function directly for Node testing
function roundPriceToDecile(price) {
  if (price === null || price === undefined || price === "") {
    return null;
  }
  const num = typeof price === "string" ? parseFloat(price) : Number(price);
  if (isNaN(num)) {
    return null;
  }
  const rounded = Math.round(num * 10) / 10;
  return Number(rounded.toFixed(2));
}

describe('Regra de Arredondamento em Décimos para Atacado e Varejo', () => {
  it('arredonda centavos quebrados de atacado para baixo quando < .x5', () => {
    assert.equal(roundPriceToDecile(22.82), 22.80);
    assert.equal(roundPriceToDecile(14.34), 14.30);
    assert.equal(roundPriceToDecile(10.21), 10.20);
    assert.equal(roundPriceToDecile(36.03), 36.00);
  });

  it('arredonda centavos quebrados de atacado para cima quando >= .x5', () => {
    assert.equal(roundPriceToDecile(44.18), 44.20);
    assert.equal(roundPriceToDecile(16.45), 16.50);
    assert.equal(roundPriceToDecile(37.66), 37.70);
    assert.equal(roundPriceToDecile(39.75), 39.80);
    assert.equal(roundPriceToDecile(52.09), 52.10);
  });

  it('preserva preços que já estão em múltiplos de 10 centavos', () => {
    assert.equal(roundPriceToDecile(10.00), 10.00);
    assert.equal(roundPriceToDecile(15.50), 15.50);
    assert.equal(roundPriceToDecile(23.90), 23.90);
    assert.equal(roundPriceToDecile(50.10), 50.10);
  });

  it('suporta strings numéricas com casas decimais', () => {
    assert.equal(roundPriceToDecile("22.82"), 22.80);
    assert.equal(roundPriceToDecile("44.18"), 44.20);
  });

  it('retorna null para valores nulos, vazios ou indefinidos', () => {
    assert.equal(roundPriceToDecile(null), null);
    assert.equal(roundPriceToDecile(undefined), null);
    assert.equal(roundPriceToDecile(""), null);
    assert.equal(roundPriceToDecile("abc"), null);
  });
});
