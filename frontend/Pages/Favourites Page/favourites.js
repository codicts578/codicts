document.addEventListener('DOMContentLoaded', async () => {
    const favoriteContainer = document.querySelector('.UIcollection');

    try {
        const res = await fetch('/my-likes');
        const data = await res.json();
        const likedNames = data.likes;

        if (!likedNames || likedNames.length === 0) {
            favoriteContainer.innerHTML = "<h3>No saved components.</h3>";
            return;
        }

        // Filter master list (UI_COMPONENTS from your data.js)
        const userFavorites = UI_COMPONENTS.filter(item => likedNames.includes(item.name));

        // Render cards with 'true' passed to generateCardHTML so hearts start as FILLED
        favoriteContainer.innerHTML = userFavorites
            .map(item => generateCardHTML(item, true)) 
            .join('');

    } catch (err) {
        console.error("Error loading favorites:", err);
    }
});