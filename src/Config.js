const constants = {
  form: {
    id: '',
  },
  slide: {
    id: '',
    page: {
      useRandom: false,
      maxValue: 9,
      pageNum: 0,
    },
    shape: {
      title: '',
    },
  },
  drive: {
    id: '',
    path: '',
    temporaryDirectory: {
      id: '',
    },
  },
  gmail: {
    dispatcher: '',
    title: '',
    defaultBody: '',
    dispatcherName: '',
  },
  spreadsheet: {
    id: '',
  },
};

function GetConstant(requestedDomain, property) {
  const domain = constants[requestedDomain];

  const nestedProperties = property.split('.');
  const result = getNestedValue(nestedProperties, domain);

  return typeof result !== 'undefined' ? result : 'not found';
}

function getNestedValue(properties, domain) {
  if (properties.length === 0) {
    return domain;
  }
  const [currentProperty, ...remainingProperties] = properties;

  if (domain.hasOwnProperty(currentProperty)) {
    return getNestedValue(remainingProperties, domain[currentProperty]);
  }

  return false;
}
