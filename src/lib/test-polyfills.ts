// This file is for testing polyfills
export function testPolyfills(): void {
  console.log('Testing polyfills...');
  
  // Test String.prototype.slice
  const testString = 'Hello, World!';
  console.log('String slice test:', testString.slice(0, 5));
  
  // Test Array.prototype.slice
  const testArray = [1, 2, 3, 4, 5];
  console.log('Array slice test:', testArray.slice(1, 3));
  
  // Test with a custom object
  const testObject = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
  };
  
  try {
    // @ts-ignore - This will be handled by our polyfill
    console.log('Object slice test:', testObject.slice(0, 2));
  } catch (error) {
    console.error('Object slice test failed:', error);
  }
  
  console.log('Polyfill tests completed');
}