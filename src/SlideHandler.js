/** @returns {SlidesApp.Presentation} */
function openSlideFile(fileId) {
  try {
    const slide = SlidesApp.openById(fileId);
    if (!slide) {
      throw new Error('Failed to retrieve slide file.');
    }
    return slide;
  } catch (error) {
    throw new Error('Error opening slide file: ' + error.message);
  }
}

/**
 * @param {SlidesApp.Presentation} temporarily slide
 * @returns {SlidesApp.Page}
 */
function getSlidePage(slide) {
  try {
    const shouldRandomize = GetConstant(DOMAIN_SLIDE, 'page.useRandom');
    let pageNumber;

    if (shouldRandomize) {
      const max = GetConstant(DOMAIN_SLIDE, 'page.maxValue');
      pageNumber = Math.floor(Math.random() * max);
    } else {
      const page = GetConstant(DOMAIN_SLIDE, 'page.pageNum');
      pageNumber = Number(page);
    }

    console.log('PAGE_NUMBER:', pageNumber);

    /** @type {Array<SlideApp.Slide>} */
    const slides = slide.getSlides();
    if (pageNumber < 0 || pageNumber >= slides.length) {
      throw new Error('Invalid slide page number.');
    }

    // const slidePage = slides[pageNumber];
    let slidePage;

    slides.forEach((slide, i) => {
      if (i + 1 !== pageNumber) slide.remove();
      else slidePage = slide;
    });

    if (!slidePage) {
      throw new Error('Failed to retrieve slide page.');
    }

    return slidePage;
  } catch (error) {
    throw new Error('Error getting slide page: ' + error.message);
  }
}

/**
 * @param {SlidesApp.Page} slidePage
 * @param {string} title
 * @returns {SlidesApp.Shape}
 */
function getEditableShape(slidePage, title) {
  try {
    const shapes = slidePage.getShapes();
    const shape = shapes.find((sh) => sh.getTitle() === title);
    if (!shape) {
      throw new Error(`Shape with title "${title}" not found.`);
    }
    return shape;
  } catch (error) {
    throw new Error('Error getting editable shape: ' + error.message);
  }
}

/**
 * @param {SlidesApp.Shape} shape
 * @param {string} message
 * @returns {boolean}
 */
function setTextOnSlide(shape, message) {
  try {
    const textRange = shape.getText();
    textRange.setText(message);
    if (textRange.getText() !== message) {
      throw new Error('Failed to set text on the shape.');
    }
    return true;
  } catch (error) {
    throw new Error('Error setting text on the shape: ' + error.message);
  }
}
