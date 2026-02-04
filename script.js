/**
 * JEWELRY MAGAZINE CORE ENGINE
 * Fetches data from Google Sheets and builds the UI
 */

// 1. CONFIGURATION
// Replace this with your Google Sheets "Published as CSV" link
const SHEET_CONFIG = {
    CSV_URL: 'PASTE_YOUR_CSV_URL_HERE',
    FALLBACK_IMAGE: 'https://via.placeholder.com/500x500?text=Image+Unavailable'
};

/**
 * Main function to initialize the magazine
 */
async function initMagazine() {
    const container = document.getElementById('magazine');

    // Use PapaParse library to fetch and parse the CSV
    Papa.parse(SHEET_CONFIG.CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            if (results.data && results.data.length > 0) {
                renderProducts(results.data);
            } else {
                showError("The Google Sheet appears to be empty.");
            }
        },
        error: function(err) {
            console.error("Sheet Fetch Error:", err);
            showError("Could not connect to Google Sheets. Ensure you have 'Published to Web' as a CSV.");
        }
    });
}

/**
 * Creates the HTML for each row in your spreadsheet
 */
function renderProducts(products) {
    const container = document.getElementById('magazine');
    container.innerHTML = ''; // Remove the 'Loading' text

    products.forEach((item) => {
        // Skip rows that don't have a Name
        if (!item.Name) return;

        // Build the HTML structure exactly as per the screenshot layout
        const productCard = document.createElement('article');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <div class="image-split">
                <div class="img-wrapper">
                    <img src="${item.JewelryURL || SHEET_CONFIG.FALLBACK_IMAGE}" 
                         onerror="this.src='${SHEET_CONFIG.FALLBACK_IMAGE}'" 
                         alt="${item.Name} Jewelry">
                    <span class="label">Jewelry Image</span>
                </div>
                <div class="img-wrapper">
                    <img src="${item.ModelURL || SHEET_CONFIG.FALLBACK_IMAGE}" 
                         onerror="this.src='${SHEET_CONFIG.FALLBACK_IMAGE}'" 
                         alt="Model View">
                    <span class="label">AI Model Image</span>
                </div>
            </div>
            
            <div class="content">
                <h2>${item.Name}</h2>
                <p class="description">${item.Description || 'Exquisite piece from our royal collection.'}</p>
                
                <div class="footer-row">
                    <div class="price">Price: ${item.Price || 'On Request'}</div>
                    
                    ${item.VTO_URL ? `
                        <a href="${item.VTO_URL}" target="_blank" class="vto-btn">
                            <span class="vto-icon">😊</span> TRY IT ON!
                        </a>
                    ` : '<span style="color:#999; font-style:italic;">Try-on unavailable</span>'}
                </div>
            </div>
        `;

        container.appendChild(productCard);
    });
}

/**
 * Simple error display helper
 */
function showError(message) {
    const container = document.getElementById('magazine');
    container.innerHTML = `
        <div style="text-align:center; padding: 50px; color: #721c24;">
            <h3>Oops!</h3>
            <p>${message}</p>
        </div>
    `;
}

// Start the process when the page is loaded
window.addEventListener('DOMContentLoaded', initMagazine);