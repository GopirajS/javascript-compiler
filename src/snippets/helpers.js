// Helper functions for JavaScript Compiler

export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function debug(...values) {
  console.log('---');
  values.forEach((value, index) => {
    const type = getType(value);
    
    console.log(`[${index + 1}] Type: ${type}`);
    
    switch (type) {
      case 'Object':
        console.log('Value:', value);
        console.log('Keys:', Object.keys(value));
        break;
      case 'Array':
        console.log('Value:', value);
        console.log('Length:', value.length);
        break;
      case 'Map':
        console.log('Value:');
        value.forEach((val, key) => {
          console.log(`  ${key}: ${val}`);
        });
        break;
      case 'Set':
        console.log('Value:');
        value.forEach(val => {
          console.log(`  ${val}`);
        });
        break;
      case 'Null':
        console.log('Value:', null);
        break;
      case 'Undefined':
        console.log('Value:', undefined);
        break;
      case 'Function':
      case 'AsyncFunction':
      case 'GeneratorFunction':
        console.log('Value:', value.toString());
        break;
      case 'Error':
        console.log('Message:', value.message);
        console.log('Stack:', value.stack);
        break;
      default:
        console.log('Value:', value);
    }
    console.log('---');
  });
}
