document.addEventListener('DOMContentLoaded', async () => {
    const collection = document.querySelector('.UIcollection');
    if (!collection) return;

    try {
        // 1. Fetch User Likes
        const response = await fetch('/my-likes');
        const data = await response.json();
        
        if (!data.likes || data.likes.length === 0) {
            collection.innerHTML = "<h3 style='grid-column: 1/-1; text-align: center; color: white;'>No saved components yet.</h3>";
            return;
        }

        // 2. Filter data.js based on what's in the Database
        const savedItems = UI_COMPONENTS.filter(comp => data.likes.includes(comp.name));

        // 3. Render using your data.js function
        collection.innerHTML = savedItems.map(item => generateCardHTML(item, true)).join('');

    } catch (err) {
        console.error("Error loading saved items:", err);
    }
});