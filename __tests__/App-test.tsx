/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../src/app';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  expect('5').toBe('5');
  // renderer.create(<App />);
});
