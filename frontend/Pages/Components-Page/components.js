// INITIALIZATION
async function initUI() {
    const collection = document.querySelector('.UIcollection');
    if (!collection) return;

    try {
        // 1. Fetch User Data & Likes
        const authRes = await fetch('/check-auth');
        const authData = await authRes.json();
        
        let likedNames = [];
        if (authData.loggedIn) {
            const likesRes = await fetch('/my-likes');
            const likesData = await likesRes.json();
            likedNames = (likesData.likes || []).map(name => name.trim());
        }

        // 2. Identify the Page
        const isFavPage = window.location.pathname.toLowerCase().includes('favourites');

        // 3. Filter items for Favourites page, or show all for Main page
        const itemsToRender = isFavPage 
            ? UI_COMPONENTS.filter(item => likedNames.includes(item.name.trim())) 
            : UI_COMPONENTS;

        // 4. Render the HTML
        if (itemsToRender.length === 0) {
            collection.innerHTML = `<h3 style="grid-column: 1/-1; text-align: center; margin-top: 50px;">
                ${isFavPage ? "No saved items yet." : "No components found."}
            </h3>`;
        } else {
            collection.innerHTML = itemsToRender.map(item => {
                const isLiked = likedNames.some(dbName => 
                    dbName.trim().toLowerCase() === item.name.trim().toLowerCase()
                );
                return generateCardHTML(item, isLiked);
            }).join('');
        }

        // 5. Initialize Search/Filters & Pro Access 
        setupSearchAndFilters();
        checkProAccess(authData);

    } catch (err) {
        console.error("Initialization failed:", err);
    }
}

// TOGGLE LIKE FUNCTION
async function toggleLike(iconElement, itemName) {
    try {
        const res = await fetch('/like-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `itemName=${encodeURIComponent(itemName)}`
        });

        if (res.status === 401) {
            alert("Please log in to save components!");
            return;
        }

        const data = await res.json();
        const isFavPage = window.location.pathname.toLowerCase().includes('favourites');

        if (data.status === "unliked") {
            if (isFavPage) {
                const card = iconElement.closest('.itemCard');
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 300);
            } else {
                iconElement.classList.replace('fa-solid', 'fa-regular');
                iconElement.classList.remove('active');
            }
        } else {
            iconElement.classList.replace('fa-regular', 'fa-solid');
            iconElement.classList.add('active');
        }
    } catch (err) {
        console.error("Like toggle failed:", err);
    }
}

// SEARCH & FILTER LOGIC
function setupSearchAndFilters() {
    const searchInput = document.querySelector('.searchInput');
    const filterContainer = document.querySelector('.componentLinks');
    const cards = document.querySelectorAll('.itemCard');

    // SEARCH FILTER
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();

            cards.forEach(card => {
                const category = (card.getAttribute('dataname') || '').toLowerCase();

                if (category.includes(query)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            refreshAOS();
        });
    }

    // CATEGORY FILTER
filterContainer.addEventListener('click', (event) => {
    const btn = event.target;
    if (!btn.classList.contains('component')) return;

    event.preventDefault?.();

    const scrollY = window.scrollY; 
    document.querySelector('.menuActive')?.classList.remove('menuActive');
    btn.classList.add('menuActive');

    const filter = btn.getAttribute('dataname');

    cards.forEach(card => {
        const cardCat = card.getAttribute('dataname');

        if (filter === 'all' || cardCat === filter) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    setTimeout(() => {
        if (window.AOS) {
            AOS.refresh();
        }

        window.scrollTo(0, scrollY); 
    }, 50);
});
}

function refreshAOS() {
    setTimeout(() => {
        if (window.AOS) {
            AOS.refreshHard();
        }
    }, 50);
}

// initialize
setupSearchAndFilters();

// PRO BLUR LOGIC
function checkProAccess(authData) {
    const codeArea = document.querySelector('.code-content');
    const codeWrapper = document.querySelector('.code-wrapper');
    if (!codeArea || !codeWrapper) return;

    if (authData.loggedIn && authData.isPaid) {
        codeArea.classList.remove('blurred');
        document.querySelector('.unlock-overlay')?.remove();
    } else {
        codeArea.classList.add('blurred');
        if (!document.querySelector('.unlock-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'unlock-overlay';
            overlay.innerHTML = `
                <i class="fa-solid fa-lock"></i>
                <p>This is a PRO component</p>
                <button class="unlock-btn" onclick="window.location.href='/frontend/Pages/Subscription-Page/payment.html'">
                    Unlock with Pro
                </button>`;
            codeWrapper.appendChild(overlay);
        }
    }
}

document.addEventListener('DOMContentLoaded', initUI);

// Force the page to refresh data when navigating back/forward
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        console.log("Page loaded from cache, re-initializing UI...");
        initUI(); 
    }
});



//remove the below if removing animations
function renderComponents(itemsToRender) {
    const collection = document.querySelector('.UIcollection');
    
    // 1. Generate the HTML
    collection.innerHTML = itemsToRender.map((item, index) => {
        const isLiked = checkIfLiked(item.name); // Your existing like logic
        return generateCardHTML(item, isLiked, index);
    }).join('');

    // 2. CRITICAL: Refresh AOS so it "sees" the new cards
    if (window.AOS) {
        AOS.refresh();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Select elements
    const filterChips = document.querySelectorAll(".component");
    const itemCards = document.querySelectorAll(".itemCard");

    // 2. Check URL for filter (e.g., components.html?filter=buttons)
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get('filter');

    // 3. Function to apply the filter
    const applyFilter = (category) => {
        // Update active class on chips
        filterChips.forEach(chip => {
            if (chip.getAttribute("dataName") === category) {
                chip.classList.add("menuActive");
            } else {
                chip.classList.remove("menuActive");
            }
        });

        // Show/Hide Cards
        itemCards.forEach(card => {
            const cardCategory = card.getAttribute("dataname");
            if (category === "all" || cardCategory === category) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    };

    // 4. Run filter on page load if parameter exists
    if (initialFilter) {
        applyFilter(initialFilter);
    }

    // 5. Add click listeners for manual filtering on this page
    filterChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const category = chip.getAttribute("dataName");
            applyFilter(category);
        });
    });
});