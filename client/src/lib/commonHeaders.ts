export function commonHeaders(): HeadersInit {
    const headers: HeadersInit = {};
  
    const systemKey = import.meta.env.VITE_X_SYSTEM_KEY;
    if (systemKey) {
      headers["x-system-key"] = systemKey;
    }
  
    return headers;
  }
  