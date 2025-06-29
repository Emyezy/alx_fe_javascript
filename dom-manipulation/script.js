// Array to hold quote objects
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Cached DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteContainer = document.getElementById("addQuoteContainer");

// Initialize dropdown with unique categories
function populateCategorySelect() {
  const categories = Array.from(new Set(quotes.map(q => q.category)));

  categorySelect.innerHTML = `<option value="all">All</option>`;
  
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Show a random quote, optionally filtered by category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — [${randomQuote.category}]`;
}

// Dynamically create the Add Quote Form
function createAddQuoteForm() {
  const form = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);

  addQuoteContainer.appendChild(form);
}

// Add a new quote dynamically
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  populateCategorySelect();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// Event Listeners
newQuoteButton.addEventListener("click", showRandomQuote);

// Initial setup
populateCategorySelect();
createAddQuoteForm();
