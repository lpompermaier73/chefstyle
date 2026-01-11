// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    loadRecipes();
    setupNavigation();
});

function loadRecipes() {
    const recipeGrid = document.getElementById('recipeGrid');
    if (!recipeGrid) return;

    // Load featured recipes (first 6)
    const featuredRecipes = recipesDatabase.slice(0, 6);
    
    featuredRecipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        recipeGrid.appendChild(card);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('a');
    card.href = `recipe.html?id=${recipe.id}`;
    card.className = 'recipe-card';
    
    card.innerHTML = `
        <div class="recipe-image">${recipe.emoji}</div>
        <div class="recipe-content">
            <div class="recipe-category">${recipe.category}</div>
            <h3 class="recipe-title">${recipe.title}</h3>
            <p class="recipe-excerpt">${recipe.excerpt}</p>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time}</span>
                <span>👤 ${recipe.servings}</span>
            </div>
        </div>
    `;
    
    return card;
}

function setupNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Logo click goes to home
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
}

// Recipe search functionality
function searchRecipes(query) {
    query = query.toLowerCase();
    return recipesDatabase.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.category.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
    );
}

// Get recipe by ID
function getRecipeById(id) {
    return recipesDatabase.find(recipe => recipe.id === parseInt(id));
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.searchRecipes = searchRecipes;
    window.getRecipeById = getRecipeById;
}