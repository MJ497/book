// Array to store hotel data
const hotels = [
    { name: "Grand Palace", amenities: ["wifi", "pool", "apartment"], image: "img/hotel1.jpg", price: "N23,000/night", rate: "4.5", location: "Murtala Mohammed Highway" },
    { name: "Ocean View", amenities: ["wifi", "gym"], image: "img/hotel2.jpg", price: "N30,000/night", rate: "4.0", location: "Lekki Beachfront" },
    { name: "Mountain Retreat", amenities: ["pool"], image: "img/hotel3.jpg", price: "N15,000/night", rate: "4.7", location: "Obudu Cattle Ranch" },
    { name: "City Lights Hotel", amenities: ["wifi", "apartment"], image: "img/hotel2.jpg", price: "N28,000/night", rate: "4.2", location: "Victoria Island" },
    { name: "Royal Haven", amenities: ["gym", "pool"], image: "img/hotel1.jpg", price: "N40,000/night", rate: "4.8", location: "Ikoyi" },
    { name: "Palm Breeze", amenities: ["wifi"], image: "img/hotel2.jpg", price: "N20,000/night", rate: "4.1", location: "Ajah" },
    { name: "Sunset Lodge", amenities: ["gym"], image: "img/hotel3.jpg", price: "N35,000/night", rate: "4.6", location: "Ibadan" },
    { name: "Oceanic Bliss", amenities: ["wifi", "gym", "apartment"], image: "img/hotel1.jpg", price: "N25,000/night", rate: "4.4", location: "Epe" },
    { name: "Green Meadows", amenities: ["pool"], image: "img/hotel1.jpg", price: "N18,000/night", rate: "4.3", location: "Akure" },
    { name: "Hilltop Inn", amenities: ["gym", "apartment"], image: "img/hotel3.jpg", price: "N50,000/night", rate: "4.9", location: "Jos" },
];

// Pagination variables
const itemsPerPage = 6; // Number of hotels per page
let currentPage = 1; // Current page number
let filteredHotels = hotels; // Default to showing all hotels

// Function to load hotels for the current page
function loadHotelsForPage(page = 1) {
    const startIndex = (page - 1) * itemsPerPage; // Calculate start index
    const endIndex = startIndex + itemsPerPage; // Calculate end index
    const hotelsToDisplay = filteredHotels.slice(startIndex, endIndex); // Get the hotels for the current page
    renderHotels(hotelsToDisplay); // Render the hotels
    renderPagination(); // Render pagination buttons
}

// Function to render hotels
function renderHotels(hotelsToDisplay) {
    const hotelList = document.getElementById("hotel-list"); // Get the hotel list container
    hotelList.innerHTML = ""; // Clear any existing content

    // Loop through the hotels array and create HTML for each
    hotelsToDisplay.forEach(hotel => {
        const card = document.createElement("div"); // Create a div for the hotel card
        card.className = "hotel-card"; // Add a CSS class for styling
        card.innerHTML = `
            <img src="${hotel.image}" alt="${hotel.name}"> <!-- Display hotel image -->
            <div class="info">
                <h3>${hotel.name}</h3> <!-- Display hotel name -->
                <p><b>Amenities:</b> ${hotel.amenities.join(", ")}</p> <!-- List hotel amenities -->
                <p><b>Price:</b> ${hotel.price}</p>
                <p><b>Ratings:</b> ${hotel.rate}<i class='bx bxs-star'></i></p>
                <p><b>Location:</b> ${hotel.location}</p>
            </div>
        `;
        hotelList.appendChild(card); // Append the card to the hotel list container
    });

    // Show message if no hotels are available for this page
    if (hotelsToDisplay.length === 0) {
        hotelList.innerHTML = "<p>No hotels available for this page.</p>";
    }
}

// Function to render pagination buttons
function renderPagination() {
    const paginationContainer = document.getElementById("pagination"); // Get pagination container
    paginationContainer.innerHTML = ""; // Clear existing buttons
    const totalPages = Math.ceil(filteredHotels.length / itemsPerPage); // Calculate total pages

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i; // Button text is the page number
        button.className = i === currentPage ? "active" : ""; // Highlight the active page
        button.onclick = () => {
            currentPage = i; // Update current page
            loadHotelsForPage(currentPage); // Reload hotels for the new page
        };
        paginationContainer.appendChild(button); // Append button to the container
    }
}

// Function to handle search input
function searchHotels() {
    const search = document.getElementById("search").value.toLowerCase(); // Get the search input value
    filteredHotels = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(search) // Filter by hotel name
    );
    currentPage = 1; // Reset to the first page after filtering
    loadHotelsForPage(currentPage); // Load the filtered hotels for the first page
    scrollToResults(); // Scroll to results section
}

// Function to filter hotels by amenities
function filterHotels() {
    const amenity = document.getElementById("amenities").value.toLowerCase(); // Get the selected amenity filter
    filteredHotels = hotels.filter(hotel =>
        amenity === "" || hotel.amenities.map(a => a.toLowerCase()).includes(amenity) // Check if the hotel matches the selected amenity
    );
    currentPage = 1; // Reset to the first page after filtering
    loadHotelsForPage(currentPage); // Load the filtered hotels for the first page
    scrollToResults(); // Scroll to results section
}

// Function to scroll to the results section
function scrollToResults() {
    const resultsSection = document.getElementById("hotel-list");
    resultsSection.scrollIntoView({ behavior: "smooth" }); // Smoothly scroll to the hotel list section
}


document.getElementById("booking-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const hotelName = document.getElementById("hotel-name").value;
    const checkInDate = document.getElementById("check-in").value;
    const checkOutDate = document.getElementById("check-out").value;
    const phoneNumber = document.getElementById("phone-number").value;
    const receiptFile = document.getElementById("receipt-upload").files[0];

    // Upload receipt to Google Drive via Apps Script
    const receiptUrl = await uploadReceipt(receiptFile);

    // Send form data to Google Apps Script Web App
    const data = {
        hotelName,
        checkInDate,
        checkOutDate,
        phoneNumber,
        receiptUrl
    };

    const response = await fetch("https://script.google.com/macros/s/AKfycby93EQp6BYOpmCOVcU9Tq2SGAgtHZaAo1S4FRSf6Fy9NgoCAmGY4GKuvju1H4zJGH7B/exec", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        
    });

    const result = await response.json();
    if (result.success) {
        alert("Booking submitted successfully!");
    } else {
        alert("There was an error submitting your booking.");
    }
});

// Function to upload receipt to Google Drive via Apps Script
async function uploadReceipt(file) {
    const formData = new FormData();
    formData.append("file", file);

    // Replace with your Google Apps Script Web App URL for receipt uploads
    const uploadUrl = "https://script.google.com/macros/s/AKfycby93EQp6BYOpmCOVcU9Tq2SGAgtHZaAo1S4FRSf6Fy9NgoCAmGY4GKuvju1H4zJGH7B/exec";

    const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    return result.fileUrl; // Return the receipt URL
}

// Load the initial page of hotels
window.onload = () => {
    loadHotelsForPage(); // Load the first page
};
