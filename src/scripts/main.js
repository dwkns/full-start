import "alpinejs";
import {getLCP, getFID, getCLS} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);

console.log('done');