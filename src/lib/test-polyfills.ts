// This file is for testing polyfills
export function testPolyfills(): void {
  console.log('Testing polyfills...');
  
  // Test String.prototype.slice
  const testString = 'Hello, World!';
  console.log('String slice test:', testString.slice(0, 5));
  
  // Test Array.prototype.slice
  const testArray = [1, 2, 3, 4, 5];
  console.log('Array slice test:', testArray.slice(1, 3));
  
  // Test with a custom object using the safe slice utility
  const testObject = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
  };
  
  try {
    if (window._safeSlice) {
      console.log('Safe slice test:', window._safeSlice(testObject, 0, 2));
    } else {
      console.warn('_safeSlice utility not available');
    }
  } catch (error) {
    console.error('Safe slice test failed:', error);
  }
  
  // Test Buffer availability
  try {
    if (window.Buffer) {
      console.log('Buffer is available');
    } else {
      console.warn('Buffer is not available on window');
    }
  } catch (error) {
    console.error('Buffer test failed:', error);
  }
  
  // Test JSON.parse
  try {
    const jsonResult = JSON.parse('{"test": "value"}');
    console.log('JSON.parse test:', jsonResult);
  } catch (error) {
    console.error('JSON.parse test failed:', error);
  }
  
  // Test Array.from
  try {
    const arrayFromResult = Array.from('test');
    console.log('Array.from test:', arrayFromResult);
  } catch (error) {
    console.error('Array.from test failed:', error);
  }
  
  console.log('Polyfill tests completed');
}