/** ELECTRICAL QC 360 - Google Apps Script backup endpoint.
 * Deploy as Web App: Execute as Me; access Anyone.
 * Receives JSON snapshots and stores a JSON file in Drive plus an index row in Sheets.
 */
const BACKUP_FOLDER_NAME = 'ELECTRICAL QC 360 - Backups';
const INDEX_SHEET_NAME = 'ELECTRICAL QC 360 - Backup Index';

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({app:'ELECTRICAL QC 360',status:'endpoint-ready'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!body.snapshot) throw new Error('Missing snapshot');
    const folder = getOrCreateFolder_(BACKUP_FOLDER_NAME);
    const stamp = new Date();
    const fileName = 'QC360_BACKUP_' + Utilities.formatDate(stamp, Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss') + '.json';
    const file = folder.createFile(fileName, JSON.stringify(body, null, 2), MimeType.JSON);
    const ss = getOrCreateIndexSheet_(folder);
    const sh = ss.getSheetByName('Backups') || ss.insertSheet('Backups');
    if (sh.getLastRow() === 0) sh.appendRow(['Fecha','Archivo','URL Drive','Proyectos','Inspecciones','Checklists guardados','Pruebas','No conformidades','Liberaciones']);
    const s = body.snapshot;
    sh.appendRow([stamp, fileName, file.getUrl(), (s.projects||[]).length, (s.inspections||[]).length, Object.keys(s.checkstate||{}).length, (s.tests||[]).length, (s.ncs||[]).length, (s.releases||[]).length]);
    return ContentService.createTextOutput(JSON.stringify({ok:true,file:fileName,url:file.getUrl()})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
function getOrCreateFolder_(name) {
  const it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}
function getOrCreateIndexSheet_(folder) {
  const it = DriveApp.getFilesByName(INDEX_SHEET_NAME);
  if (it.hasNext()) return SpreadsheetApp.open(it.next());
  const ss = SpreadsheetApp.create(INDEX_SHEET_NAME);
  const f = DriveApp.getFileById(ss.getId());
  folder.addFile(f);
  try { DriveApp.getRootFolder().removeFile(f); } catch(e) {}
  return ss;
}