
export interface CursorPayload {
  v: string | number;
  id: string;
}

export const encodeCursor = (payload: CursorPayload): string =>
  Buffer.from(JSON.stringify(payload)).toString("base64url");

export const decodeCursor = (raw: string): CursorPayload | null => {
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString());
    if (parsed && typeof parsed.id === "string") return parsed as CursorPayload;
    return null;
  } catch {
    return null;
  }
};
