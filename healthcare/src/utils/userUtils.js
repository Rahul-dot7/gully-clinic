export const generateUserNumber = (location) => {
  if (!location) return '';
  
  // Get location prefix
  const prefix = getLocationPrefix(location);
  
  // Get current date in YYMMDD format
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const date = `${year}${month}${day}`;
  
  // Get current time components for more uniqueness
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  
  // Combine all components for a unique ID
  // Format: PREFIX-YYMMDD-HHMMSSmmm
  return `${prefix}-${date}-${hours}${minutes}${seconds}${milliseconds}`;
};

export const getLocationPrefix = (location) => {
  if (!location) return '';
  
  // Map of locations to their prefixes
  const locationPrefixes = {
    'ANDHERI': 'ADH',
    'JOGESHWARI': 'JOS',
    'RAM MANDIR': 'RMA',
    'GOREGAON': 'GMN'
  };
  
  // Find the matching location (case-insensitive)
  const matchedLocation = Object.keys(locationPrefixes).find(
    loc => loc.toLowerCase() === location.toLowerCase()
  );
  
  return matchedLocation ? locationPrefixes[matchedLocation] : location.substring(0, 3).toUpperCase();
}; 