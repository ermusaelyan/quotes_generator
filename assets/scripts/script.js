document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const likeBtn = document.getElementById('likeBtn');

    generateBtn.addEventListener('click', generateQuote);
    likeBtn.addEventListener('click', likeQuote);

    generateQuote();
    updateHistory();

    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', () => {
            addCategoryToLiked(category.dataset.value);
        });
    });
});


let timeoutId;

function typeText(quote, text) {
    let index = 0;

    function type() {
        quote.textContent += text[index];
        index++;
        if (index < text.length) {
            timeoutId = setTimeout(type, 65);
        }
    }

    clearTimeout(timeoutId);
    index = 0;
    quote.textContent = '';


    if (text && text.length > 0) {
        type();
    }
}

async function fetchRandomQuote(apiUrl) {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function generateQuote() {
    const likedCategories = JSON.parse(localStorage.getItem("likedCategories")) || [];
    let apiUrl = "https://api.quotable.io/random";

    if (likedCategories.length > 0) {
        apiUrl += `?tags=${likedCategories.join('|')}`;
    }

    const quoteData = await fetchRandomQuote(apiUrl);
    const quoteText = quoteData.content;
    const quoteAuthor = quoteData.author;
    const quoteCategories = quoteData.tags;

    const quote = document.getElementById("quote");
    typeText(quote, quoteText)
    document.getElementById("quoteAuthor").innerText = quoteAuthor;
    document.getElementById("quote").setAttribute("data-categories", JSON.stringify(quoteCategories));

    document.getElementById("categoriesContainer").innerHTML = "";

    quoteCategories.forEach(category => {
        const categoryElement = document.createElement("li");
        categoryElement.innerHTML = `   
                <div class="tags__tag">
                    <div class="tags__name">${category}</div>
                </div>
    `;
        categoryElement.classList.add("tags__item");
        categoryElement.setAttribute("data-value", category);
        categoryElement.addEventListener("click", () => {
            addCategoryToLiked(category);
        });
        document.getElementById("categoriesContainer").appendChild(categoryElement);
    });
}


function addCategoryToLiked(category) {
    let likedCategories = JSON.parse(localStorage.getItem("likedCategories")) || [];
    if (!likedCategories.includes(category)) {
        likedCategories.push(category);
        localStorage.setItem("likedCategories", JSON.stringify(likedCategories));
        updateHistory();
    }
}

function likeQuote() {
    const quoteText = document.getElementById("quote").innerText;
    const quoteCategories = JSON.parse(document.getElementById("quote").getAttribute("data-categories"));
    let likedQuotes = JSON.parse(localStorage.getItem("likedQuotes")) || [];

    if (!likedQuotes.includes(quoteText)) {
        likedQuotes.push(quoteText);
        localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));

        quoteCategories.forEach(category => {
            addCategoryToLiked(category);
        });

        updateHistory();
    }
    generateQuote();
}

function updateHistory() {
    const historyList = document.getElementById("history-list");
    const likedCategoriesList = document.getElementById("favoriteTagsList");
    let likedQuotes = JSON.parse(localStorage.getItem("likedQuotes")) || [];
    let likedCategories = JSON.parse(localStorage.getItem("likedCategories")) || [];

    historyList.innerHTML = "";
    likedQuotes.forEach((quote, index) => {
        const li = document.createElement("li");
        li.classList.add('history__item');
        li.innerHTML = `<div class="history__quote">${quote}</div>`;
        historyList.appendChild(li);
    });

    likedCategoriesList.innerHTML = "";
    likedCategories.forEach((category, index) => {
        const li = document.createElement("li");
        li.classList.add('tags__item');
        li.innerHTML = `
            <div class="tags__tag">
                <div class="tags__name">${category}</div>
                <div class="tags__action">
                    <button class="tags__button" onclick="deleteCategory(${index})">
                        <svg class="tags__delete-icon">
                            <use xlink:href="#delete"></use>
                        </svg>
                    </button>
                </div>
            </div>`;
        likedCategoriesList.appendChild(li);
    });
}

function deleteCategory(index) {
    let likedCategories = JSON.parse(localStorage.getItem("likedCategories")) || [];
    likedCategories.splice(index, 1);
    localStorage.setItem("likedCategories", JSON.stringify(likedCategories));
    updateHistory();
}

