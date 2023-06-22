const SHEET_TO_FORM_OFFSET = 2;

/** @returns {SpreadsheetApp.Sheet} */
function openSheetFile() {
  try {
    const fileId = GetConstant(DOMAIN_SPREADSHEET, 'id');
    /** @type {SpreadsheetApp.Spreadsheet} */
    const spreadsheet = SpreadsheetApp.openById(fileId);
    if (!spreadsheet) {
      throw new Error('Failed to retrieve sheet file.');
    }
    /** @type {SpreadsheetApp.Sheet} */
    const sheet = spreadsheet.getActiveSheet();
    if (!sheet) {
      throw new Error('Failed to retrieve active sheet.');
    }
    return sheet;
  } catch (error) {
    throw new Error('Error opening sheet file: ' + error.message);
  }
}

/** @returns {SpreadsheetApp.Range} */
function getSentColumn(sheet, numResponses) {
  try {
    const len = numResponses + 1; // removing header
    const sentColumn = sheet.getRange(1, sheet.getLastColumn(), len);
    if (!sentColumn) {
      throw new Error('Failed to retrieve sent column.');
    }
    return sentColumn;
  } catch (error) {
    throw new Error('Error getting sent column: ' + error.message);
  }
}

/** @returns {Array<Number>} */
function checkSentColumn(column, numCells) {
  try {
    let needToSend = [];
    // the row 1 is the header
    for (let row = 2; row < numCells; row++) {
      /** @type {SpreadsheetApp.Range} */
      const activeCell = column.getCell(row, 1);
      const activeCellValue = activeCell.getValue();
      if (activeCellValue === '') {
        needToSend.push(row - SHEET_TO_FORM_OFFSET);
      }
    }
    return needToSend;
  } catch (error) {
    throw new Error('Error checking sent column: ' + error.message);
  }
}

/** @returns {Array<Number>} */
function markAsSentByIndex(column, indexes) {
  try {
    const editedValues = indexes.filter((idx) => {
      const row = idx + SHEET_TO_FORM_OFFSET;
      /** @type {SpreadsheetApp.Range} */
      const activeCell = column.getCell(row, 1);
      activeCell.setValue('Sent');
      // if the value is successfully set to "Sent", we should remove from the array
      if (activeCell.getValue() === 'Sent') {
        return false;
      }
      return true;
    });
    return editedValues;
  } catch (error) {
    throw new Error('Error marking as sent: ' + error.message);
  }
}
