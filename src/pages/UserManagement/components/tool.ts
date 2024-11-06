export function str2int(v: any): number {
  // v 不能取0
  if (!v || Number.isNaN(parseInt(v))) {
    return undefined as any;
  }
  return parseInt(v);
}

export function int2str(v: number | string | undefined) {
  if (!v || Number.isNaN(parseInt(v as string))) {
    return undefined as any;
  }
  return String(parseInt(v as string));
}
