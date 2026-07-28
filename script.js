// Replace with your actual Web App URL from Google Apps Script
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzZbYOYT-t7hZdLpt8feFPp2EFwORvmSFpz4Rj_Q2wNPQ32esLMAzc9FeLm0S3FLExhlQ/exec";

// ------------------------------------------------------
// Fetch Dashboard Data (GET Request)
// ------------------------------------------------------
function fetchDashboardData() {
    // Show a loading message on the screen
    document.getElementById("output").innerText = "Fetching data from Google Sheets...";

    // We add "?action=getDashboardData" so the Apps Script knows to return JSON, not HTML
    const fetchUrl = WEB_APP_URL + "?action=getDashboardData";

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Dashboard Data:", data);
            // Display the data beautifully on the HTML page
            document.getElementById("output").innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            // Display the error on the screen if something goes wrong
            document.getElementById("output").innerText = "Error: " + error;
        });
}

// ------------------------------------------------------
// Trigger Email Notification (POST Request)
// ------------------------------------------------------
function triggerEmail(targetEmail, messageHtml) {
    const payload = {
        action: "sendEmail", // This tells doPost() which if-statement to run
        targetEmail: targetEmail,
        mesejHTML: messageHtml
    };

    fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Prevents CORS errors
        },
        body: JSON.stringify(payload) 
    })
    .then(response => response.json())
    .then(data => {
        console.log("Email Response:", data);
        // Display the success message on the HTML page
        document.getElementById("output").innerText = JSON.stringify(data, null, 2);
        alert(data.message); // Shows a pop-up: "Emel berjaya dihantar..."
    })
    .catch(error => {
        console.error("Error sending email:", error);
        // Display the error on the screen if something goes wrong
        document.getElementById("output").innerText = "Error: " + error;
    });
}

// ------------------------------------------------------
// Handle Button Click for Sending Email (From HTML)
// ------------------------------------------------------
function handleSendEmail() {
    const email = document.getElementById("emailInput").value;
    const message = document.getElementById("messageInput").value;

    if (!email || !message) {
        alert("Sila masukkan emel dan mesej!");
        return;
    }

    // Show a loading message on the screen
    document.getElementById("output").innerText = "Sending email to " + email + "...";
    
    // Calls the triggerEmail function we created above
    triggerEmail(email, "<h3>Notis Inden</h3><p>" + message + "</p>");
}
