/**
 * Utilitário oficial de precificação comercial para o Catálogo Atacado Mesa & Graça.
 *
 * @description
 * Aplica a regra corporativa mandatória de arredondamento comercial em décimos:
 * todo preço de venda de varejo e atacado deve terminar em múltiplos de 10 centavos
 * (.10, .20, .30, ..., .80, .90, .00).
 *
 * IMPORTANTE: Preços de custo industrial (cost_price) JAMAIS devem ser arredondados.
 *
 * @category Pricing
 * @since v1.2.0
 */

/**
 * Arredonda um preço comercial (varejo ou atacado) para múltiplos de 10 centavos.
 *
 * @param {number | string | null | undefined} price - Valor original do preço
 * @returns {number | null} Preço arredondado para o décimo mais próximo com 2 casas decimais, ou null se indefinido
 * @example
 * roundPriceToDecile(22.82) // 22.80
 * roundPriceToDecile(44.18) // 44.20
 * roundPriceToDecile(16.45) // 16.50
 * roundPriceToDecile(14.34) // 14.30
 */
export function roundPriceToDecile(price: number | string | null | undefined): number | null {
  if (price === null || price === undefined || price === "") {
    return null;
  }

  const num = typeof price === "string" ? parseFloat(price) : Number(price);
  if (isNaN(num)) {
    return null;
  }

  // Multiplica por 10, arredonda para o inteiro mais próximo e divide por 10
  const rounded = Math.round(num * 10) / 10;
  return Number(rounded.toFixed(2));
}
