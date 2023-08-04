// This app creates a webpage that asks for an ID and file upload, then uploads the file to a new google drive folder with that ID as the name.
// It then generates a QR code linking to that folder and puts that in another folder, and puts the links to both, along with the ID, in a google sheet.

// This app uses the following APIs:
// Google Drive API
// Google Sheets API
// Google QR Code API

function doGet(e) {
    var code = e.parameter["afs"]
    if (e.parameter["afs"]){
      html=HtmlService.createTemplateFromFile('Index')
      html.id = Utilities.newBlob(Utilities.base64Decode(e.parameter["afs"])).getDataAsString();
      console.log(html.id)
    return html.evaluate();
    }
  }

function formSubmit(form) {
if (form.myFile.length > 0) {
    var file = form.myFile;
    var id=form.id;
    return upload(id, file);
    }
else {
    return "Please upload a file.";
    }
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
    }

function structure() {
    // Create the following structure:
    // Root
    // - Files
    // - - ID1
    // - - ID2
    // - - ID3 (etc.)
    // - QR Codes
    // - - ID1.png
    // - - ID2.png
    // - - ID3.png (etc.)
    // - Sheet

    // Get rootFolder from environment variable (properties service)
    var rootFolderID = PropertiesService.getScriptProperties().getProperty('rootFolderID');
    // If rootFolderID isn't specified, use root directory of google drive
    if (rootFolderID == null) {
        root = DriveApp.getRootFolder();
    }
    else {
        root = DriveApp.getFolderById(rootFolderID);
    }
    // Create Files folder if it doesn't exist
    var filesFolder = root.getFoldersByName("Files");
    if (filesFolder.hasNext()) {
        filesFolder = filesFolder.next();
    }
    else {
        filesFolder = root.createFolder("Files");
    }
    // Create QR Codes folder if it doesn't exist
    var qrCodeFolder = root.getFoldersByName("QR Codes");
    if (qrCodeFolder.hasNext()) {
        qrCodeFolder = qrCodeFolder.next();
    }
    else {
        qrCodeFolder = root.createFolder("QR Codes");
    }
    // Create Sheet if it doesn't exist
    var sheet = root.getFilesByName("Sheet");
    if (sheet.hasNext()) {
        sheet = sheet.next();
    }
    else {
        // Create sheet inside root
        sheet = SpreadsheetApp.create("Sheet");
        // Move sheet to root
        var file = DriveApp.getFileById(sheet.getId());
        root.addFile(file);
        DriveApp.getRootFolder().removeFile(file);
        // Get sheet again
        sheet = root.getFilesByName("Sheet").next();
    }
    return [filesFolder, qrCodeFolder, sheet.getId()];
}


function uploadFiles(title, file) {
    console.log("Uploading file")
    console.log("Title: " + title)
    console.log("File: " + file)

    // Confirm file is a reasonable size (less than 10MB)
    if (file.size > 10000000) {
        return "File too large. Please upload a file less than 10MB.";
        }
    // Check if folder already exists, and if not, create it
    filesFolder = structure()[0];
    var folder;
    var folders=filesFolder.getFoldersByName(title);
    if (folders.hasNext()) {
        folder = folders.next();
        // Delete all files in folder
        var files = folder.getFiles();
        while (files.hasNext()) {
            files.next().setTrashed(true);
            }
        }
    else {
        folder = filesFolder.createFolder(title);
        }
    // Upload file and QR code to folder
    var file = folder.createFile(file);
    // Rename file to id
    file.setName(title);
    return folder.getId();
    }

    function createQR(title, folderID){
        console.log("Creating QR code")
        var qrCodeFolder = structure()[1];
        // If QR code already exists, pass the url
        var qrCodes = qrCodeFolder.getFilesByName(title);
        if (qrCodes.hasNext()) {
            return qrCodes.next().getUrl();
        }
        // If QR code doesn't exist, create it
        var qr = UrlFetchApp.fetch("https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://drive.google.com/drive/folders/" + folderID + "&choe=UTF-8");
        var qrFile = qrCodeFolder.createFile(qr.getBlob());
        qrFile.setName(title);
        return qrFile.getUrl();
    }

    function upload(title, file) {
        console.log("Uploading file")
        console.log("Title: " + title)
        console.log("File: " + file)
        var folderID = uploadFiles(title, file);
        if (folderID != "File too large. Please upload a file less than 10MB.") {
            var qrURL = createQR(title, folderID);
            updateSheet(title, folderID, qrURL);
            return "File uploaded successfully";
            }
        else {
            return "File too large. Please upload a file less than 10MB.";
        }
    }

    function updateSheet(title, folderID, qrURL) {
        console.log("Updating sheet")
        console.log("Title: " + title)
        console.log("Folder ID: " + folderID)
        console.log("QR URL: " + qrURL)
        var sheetID = structure()[2];
        var sheet = SpreadsheetApp.openById(sheetID);
        var sheet = sheet.getSheets()[0];
        var data = sheet.getDataRange().getValues();
        // See if ID already exists in sheet
        for (var i = 0; i < data.length; i++) {
            if (data[i][0] == title) {
                // If so, update the row
                data[i][1] = folderID;
                data[i][2] = qrURL;
                sheet.getRange(i + 1, 1, 1, 3).setValues([data[i]]);
                return;
            }
        }
        // If not, add a new row
        sheet.appendRow([title, folderID, qrURL]);
    }

