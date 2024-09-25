type FormatTokenOptions = {
  symbol?: string;
};
export function formatToken(
  value: number | string,
  { symbol }: FormatTokenOptions = {},
) {
  const valueNumber = Number(value) || 0;
  const maxDigits = valueNumber >= 0.01 ? 2 : valueNumber >= 0.001 ? 3 : 4;
  const valueString = valueNumber.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  });
  return symbol ? `${valueString} ${symbol}` : valueString;
}

export function formatPercent(value: number | string) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    style: "percent",
  });
}
