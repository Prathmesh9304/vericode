export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath;
    }
    // Assuming backend is on localhost:3000
    // In production, this should come from an env var like import.meta.env.VITE_API_URL
    return `http://localhost:3000/${imagePath}`;
};
