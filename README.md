# QRCode_GoogleDrive

A Google App Script Web app for uploading files and creating QR codes to share them

## How to use

1. Create a new Google App Script Web App and copy the contents of this repo into it (you can use [clasp](https://developers.google.com/apps-script/guides/clasp) for this).
2. Deploy the script from the Deploy menu (you may want to set the web app to be accessible by anyone, depending on your use case).
3. (Optional) If you want to change the root folder that the files and QR codes will be stored in, set the ID of the folder in the `rootFolderID` variable in Script Properties (in the "Project Settings" menu of the script editor).
4. Open the web app and test uploading a file. The Id of the upload should be a base64 encoded string at the end of the url after `afs=` (e.g. `https://script.google.com/macros/s/.../exec?afs=MQ==`) when id is 1 (MQ== is 1 encoded in base64). A Google Apps Script for base64 encoding in a google sheet is included in the repo ('spreadsheet.js'), based on [this joshuatz post](https://joshuatz.com/posts/2019/google-sheets-quick-start-with-base64/)
5. Check that the file was uploaded to the specified folder (QRCode_GoogleDrive/Files in the user's Google Drive root folder by default), and that the QR Code works (it can be found in QRCode_GoogleDrive/QR Codes by default).
6. If you want to have the files accessable to everyone, make sure to set that folder's permission to viewable to anyone with the link in google drive. You can do this by right clicking on the folder and selecting "Get shareable link" and then changing the permissions to "Anyone with the link can view".

## Donate

If you find this project useful and you would like to donate toward on-going development you can use the link below. Any and all donations are much appreciated!

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/michaelphagen)
