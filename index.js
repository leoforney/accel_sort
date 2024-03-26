const ffi= require('ffi-napi');

const AccelSort = ffi.Library('build/Release/libaccel_sort', {
    'sortIntegers': ['void', ['pointer', 'int']],
    'sortFloats': ['void', ['pointer', 'int']]
});

module.exports = AccelSort;