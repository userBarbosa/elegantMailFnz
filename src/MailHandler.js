/**
 * @param {emailParams} param
 * @param {Blob} blob
 */
function sendEmail(param, blob) {
  try {
    const title = GetConstant(DOMAIN_MAIL, 'title');
    const dispatcher = GetConstant(DOMAIN_MAIL, 'dispatcher');
    const dispatcherName = GetConstant(DOMAIN_MAIL, 'dispatcherName');

    const eletronicMailBlob = blob.setName('eletronicMailBlob');

    const html = `<body>
      <div style="text-align: center">
        <p>You received a message! \o/</p>
        <img src="cid:eletronicMail" alt="${param.message}" />
      </div>
    </body>`;

    const options = {
      htmlBody: html,
      inlineImages: { eletronicMail: eletronicMailBlob },
      bcc: param.sender,
      from: dispatcher,
      replyTo: dispatcher,
      name: dispatcherName,
    };

    GmailApp.sendEmail(param.receiver, title, '', options);
  } catch (error) {
    throw new Error('Error sending email: ' + error.message);
  }
}

function getNameByEmail(email) {
  try {
    const atSignIndex = email.indexOf('@');
    if (atSignIndex === -1) {
      throw new Error('Invalid email');
    }
    const firstEmailPart = email.substring(0, atSignIndex);
    const nameParts = firstEmailPart.split('.');
    const fullName = nameParts
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(' ');
    return fullName;
  } catch (error) {
    throw new Error('Error getting name by email: ' + error.message);
  }
}
