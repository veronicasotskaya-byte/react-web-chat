for (var i = 0; i < 3; i++) {
    let j = i;
    console.log('Instatly', i); 
    setTimeout(() => console.log('Delayed', i, j), 1000);
} 
console.log('After loop, not executed', i);