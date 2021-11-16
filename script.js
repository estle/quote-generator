const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const TwitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const element404 = document.getElementById('element404');
let stopAPIifError = 0;
let lastTenQuotes = [];

function showLoadingSpinner() {
    element404.hidden = true;
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    quoteContainer.hidden = false;
    loader.hidden = true;
}

// Get Quote From API
async function getQuote() {
    showLoadingSpinner();
    const proxyUrl = 'https://young-crag-79902.herokuapp.com/';
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        if (lastTenQuotes.indexOf(data.quoteText) !== -1) {
            console.log('IT WORKS!', lastTenQuotes.length);
            throw new Error();
        }
        if (data.quoteAuthor === '') {
            authorText.innerHTML = 'Unknown Author';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // Reduce font size for long quotes
        if (data.quoteText.length > 50) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }        
        quoteText.innerText = data.quoteText;
        if (lastTenQuotes.length >= 100) {
            lastTenQuotes.shift();
            lastTenQuotes.push(data.quoteText);
        } else {
            lastTenQuotes.push(data.quoteText);
        }
        stopAPIifError = 0;
        removeLoadingSpinner();
    } catch (error) {
        stopAPIifError += 1;
        if (stopAPIifError >= 25) {
            window.stop();
            Error404();
            return;
        }
        getQuote();
        console.log('whoops, no quote', error);        
    }
}

// Stop the Page
function Error404() {
    element404.hidden = false;
    quoteContainer.hidden = true;
    loader.hidden = true;
}

// Tweet Quode
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
TwitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();