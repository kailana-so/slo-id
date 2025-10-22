export type GeolocationResult = {
  latitude: number;
  longitude: number;
  accuracy: number;   // meters (95% CI)
  timestamp: number;  // ms epoch
};

function toResult(p: GeolocationPosition): GeolocationResult {
  const { latitude, longitude, accuracy } = p.coords;
  return { latitude, longitude, accuracy, timestamp: p.timestamp };
}

function getBestFixWithin({
  timeoutMs = 15000,
  desiredAccuracy = 50,
  highAccuracy = true,
}: {
  timeoutMs?: number;
  desiredAccuracy?: number;
  highAccuracy?: boolean;
}): Promise<GeolocationResult> {
  if (typeof window === 'undefined' || !('geolocation' in navigator) || !window.isSecureContext) {
    return Promise.reject(new Error('Geolocation requires HTTPS/localhost and navigator.geolocation.'));
  }

  return new Promise<GeolocationResult>((resolve, reject) => {
    let best: GeolocationResult | undefined;
    let settled = false;

    const opts: PositionOptions = { enableHighAccuracy: highAccuracy, maximumAge: 0, timeout: timeoutMs };

    const clearAll = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      navigator.geolocation.clearWatch(watchId);
    };
    const finishResolve = (value: GeolocationResult) => { clearAll(); resolve(value); };
    const finishReject  = (err: unknown)              => { clearAll(); reject(err); };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const fix = toResult(pos);
        if (!best || fix.accuracy < best.accuracy) best = fix;
        if (fix.accuracy <= desiredAccuracy) finishResolve(fix);
      },
      (err) => finishReject(err),
      opts
    );

    const timer = setTimeout(() => {
      if (best) {
        // TS: best is GeolocationResult here
        finishResolve(best);
      } else {
        finishReject(new Error('Geolocation timeout without any fixes'));
      }
    }, timeoutMs);
  });
}

// Public API unchanged
export async function getGeolocation(): Promise<GeolocationResult> {
  try {
    const precise = await getBestFixWithin({ timeoutMs: 12000, desiredAccuracy: 75, highAccuracy: true });
    if (Date.now() - precise.timestamp < 60_000) return precise;
    throw new Error('Stale precise fix');
  } catch {
    const coarse = await getBestFixWithin({ timeoutMs: 6000, desiredAccuracy: 500, highAccuracy: false });
    return coarse;
  }
}
