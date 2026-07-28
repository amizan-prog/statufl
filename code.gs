function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Status Inden Farmasi Logistik')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getDashboardData(sheetUrl) {
  var ss;
  
  try {
    if (sheetUrl && sheetUrl.toString().trim() !== "") {
      ss = SpreadsheetApp.openByUrl(sheetUrl.toString().trim());
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
  } catch(e) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  var sheet = ss.getSheetByName('DATA');
  if (!sheet) return []; 
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  // BACA SEHINGGA LAJUR G (7) UNTUK MENGAMBIL EMEL
  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  
  var result = data.map(function(row) {
    return {
      unit: row[0],
      drip: row[1],
      bukanUbat: row[2],
      jumTroli: row[3] === "" ? "-" : row[3],
      perluTroli: row[4] === "" ? "--" : row[4],
      emel: row[6] ? row[6].toString().trim() : "" // Lajur G
    };
  }).filter(function(row) {
    return row.unit !== ""; 
  });
  
  return result;
}

// --- FUNGSI MENGHANTAR EMEL (KINI MENERIMA EMEL SPESIFIK DARI FRONTEND) ---
function sendEmailNotification(mesejHTML, targetEmail) {
  // Jika tiada emel atau format tidak sah, berhenti
  if (!targetEmail || targetEmail.indexOf("@") === -1) return; 
  
  var tajuk = "🚨 Amaran Sistem: Perubahan Status Inden Logistik";
  
  try {
    MailApp.sendEmail({
      to: targetEmail,
      subject: tajuk,
      htmlBody: mesejHTML
    });
    Logger.log("Emel dihantar kepada: " + targetEmail);
  } catch(e) {
    Logger.log("Ralat Emel: " + e);
  }
}

function testAuth() {
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "Ujian Kebenaran", "Kebenaran berjaya!");
}
