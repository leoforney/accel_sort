const ffi = require('ffi-napi');
const ref = require('ref-napi');
const ArrayType = require('ref-array-di')(ref);
const fs = require('fs');
const path = require('path');

 let myLib = ffi.Library('cmake-build-debug/libaccel_sort.so', {
  'sortIntegers': ['void', ['pointer', 'int']],
   'sortFloats': ['void', ['pointer', 'int']]
 });

function generateRandomIntegers(n) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * n));
}

function generateRandomFloats(n) {
    return Array.from({ length: n }, () => Math.random() * n);
}

function benchmarkIntegers(n) {
    return new Promise((resolve, reject) => {
        let array = generateRandomIntegers(n);
        let copy = array.slice();

        // CPU sort
        let start = process.hrtime.bigint();
        copy.sort((a, b) => a - b);
        let end = process.hrtime.bigint();
        console.log(`CPU sort (integers): ${(end - start) / 1000000n} ms`);
            let cpuTime = end - start;

        // GPU sort
        start = process.hrtime.bigint();
        let intArray = Int32Array.from(array);
        let buffer = Buffer.from(intArray.buffer);
        myLib.sortIntegers(buffer, n);
        end = process.hrtime.bigint();
        let gpuTime = end - start;
        console.log(`GPU sort (integers): ${(end - start) / 1000000n} ms`);
        resolve({cpuTime: cpuTime, gpuTime: gpuTime});
    });
}

function benchmarkFloats(n) {
    return new Promise((resolve, reject) => {
        let array = generateRandomFloats(n);
        let copy = array.slice();

        // CPU sort
        let start = process.hrtime.bigint();
        copy.sort((a, b) => a - b);
        let end = process.hrtime.bigint();
        console.log(`CPU sort (floats): ${(end - start) / 1000000n} ms`);
        let cpuTime = end - start;

        // GPU sort for floats
        start = process.hrtime.bigint();
        let floatArray = Float32Array.from(array);
        let buffer = Buffer.from(floatArray.buffer);
        myLib.sortFloats(buffer, n);
        end = process.hrtime.bigint();
        console.log(`GPU sort (floats): ${(end - start) / 1000000n} ms`);
        let gpuTime = end - start;
        resolve({cpuTime: cpuTime, gpuTime: gpuTime});
    });
}

async function runBenchmarks() {
    const results = [['Array Size', 'CPU Sort (Integers) ms', 'GPU Sort (Integers) ms', 'CPU Sort (Floats) ms', 'GPU Sort (Floats) ms']];
    // Start with 1,000 integers/floats and go up to the maximum you want to test, doubling each time
    for (let n = 10; n <= Number.MAX_SAFE_INTEGER; n = Math.round(n * 5 / 4)) {
        const resultIntegers = await benchmarkIntegers(n);
        const resultFloats = await benchmarkFloats(n);
        // Combine the results for integers and floats
        const combinedResults = [n, resultIntegers.cpuTime, resultIntegers.gpuTime, resultFloats.cpuTime, resultFloats.gpuTime];
        results.push(combinedResults);
        console.log(`Benchmarked ${n} elements.`);
    }

    // Save results to a CSV file
    const csvContent = results.map(e => e.join(",")).join("\n");
    fs.writeFileSync(path.join(__dirname, 'results.csv'), csvContent);
    console.log('Results saved to results.csv');
}

runBenchmarks().catch(console.error);