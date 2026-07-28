function sendToGreenAPI() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Get the exact single cell you have clicked on
  var activeCell = sheet.getActiveCell();
  var cellValue = activeCell.getValue();
  
  // Prevent sending if the cell is empty
  if (cellValue === "") {
    SpreadsheetApp.getUi().alert("❌ The selected cell is empty. Please select a cell with data.");
    return;
  }
  
  // ==========================================
  // 🔴 PASTE YOUR GREEN-API DETAILS HERE 🔴
  // ==========================================
  var idInstance = "710722681208"; 
  var apiTokenInstance = "fd6582c731ee40bfafc500b2e335f44a771cd97e3e064de7ac";
  var chatId = "120363303661998933@g.us"; // Paste your Group ID here
  // ==========================================
  
  // The message is now ONLY the exact value of the selected cell
  var message = String(cellValue);
                
  // Green-API Endpoint
  var url = "https://api.green-api.com/waInstance" + idInstance + "/sendMessage/" + apiTokenInstance;
  
  var payload = {
    "chatId": chatId,
    "message": message
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  // Send the request
  try {
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    
    if (result.idMessage) {
      SpreadsheetApp.getUi().alert("✅ Success: Cell content sent to WhatsApp Group!");
    } else {
      SpreadsheetApp.getUi().alert("❌ Error from Green-API: " + response.getContentText());
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert("❌ System Error: " + e.toString());
  }
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🟢 WhatsApp Automation')
    .addItem('Send Selected Row to Group', 'sendToGreenAPI')
    .addToUi();
}

function sendJ2ToWhatsApp() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Ambil data khusus dari sel J2
  var cellValue = sheet.getRange("J2").getValue();
  
  if (cellValue === "") {
    SpreadsheetApp.getUi().alert("❌ Sel J2 kosong. Tiada mesej dihantar.");
    return;
  }
  
  // ==========================================
  // 🔴 MASUKKAN MAKLUMAT GREEN-API ANDA 🔴
  // ==========================================
  var idInstance = "710722681208"; 
  var apiTokenInstance = "fd6582c731ee40bfafc500b2e335f44a771cd97e3e064de7ac";
  var chatId = "120363303661998933@g.us"; // ID Group anda
  // ==========================================
  
  var message = String(cellValue);
                
  var url = "https://api.green-api.com/waInstance" + idInstance + "/sendMessage/" + apiTokenInstance;
  
  var payload = {
    "chatId": chatId,
    "message": message
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    
    if (result.idMessage) {
      SpreadsheetApp.getUi().alert("✅ Berjaya: Mesej rumusan J2 telah dihantar ke WhatsApp Group!");
    } else {
      SpreadsheetApp.getUi().alert("❌ Ralat Green-API: " + response.getContentText());
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert("❌ Ralat Sistem: " + e.toString());
  }
}
