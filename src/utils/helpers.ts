const generateFriendlyId = (username: string) => {
    const prefix = username.slice(0,2)
    const rand = [] 
    while(rand.length < 6) {
        rand.push(Math.floor(Math.random() * 6))
    }
    return `${prefix}-${rand.join("")}`
}
function sentenceCase(field: string): string {
    return field
        .replace(/([A-Z])/g, " $1")   // insert space before capital letters
        .replace(/^./, str => str.toUpperCase()); // capitalize first letter
}

// Haversine Formula 
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371; // Radius of the earth in km
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
		Math.cos(lat2 * (Math.PI / 180)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in km
}

export const formatDate = (year?: number, month?: string): string => {
  if (!year) return 'Unknown date';
  
  if (month) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  }
  
  return year.toString();
};


export { generateFriendlyId, sentenceCase, getDistanceFromLatLonInKm }