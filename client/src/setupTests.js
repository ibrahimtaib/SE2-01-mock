import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/dom';
import '@testing-library/jest-dom';
configure({ testIdAttribute: 'data-testid' });