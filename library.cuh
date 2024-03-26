#ifndef ACCEL_SORT_LIBRARY_CUH
#define ACCEL_SORT_LIBRARY_CUH

#include <thrust/sort.h>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>
#include <thrust/copy.h>
#include <vector>

extern "C" void sortIntegers(int* data, size_t size);

extern "C" void sortFloats(float* data, size_t size);

#endif //ACCEL_SORT_LIBRARY_CUH
