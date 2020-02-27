// Find Icons Here: https://fontawesome.com/icons?d=gallery&m=free
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowRight, faArrowLeft, faUserCircle, faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

// Loads these into the bundle for use by the <FontAwesomeIcon> tag
library.add(faArrowRight);
library.add(faArrowLeft);
library.add(faUserCircle);
library.add(faQuestionCircle);

module.exports = library;
