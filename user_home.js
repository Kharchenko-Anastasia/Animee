// script.js

document.addEventListener('DOMContentLoaded', () => {
    const applyFilterBtn = document.getElementById('apply-filter');
    const resetFilterBtn = document.getElementById('reset-filter');
    const yearFilter = document.getElementById('year-range');
    const genreFilter = document.getElementById('genre-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Initialize year range slider
    $(yearFilter).slider({
        range: true,
        min: 1950,
        max: new Date().getFullYear(),
        values: [2000, new Date().getFullYear()],
        slide: function (event, ui) {
            document.getElementById('year-values').innerText = `${ui.values[0]} - ${ui.values[1]}`;
        }
    });
    document.getElementById('year-values').innerText = `${$(yearFilter).slider('values', 0)} - ${$(yearFilter).slider('values', 1)}`;

    function filterAnime() {
        const yearRange = $(yearFilter).slider('values');
        const genre = genreFilter.value;
        const type = typeFilter.value;
        const searchQuery = searchInput.value.toLowerCase();

        const animeItems = document.querySelectorAll('.anime-item, .anime-item-new');

        animeItems.forEach(item => {
            const itemYear = parseInt(item.getAttribute('year-filter'));
            const itemGenre = item.getAttribute('genre-filter').split(' ');
            const itemType = item.getAttribute('type-filter');
            const itemTitle = item.querySelector('h2').innerText.toLowerCase();

            const yearMatch = itemYear >= yearRange[0] && itemYear <= yearRange[1];
            const genreMatch = genre === 'all' || itemGenre.includes(genre);
            const typeMatch = type === 'all' || itemType === type;
            const searchMatch = itemTitle.includes(searchQuery);

            if (yearMatch && genreMatch && typeMatch && searchMatch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    applyFilterBtn.addEventListener('click', filterAnime);
    searchButton.addEventListener('click', filterAnime);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            filterAnime();
        }
    });

    resetFilterBtn.addEventListener('click', () => {
        genreFilter.value = 'all';
        typeFilter.value = 'all';
        searchInput.value = '';
        $(yearFilter).slider('values', [2000, new Date().getFullYear()]);
        document.getElementById('year-values').innerText = `${2000} - ${new Date().getFullYear()}`;
        filterAnime();
    });
});

