function openFormFile() {
  try {
    const formId = GetConstant(DOMAIN_FORM, 'id');
    const form = FormApp.openById(formId);
    if (!form) {
      throw new Error('Failed to retrieve form file.');
    }
    return form;
  } catch (error) {
    throw new Error('Error opening form file: ' + error.message);
  }
}

/** @returns {Number} */
function getResponsesLength(formFile) {
  try {
    /** @type {Array<FormApp.FormResponse>} */
    const allResponses = formFile.getResponses();
    return allResponses.length;
  } catch (error) {
    throw new Error('Error getting responses length: ' + error.message);
  }
}

function getResponseItemsFromIndex(formFile, index) {
  try {
    /** @type {Array<FormApp.FormResponse>} */
    const allResponses = formFile.getResponses();
    // index = allResponses.length - 1; //to grab lastResponse
    const currentResponse = allResponses[index];
    if (!currentResponse) {
      throw new Error('Did not find the response at the specified index.');
    }
    const currentResponseItems = currentResponse.getItemResponses();
    const senderEmail = currentResponse.getRespondentEmail();
    const responseObject = buildResponseObject(
      currentResponseItems,
      senderEmail
    );
    Logger.log(responseObject);
    return responseObject;
  } catch (error) {
    throw new Error(
      'Error getting response items from index: ' + error.message
    );
  }
}

function buildResponseObject(response, email) {
  try {
    const [
      recipientResponse,
      messageResponse,
      identifyColumnResponse,
      senderResponse,
    ] = response;

    const shouldIdentify =
      typeof identifyColumnResponse === 'string' &&
      identifyColumnResponse.includes('Pode falar');

    return {
      recipient: recipientResponse.getResponse(),
      message: messageResponse.getResponse(),
      shouldIdentify: shouldIdentify,
      sender: shouldIdentify ? senderResponse.getResponse() : undefined,
    };
  } catch (error) {
    throw new Error('Error building response object: ' + error.message);
  }
}

/**
 * @typedef {object} emailParams
 * @property {string} recipient
 * @property {string} message
 * @property {boolean} shouldIdentify
 * @property {string | undefined} sender
 */
