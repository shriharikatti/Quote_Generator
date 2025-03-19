// Select elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteButton = document.getElementById('new-quote');
const copyButton = document.getElementById('copy-quote');
const twitterButton = document.getElementById('share-twitter');
const exportButton = document.getElementById('export-quote');

// Fetch a random quote from the API
async function fetchQuote() {
    try {
        console.log("Fetching quote...");
        const response = await fetch('https://api.freeapi.app/api/v1/public/quotes/quote/random');
        console.log("Response status:", response.status);
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("Rate limit exceeded. Please wait a moment and try again.");
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API response:", data);
        return data.data;
    } catch (error) {
        console.error("Error fetching quote:", error.message);
        return { quote: error.message, author: 'API Error' };
    }
}

// Display the quote and author
async function displayQuote() {
    newQuoteButton.disabled = true;
    const quoteData = await fetchQuote();

    quoteText.textContent = `"${quoteData.content}"`;
    quoteAuthor.textContent = `- ${quoteData.author}`;
    setTimeout(() => {
        newQuoteButton.disabled = false;
    }, 20);
}

// Load a quote when the page loads 
displayQuote();

// Add event listener for new quote button
newQuoteButton.addEventListener("click", displayQuote);

// Copy to clipboard functionality
copyButton.addEventListener('click', () => {
    const quote = quoteText.textContent;
    navigator.clipboard.writeText(quote).then(() => {
        alert('Quote copied to clipboard');
    });
});

// Share on Twitter functionality
twitterButton.addEventListener('click', () => {
    const quote = encodeURIComponent(quoteText.textContent);
    const author = encodeURIComponent(quoteAuthor.textContent);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} ${author}`;
    window.open(twitterUrl, '_blank');
});

// Export as image functionality
exportButton.addEventListener('click', () => {
    html2canvas(document.querySelector('.quote-box')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'quote.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
