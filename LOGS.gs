function onEdit(e) {
  if (!e) return;
  
  var sheet = e.source.getActiveSheet();
  
  // Hanya pantau perubahan dalam sheet 'DATA'
  if (sheet.getName() !== 'DATA') return;
  
  var range = e.range;
  var col = range.getColumn();
  var row = range.getRow();
  
  // Hanya rekod jika perubahan berlaku pada lajur B (STATUS INDEN DRIP) atau C (STATUS INDEN BUKAN UBAT) dan bukan pada baris tajuk (row 1)
  if ((col === 2 || col === 3) && row > 1) {
    var logsSheet = e.source.getSheetByName('LOGS');
    if (!logsSheet) return;
    
    var timestamp = new Date(); // Masa dan tarikh
    var unit = sheet.getRange(row, 1).getValue(); // Ambil nama UNIT dari lajur A
    var fieldChanged = (col === 2) ? "DRIP" : "BUKAN UBAT";
    
    // Dapatkan nilai lama dan baru
    var oldValue = e.oldValue !== undefined ? e.oldValue : "Kosong";
    var newValue = e.value !== undefined ? e.value : "Dikosongkan";
    
    // Dapatkan emel pengguna yang edit
    var user = Session.getActiveUser().getEmail(); 
    
    // --- PERUBAHAN BARU DI SINI ---
    // Masukkan baris kosong baru di baris ke-2 (di bawah tajuk)
    logsSheet.insertRowBefore(2);
    
    // Masukkan data ke dalam baris ke-2 yang baru dibuat
    logsSheet.getRange(2, 1, 1, 6).setValues([[timestamp, unit, fieldChanged, oldValue, newValue, user]]);
  }
}
