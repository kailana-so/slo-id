const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  
  function success(pos: GeolocationPosition) {
    const { latitude, longitude, accuracy } = pos.coords;
    return { latitude, longitude, accuracy };
  }
  
  function error(err: GeolocationPositionError) {
    return new Error(`Geolocation error: ${err.message}`);
  }
  
  export const getLocation = (): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
}> =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not available'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(success(pos)),
      (err) => reject(error(err)),
      options
    );
  });
  