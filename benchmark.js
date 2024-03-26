const fs = require('fs');
const path = require('path');
const AccelSort = require("./index");

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
        AccelSort.sortIntegers(buffer, n);
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
        AccelSort.sortFloats(buffer, n);
        end = process.hrtime.bigint();
        console.log(`GPU sort (floats): ${(end - start) / 1000000n} ms`);
        let gpuTime = end - start;
        resolve({cpuTime: cpuTime, gpuTime: gpuTime});
    });
}

async function runBenchmarks() {
    const results = [['Array Size', 'CPU Sort (Integers) ms', 'GPU Sort (Integers) ms', 'CPU Sort (Floats) ms', 'GPU Sort (Floats) ms']];
    for (let n = 5; n <= 100000000; n = Math.round(n * 3 / 2)) {
        const resultIntegers = await benchmarkIntegers(n);
        const resultFloats = await benchmarkFloats(n);

        const combinedResults = [n, resultIntegers.cpuTime, resultIntegers.gpuTime, resultFloats.cpuTime, resultFloats.gpuTime];
        results.push(combinedResults);
        console.log(`Benchmarked ${n} elements.`);
    }

    const csvContent = results.map(e => e.join(",")).join("\n");
    fs.writeFileSync(path.join(__dirname, 'results.csv'), csvContent);
    console.log('Results saved to results.csv');
}

runBenchmarks().catch(console.error);