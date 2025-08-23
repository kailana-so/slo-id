type GeolocationResult = { 
  latitude: number; 
  longitude: number; 
  accuracy: number;
};

const coarseOpts: PositionOptions  = { enableHighAccuracy: false, timeout: 15000, maximumAge: 0   }; // force fresh
const preciseOpts: PositionOptions = { enableHighAccuracy: true,  timeout: 20000, maximumAge: 0 };

function getPosition(opts: PositionOptions): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy }),
      (err: GeolocationPositionError) => reject(err),
      opts
    );
  });
}

/** Take coarse if good enough; escalate quickly; fall back if precise times out. */
export async function getGeolocation(): Promise<GeolocationResult> {
  if (!window.isSecureContext) throw new Error('Geolocation requires HTTPS or localhost.');

  try {
    const coarse = await getPosition(coarseOpts);
    if (coarse.accuracy <= 300) return coarse;      // accept decent coarse
    try {
      const precise = await getPosition(preciseOpts);
      return precise.accuracy < coarse.accuracy ? precise : coarse;
    } catch {
      return coarse; // precise failed; keep coarse
    }
  } catch (err) {
    const error = err as GeolocationPositionError;
    if (error?.code === 1){
      throw error
    };                      // PERMISSION_DENIED → bail
    // Retry with precise in case coarse timed out/unavailable
    return getPosition(preciseOpts);
  }
}
