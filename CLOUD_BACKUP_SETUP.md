# ELECTRICAL QC 360 — Google Cloud Backup Setup

This prototype can keep a local browser copy and send snapshots to Google Drive/Sheets through a Google Apps Script Web App.

## 1. Create the Google Apps Script endpoint
1. Visit https://script.google.com while signed into the Google account that should own the backups.
2. Create a new project and name it **ELECTRICAL QC 360 Cloud Backup**.
3. Copy the complete contents of `google-apps-script/Code.gs` from this repository and paste into the editor, replacing the starter code.
4. Save the project.

## 2. Deploy
1. Select **Deploy → New deployment**.
2. Select type **Web app**.
3. Description: `ELECTRICAL QC 360 backup endpoint`.
4. Execute as: **Me**.
5. Who has access: **Anyone** (the prototype endpoint is unauthenticated; use only with test data until access controls are added).
6. Deploy and grant Google Drive/Sheets permissions.
7. Copy the Web app URL ending in `/exec`.

## 3. Configure the app
1. Open ELECTRICAL QC 360.
2. Navigate to **Nube y respaldos**.
3. Paste the Web app URL into the endpoint field.
4. Tap **Guardar configuración**.
5. Tap **Enviar respaldo ahora**. Records are also sent when the app's local persist function runs.

## What is saved
Each submission creates a timestamped JSON snapshot in a Drive folder named **ELECTRICAL QC 360 - Backups**, and adds a row to a spreadsheet named **ELECTRICAL QC 360 - Backup Index** with record counts and a Drive file URL.

## Limitations / security
- This endpoint is a prototype and has no authentication or access control. Do not use it with sensitive data until access restrictions are implemented.
- Browser cross-origin requests use a no-cors mode, so the app cannot reliably confirm the server response. Verify the new file and index row in Google Drive/Sheets.
- LocalStorage remains a browser-side copy; the Drive JSON snapshot is the cloud backup.
- Use test records until cloud backup has been verified end-to-end.
