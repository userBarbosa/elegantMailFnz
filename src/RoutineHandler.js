const DOMAIN_SPREADSHEET = 'spreadsheet';
const DOMAIN_SLIDE = 'slide';
const DOMAIN_MAIL = 'gmail';
const DOMAIN_FORM = 'form';
const DOMAIN_DRIVE = 'drive';

function executeRoutine() {
  try {
    const form = openFormFile();
    const sheet = openSheetFile();

    const needToSendIndexes = getNeedToSendIndexes(form, sheet);

    /** @type {Array<emailParams>} */
    const list = needToSendIndexes.reduce((accumulator, currentIndex) => {
      const params = getResponseItemsFromIndex(form, currentIndex);
      accumulator.push(params);
      return accumulator;
    }, []);

    const sentEmailList = list.map((item, index) => {
      try {
        const tempSlide = getTemporarySlide();
        const slidePage = getSlidePage(tempSlide);

        const editableTitle = GetConstant(DOMAIN_SLIDE, 'shape.title');
        const shape = getEditableShape(
          slidePage,
          `${editableTitle}_${key.toUpperCase()}`
        );

        for (const [key, value] of Object.entries(item)) {
          setSlideContents(key, value, shape);
        }

        const blob = generateImageBlob(fileId);
        // send e-mail
        sendEmail(item, blob);
        // remove temp file
        deleteTempFile(fileId);
        return index;
      } catch (error) {
        throw new Error('Error sending the email: ' + error.message);
      }
    });

    const filteredIndexes = needToSendIndexes.filter((_, index) => {
      return sentEmailList.some((sentIndex) => sentIndex === index);
    });

    try {
      setSent(form, sheet, filteredIndexes);
      // mark as sent
    } catch (error) {
      throw new Error('Error marking as sent: ' + error.message);
    }
  } catch (error) {
    throw new Error('Error executing the routine: ' + error.message);
  }
}

function getNeedToSendIndexes(form, sheet) {
  const totalResponses = getResponsesLength(form);
  const sentColumn = getSentColumn(sheet, totalResponses);
  const needToSend = checkSentColumn(sentColumn, totalResponses);
  return needToSend;
}

function setSent(form, sheet, indexes) {
  const totalResponses = getResponsesLength(form);
  const sentColumn = getSentColumn(sheet, totalResponses);
  const sent = markAsSentByIndex(sentColumn, indexes);
  return sent;
}

function setSlideContents(key, value, shape) {
  try {
    if (key === 'sender') {
      if (!value) {
        value = getNameByEmail(value);
      } else {
        value = 'Anônimo (=';
      }
    } else if (key === 'recipient') {
      value = getNameByEmail(value);
    }

    const wasSetTextOnSlide = setTextOnSlide(shape, value);
    return wasSetTextOnSlide;
  } catch (error) {
    throw new Error('Error setting slide content: ' + error.message);
  }
}

function generateImageBlob(fileId) {
  try {
    const slideFile = getFileOnDrive(fileId);
    const blob = getFileBlob(slideFile);
    return blob;
  } catch (error) {
    throw new Error('Error generating image blob: ' + error.message);
  }
}

function getTemporarySlide() {
  try {
    const originalSlideFileId = GetConstant(DOMAIN_SLIDE, 'id');
    const originalSlide = getFileOnDrive(originalSlideFileId);
    const tempSlideId = writeTempSlideFile(originalSlide);
    const tempSlide = openSlideFile(tempSlideId);
    return tempSlide;
  } catch (error) {
    throw new Error('Error getting temporary slide: ' + error.message);
  }
}
