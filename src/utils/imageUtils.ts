// Image utility functions for EstateFlow

// Available property images - using actual existing files from public/properties/
export const PROPERTY_IMAGES = {
  // Default images that exist in public/properties/
  default: "/properties/1.png",
  placeholder: "/properties/1.png",
  
  // Specific property images mapped to existing files
  sitamarhi: "/properties/1.png",
  jaipur: "/properties/2.png",
  pune: "/properties/3.png",
  goa: "/properties/4.png",
  bangalore: "/properties/5.png",
  hyderabad: "/properties/6.png",
  chennai: "/properties/1.png",
  
  // Additional property mappings for actual data
  "jaipur palace": "/properties/2.png",
  "pune residency": "/properties/3.png",
  "goa beach villa": "/properties/4.png",
  "bangalore tech park": "/properties/5.png",
  "hyderabad heights": "/properties/6.png",
  "chennai marina": "/properties/1.png",
  kanchipuram: "/properties/1.png",
  indore: "/properties/2.png",
  
  // Exact matches from screenshot
  "Sitamarhi": "/properties/1.png",
  "Kanchipuram": "/properties/2.png",
  "Indore": "/properties/3.png",
  "Goa": "/properties/4.png",
  
  // Fallback to existing generic property images
  generic1: "/properties/1.png",
  generic2: "/properties/2.png",
  generic3: "/properties/3.png",
  generic4: "/properties/4.png",
};

// Store for dynamically created property images
const dynamicPropertyImages = new Map<string, string>();

// Function to store a dynamic property image
export const storeDynamicPropertyImage = (propertyName: string, imageUrl: string): void => {
  console.log(`💾 Storing dynamic image for "${propertyName}": ${imageUrl}`);
  dynamicPropertyImages.set(propertyName.toLowerCase(), imageUrl);
  
  // Also store in localStorage for persistence
  try {
    const stored = JSON.parse(localStorage.getItem('estate-flow-dynamic-images') || '{}');
    stored[propertyName.toLowerCase()] = imageUrl;
    localStorage.setItem('estate-flow-dynamic-images', JSON.stringify(stored));
  } catch (error) {
    console.error('❌ Error storing dynamic image in localStorage:', error);
  }
};

// Function to get a stored dynamic property image
export const getDynamicPropertyImage = (propertyName: string): string | null => {
  // First check in-memory cache
  const cached = dynamicPropertyImages.get(propertyName.toLowerCase());
  if (cached) {
    console.log(`🖼️ Found dynamic image in cache for "${propertyName}": ${cached}`);
    return cached;
  }
  
  // Then check localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('estate-flow-dynamic-images') || '{}');
    const storedImage = stored[propertyName.toLowerCase()];
    if (storedImage) {
      console.log(`🖼️ Found dynamic image in localStorage for "${propertyName}": ${storedImage}`);
      // Cache it in memory
      dynamicPropertyImages.set(propertyName.toLowerCase(), storedImage);
      return storedImage;
    }
  } catch (error) {
    console.error('❌ Error reading dynamic images from localStorage:', error);
  }
  
  return null;
};

// Function to get a valid image path for a property
export const getPropertyImage = (propertyName: string, customImageUrl?: string): string => {
  console.log(`🖼️ getPropertyImage called with: propertyName="${propertyName}", customImageUrl="${customImageUrl}"`);
  
  // If a custom image URL is provided and it's valid, use it
  if (customImageUrl && customImageUrl.startsWith('http')) {
    console.log(`🖼️ Using custom HTTP URL: ${customImageUrl}`);
    return customImageUrl;
  }
  
  // If a custom image URL is provided and it's a local path, use it
  if (customImageUrl && customImageUrl.startsWith('/')) {
    console.log(`🖼️ Using custom local path: ${customImageUrl}`);
    return customImageUrl;
  }
  
  // Check for dynamically stored images first
  const dynamicImage = getDynamicPropertyImage(propertyName);
  if (dynamicImage) {
    console.log(`🖼️ Using dynamic image: ${dynamicImage}`);
    return dynamicImage;
  }
  
  // Try to find a specific image for the property
  const normalizedName = propertyName.toLowerCase().trim();
  console.log(`🖼️ Normalized property name: "${normalizedName}"`);
  
  // First, try exact match
  if (PROPERTY_IMAGES[normalizedName as keyof typeof PROPERTY_IMAGES]) {
    console.log(`🖼️ Found exact match: ${PROPERTY_IMAGES[normalizedName as keyof typeof PROPERTY_IMAGES]}`);
    return PROPERTY_IMAGES[normalizedName as keyof typeof PROPERTY_IMAGES];
  }
  
  // Try to find partial matches
  for (const [key, value] of Object.entries(PROPERTY_IMAGES)) {
    if (key !== 'default' && key !== 'placeholder' && key !== 'generic1' && key !== 'generic2' && key !== 'generic3' && key !== 'generic4') {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        console.log(`🖼️ Found partial match: "${key}" -> ${value}`);
        return value;
      }
    }
  }
  
  // Use a generic image based on property name hash
  const hash = propertyName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const genericIndex = Math.abs(hash) % 4 + 1;
  const genericImage = PROPERTY_IMAGES[`generic${genericIndex}` as keyof typeof PROPERTY_IMAGES] || PROPERTY_IMAGES.default;
  console.log(`🖼️ Using generic image: ${genericImage}`);
  return genericImage;
};

// Function to get a placeholder image for new properties
export const getPlaceholderImage = (): string => {
  return PROPERTY_IMAGES.placeholder;
};

// Function to validate if an image URL is accessible
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Function to get a fallback image if the main image fails to load
export const getFallbackImage = (propertyName: string): string => {
  return getPropertyImage(propertyName);
};

// Function to clear all dynamic images (useful for testing)
export const clearDynamicImages = (): void => {
  console.log('🗑️ Clearing all dynamic images');
  dynamicPropertyImages.clear();
  localStorage.removeItem('estate-flow-dynamic-images');
};

// Function to list all stored dynamic images
export const listDynamicImages = (): Record<string, string> => {
  try {
    const stored = JSON.parse(localStorage.getItem('estate-flow-dynamic-images') || '{}');
    console.log('📋 Dynamic images stored:', stored);
    return stored;
  } catch (error) {
    console.error('❌ Error reading dynamic images:', error);
    return {};
  }
};
