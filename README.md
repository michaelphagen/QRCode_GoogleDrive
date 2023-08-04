# QRCode_GoogleDrive

A Google App Script Web app for uploading files and creating QR codes to share them

## How to use

1. Create a new Google App Script Web App and copy the contents of this repo into it (you can use [clasp](https://developers.google.com/apps-script/guides/clasp) for this).
2. Deploy the script from the Deploy menu (you may want to set the web app to be accessible by anyone, depending on your use case).
3. (Optional) If you want to change the root folder that the files and QR codes will be stored in, set the ID of the folder in the `rootFolder` variable in `env.js`.
4. Open the web app and test uploading a file.
5. Check that the file was uploaded to the specified folder (QRCode_GoogleDrive/Files in the user's Google Drive root folder by default), and that the QR Code works (it can be found in QRCode_GoogleDrive/QR Codes by default).
6. If you want to have the files accessable to everyone, make sure to set that folder's permission to viewable to anyone with the link in google drive. You can do this by right clicking on the folder and selecting "Get shareable link" and then changing the permissions to "Anyone with the link can view".

