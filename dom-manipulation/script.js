let quotes = [];

// Cached DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const addQuoteContainer = document.getElementById("addQuoteContainer");

// Load quotes from local storage or defaults
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to predict the future is to invent it.", category: "Motivation" },
      { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];
    saveQuotes();
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
}

// Populate category dropdown for filtering
function populateCategories() {
  const categories = Array.from(new Set(quotes.map(q => q.category)));

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategoryFilter");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategoryFilter", selectedCategory);

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
  } else {
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.textContent = `"${randomQuote.text}" — [${randomQuote.category}]`;
  }
}

// Show a random quote (respects filter)
function showRandomQuote() {
  filterQuotes();
}

// Add Quote Form
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

// Add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  saveQuotes();
  postQuoteToServer({ text: quoteText, category: quoteCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// Export quotes as JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (e) {
      alert('Error parsing JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Function to fetch quotes from server and handle syncing using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    let conflicts = false;

    serverQuotes.forEach(serverQuote => {
      if (!quotes.some(q => q.text === serverQuote.text)) {
        quotes.push(serverQuote);
        conflicts = true;
      }
    });

    if (conflicts) {
      saveQuotes();
      alert("New quotes received from server and added to your list.");
    } else {
      showNotification("Quotes synced with server!");
    }
  } catch (error) {
    console.log("Failed to fetch from server (simulated).");
  }
}

// ✅ Function to post a new quote to the server (simulated)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (response.ok) {
      console.log("Quote posted to server successfully (simulated).");
    } else {
      console.log("Failed to post quote to server.");
    }
  } catch (error) {
    console.log("Error posting to server (simulated).");
  }
}

// ✅ Function to manually sync quotes (calls fetchQuotesFromServer)
function syncQuotes() {
  fetchQuotesFromServer();
}

// ✅ Notification for user feedback
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "10px";
  notification.style.right = "10px";
  notification.style.backgroundColor = "#4caf50";
  notification.style.color = "white";
  notification.style.padding = "10px";
  notification.style.borderRadius = "5px";
  notification.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialization
loadQuotes();
populateCategories();
createAddQuoteForm();
filterQuotes();

newQuoteButton.addEventListener("click", showRandomQuote);

// Periodic server sync every 20 seconds
setInterval(fetchQuotesFromServer, 20000);
