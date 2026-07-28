// Replace with your actual Web App URL from Google Apps Script
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzZbYOYT-t7hZdLpt8feFPp2EFwORvmSFpz4Rj_Q2wNPQ32esLMAzc9FeLm0S3FLExhlQ/exec";

// ------------------------------------------------------
// Fetch Dashboard Data (GET Request)
// ------------------------------------------------------
function fetchDashboardData() {
    document.getElementById("output").innerText = "Fetching data from Google Sheets...";
    
    // Show a loading message inside the table
    const tbody = document.getElementById("dataTableBody");
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-primary fw-bold py-4">Memuat turun data... Sila tunggu.</td></tr>';

    const fetchUrl = WEB_APP_URL + "?action=getDashboardData";

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Dashboard Data:", data);
            document.getElementById("output").innerText = "Data berjaya dimuat turun!\n\n" + JSON.stringify(data, null, 2);
            
            // Clear the table body
            tbody.innerHTML = "";

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4">Tiada data dijumpai.</td></tr>';
                return;
            }

            // Loop through the data and create a table row for each item
            data.forEach(row => {
                const tr = document.createElement("tr");
                
                tr.innerHTML = `
                    <td class="fw-bold">${row.unit}</td>
                    <td>${row.drip}</td>
                    <td>${row.bukanUbat}</td>
                    <td class="text-center">${row.jumTroli}</td>
                    <td>${row.emel}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("output").innerText = "Error: " + error;
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4">Ralat memuat turun data. Sila periksa System Logs.</td></tr>';
        });
}

// ------------------------------------------------------
// Trigger Email Notification (POST Request)
// ------------------------------------------------------
function triggerEmail(targetEmail, messageHtml) {
    const payload = {
        action: "sendEmail", 
        targetEmail: targetEmail,
        mesejHTML: messageHtml
    };

    fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify(payload) 
    })
    .then(response => response.json())
    .then(data => {
        console.log("Email Response:", data);
        document.getElementById("output").innerText = JSON.stringify(data, null, 2);
        
        // Show a nice Bootstrap alert-style popup
        alert("✅ " + data.message); 
        
        // Clear the form inputs after sending
        document.getElementById("emailInput").value = "";
        document.getElementById("messageInput").value = "";
    })
    .catch(error => {
        console.error("Error sending email:", error);
        document.getElementById("output").innerText = "Error: " + error;
        alert("❌ Ralat menghantar emel!");
    });
}

// ------------------------------------------------------
// Handle Button Click for Sending Email (From HTML)
// ------------------------------------------------------
function handleSendEmail() {
    const email = document.getElementById("emailInput").value;
    const message = document.getElementById("messageInput").value;

    if (!email || !message) {
        alert("⚠️ Sila masukkan emel dan mesej!");
        return;
    }

    document.getElementById("output").innerText = "Sending email to " + email + "...";
    
    triggerEmail(email, "<h3>Notis Inden Farmasi Logistik</h3><p>" + message + "</p><br><hr><small>Ini adalah mesej janaan komputer.</small>");
}
