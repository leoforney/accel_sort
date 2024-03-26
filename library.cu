#include "library.cuh"

#include <thrust/sort.h>
#include <thrust/host_vector.h>
#include <thrust/device_vector.h>
#include <thrust/copy.h>
#include <vector>

void sortIntegers(int *data, size_t size) {
    thrust::host_vector<int> host_vector(data, data + size);
    thrust::device_vector<int> device_vector = host_vector;

    thrust::sort(device_vector.begin(), device_vector.end());

    thrust::copy(device_vector.begin(), device_vector.end(), host_vector.begin());
    std::copy(host_vector.begin(), host_vector.end(), data);
}

void sortFloats(float *data, size_t size) {
    thrust::host_vector<float> host_vector(data, data + size);
    thrust::device_vector<float> device_vector = host_vector;

    thrust::sort(device_vector.begin(), device_vector.end());

    thrust::copy(device_vector.begin(), device_vector.end(), host_vector.begin());
    std::copy(host_vector.begin(), host_vector.end(), data);
}
