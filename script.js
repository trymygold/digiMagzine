/**
 * Jewels-AI Digital Magazine Engine - Dynamic Google Sheets Version
 * This script fetches data from your Google Sheet and generates slides.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Your Google Sheet ID
    const sheetID = '1wDtOpjqphcZWfJODSlLH52N4X5ukS4DXXrLbTSH4Od8';
    
    // We use the Visualization API URL to get a clean JSON response
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

    console.log("Connecting to Jewels-AI Database...");

    fetch(url)
        .then(res => res.text())
        .then(data => {
            // Remove the Google API's protective prefix: /* google.visualization.Query.setResponse(...); */
            const jsonString = data.substring(47).slice(0, -2);
            const json = JSON.parse(jsonString);
            const rows = json.table.rows;
            
            const swiperWrapper = document.getElementById('magazine-wrapper');
            swiperWrapper.innerHTML = ''; // Remove the initial 'Loading' slide

            rows.forEach((row, index) => {
                /**
                 * DATA MAPPING FROM YOUR SHEET:
                 * Column A (0): Product Name
                 * Column B (1): Description
                 * Column C (2): Image URL (Direct Link)
                 * Column D (3): Product ID (For AR logic)
                 */
                const name = row.c[0] ? row.c[0].v : 'Luxury Jewelry';
                const description = row.c[1] ? row.c[1].v : 'A masterpiece of elegance and design.';
                const imageUrl = row.c[2] ? row.c[2].v : '';
                const id = row.c[3] ? row.c[3].v : `item_${index}`;

                // Only create a slide if there is an image URL present
                if (imageUrl) {
                    const slideHTML = `
                        <div class="swiper-slide" style="background-image: url('${imageUrl}');">
                            <div class="overlay"></div>
                            <div class="content">
                                <h1 class="magazine-title">${name}</h1>
                                <p class="description">${description}</p>
                                <button class="btn-try-on" 
                                        data-product-id="${id}" 
                                        data-product-name="${name}">
                                    Try This Set
                                </button>
                            </div>
                        </div>`;
                    swiperWrapper.insertAdjacentHTML('beforeend', slideHTML);
                }
            });

            // 2. Initialize Swiper Engine after the slides are injected
            initializeSwiper();
        })
        .catch(err => {
            console.error("Connection Error:", err);
            document.getElementById('magazine-wrapper').innerHTML = `
                <div class="swiper-slide" style="background-color: #0b0b0b; display: flex; align-items: center; justify-content: center;">
                    <p style="color: white; font-family: 'Lato';">Unable to load collection. Please ensure the Google Sheet is public.</p>
                </div>`;
        });
});

/**
 * Initialize the Swiper Engine with Luxury Flip Effect
 */
function initializeSwiper() {
    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: false,
        speed: 1000,
        grabCursor: true,
        effect: 'creative',
        creativeEffect: {
            prev: {
                shadow: true,
                translate: ['-20%', 0, -1],
            },
            next: {
                translate: ['100%', 0, 0],
            },
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        mousewheel: true,
        keyboard: { enabled: true },
    });

    // Handle the AR Try-On Button Clicks (using event delegation)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-try-on')) {
            const id = e.target.getAttribute('data-product-id');
            const name = e.target.getAttribute('data-product-name');
            launchAREngine(e.target, id, name);
        }
    });
}

/**
 * Launch AR Engine Trigger
 */
function launchAREngine(button, id, name) {
    const originalText = button.innerHTML;
    button.innerHTML = "Opening Mirror...";
    button.style.opacity = "0.7";

    // Simulate connection to AR Mirror
    setTimeout(() => {
        alert(`✨ JEWELS-AI MIRROR ✨\n\nPreparing AR view for: ${name}\n(ID: ${id})\n\nPlease ensure your camera is ready.`);
        button.innerHTML = originalText;
        button.style.opacity = "1";
    }, 1200);
}