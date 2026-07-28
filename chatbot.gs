// ==========================================
// GREEN API CONFIGURATION
// ==========================================
const ID_INSTANCE = "710722681208"; 
const API_TOKEN_INSTANCE = "fd6582c731ee40bfafc500b2e335f44a771cd97e3e064de7ac"; 

/** 
 * Handles incoming webhooks from Green API 
 */
function doPost(e) {
  // Safeguard: Check if 'e' exists (prevents errors if run manually in the editor)
  if (typeof e === 'undefined') {
    return ContentService.createTextOutput("Sila uji webhook ini melalui WhatsApp, bukan melalui butang 'Run' di editor.");
  }

  try {
    // Parse the incoming webhook payload
    const payload = JSON.parse(e.postData.contents);
    
    // Check if the webhook is for an incoming message
    if (payload.typeWebhook === "incomingMessageReceived") {
      const chatId = payload.senderData.chatId;
      const messageType = payload.messageData.typeMessage;
      
      // Only process text messages
      if (messageType === "textMessage") {
        const rawMessage = payload.messageData.textMessageData.textMessage.trim();
        const upperMessage = rawMessage.toUpperCase();
        
        // Check if the message starts with "STAT " (case-insensitive)
        if (upperMessage.startsWith("STAT ")) {
          
          // Extract the unit name by removing the first 5 characters ("STAT ")
          const unitName = upperMessage.substring(5).trim();
          
          if (unitName !== "") {
            // Get the status response from the sheet
            const responseMessage = getUnitStatus(unitName);
            
            // Send the reply back to the user
            sendMessage(chatId, responseMessage);
          } else {
            // If they just typed "stat" without a unit name
            sendMessage(chatId, "Sila masukkan nama unit. Contoh format: *STAT W5A*");
          }
        }
      }
    }
  } catch (err) {
    Logger.log("Error processing webhook: " + err.toString());
  }
  
  // Return a success response to Green API
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** 
 * Searches the "DATA" sheet for the requested Unit 
 */
function getUnitStatus(unitName) {
  // Gunakan ID Google Sheet anda secara terus supaya webhook tidak keliru
  const sheetId = "1m6D6POkxoEGPr0n8X4N2xv3nC5j0rxvsML02tGkK1to"; 
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName("DATA");
  
  if (!sheet) {
    return "⚠️ Ralat: Helaian 'DATA' tidak dijumpai di dalam Google Sheet.";
  }
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const currentUnit = String(row[0]).trim().toUpperCase();
    
    if (currentUnit === unitName) {
      const statusDrip = row[1] || "Tiada Maklumat";
      const statusBukanUbat = row[2] || "Tiada Maklumat";
      const jumlahTroli = row[3] !== "" ? row[3] : "0";
      const perluTroli = row[4] || "Tidak";
      
      let reply = `*📊 STATUS INDEN UNIT: ${unitName}*\n\n`;
      reply += `💧 *Status Inden Drip:* ${statusDrip}\n`;
      reply += `📦 *Status Inden Bukan Ubat:* ${statusBukanUbat}\n`;
      reply += `🛒 *Jumlah Troli:* ${jumlahTroli}\n`;
      reply += `❓ *Perlu Troli?:* ${perluTroli}\n\n`;
      reply += `_Sila hubungi PIC jika terdapat sebarang pertanyaan._`;
      return reply;
    }
  }
  
  let reply = `❌ Unit *"${unitName}"* tidak dijumpai.\n\n`;
  reply += `Sila hantar nama unit yang betul (Contoh: *STAT ICU*, *STAT W5A*, *STAT CSSD*).`;
  return reply;
}

/** 
 * Sends a WhatsApp message via Green API 
 */
function sendMessage(chatId, message) {
  const url = `https://api.green-api.com/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN_INSTANCE}`;
  
  const payload = {
    chatId: chatId,
    message: message
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}
