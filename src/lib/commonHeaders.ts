export function commonHeaders(): HeadersInit {
    const headers: HeadersInit = {};
  
    const systemKey = process.env.NEXT_PUBLIC_X_SYSTEM_KEY;
    if (systemKey) {
      headers["x-system-key"] = systemKey;
    }
  
    return headers;
  }
  