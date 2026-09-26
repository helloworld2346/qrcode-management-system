export const vnToISO = (vn: string): string => {
  if (!vn) return "";
  const [d, m, y] = vn.split("/");
  if (!d || !m || !y) return "";
  return `${y}-${m}-${d}`;
};

export const isoToVN = (iso: string): string => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
};
