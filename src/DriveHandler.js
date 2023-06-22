function getFileOnDrive(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    return file;
  } catch (error) {
    throw new Error('Error getting file from Drive: ' + error.message);
  }
}

function getTemporaryDir() {
  try {
    const tempDir = GetConstant(DOMAIN_DRIVE, 'temporaryDirectory.id');
    let folder;
    try {
      folder = DriveApp.getFolderById(tempDir);
    } catch (exception) {
      throw new Error('ERROR: Folder not found - ' + exception.message);
    }
    // fallback using folder name:
    if (folder === undefined) {
      const tempDirName = GetConstant(DOMAIN_DRIVE, 'temporaryDirectory.name');
      try {
        folder = DriveApp.getFoldersByName(tempDirName).next();
      } catch (exception) {
        throw new Error('ERROR: Folder not found - ' + exception.message);
      }
    }
    // still not found, should we use createFolder method?
    return folder;
  } catch (error) {
    throw new Error('Error in getTemporaryDir: ' + error.message);
  }
}

/** @returns {Blob} */
function getFileBlob(file) {
  try {
    const blob = file.getBlob();
    if (!(blob instanceof Blob)) {
      throw new Error('Invalid Blob');
    }
    return blob;
  } catch (error) {
    throw new Error('Error getting Blob from file: ' + error.message);
  }
}

/** @param {DriveApp.File} file */
function writeTempSlideFile(file) {
  try {
    const folder = getTemporaryDir();
    const tempFile = folder.createFile(
      `temp_${new Date().getTime()}.png`,
      file.getBlob()
    );
    return tempFile.getId();
  } catch (error) {
    throw new Error('Error writing temporary slide file: ' + error.message);
  }
}

function deleteTempFile(fileId) {
  try {
    const tempFile = getFileOnDrive(fileId);
    tempFile.setTrashed(true);
    return tempFile.isTrashed();
  } catch (error) {
    throw new Error('Error deleting temporary file: ' + error.message);
  }
}
