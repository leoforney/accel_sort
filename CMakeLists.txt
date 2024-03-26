cmake_minimum_required(VERSION 3.14)
project(accel_sort CUDA)

set(CMAKE_CUDA_STANDARD 17)

include(FetchContent)
FetchContent_Declare(
        thrust
        GIT_REPOSITORY https://github.com/NVIDIA/cccl.git
        GIT_TAG        v2.3.2
)
FetchContent_MakeAvailable(thrust)

set(CMAKE_CUDA_FLAGS "${CMAKE_CUDA_FLAGS} -gencode arch=compute_50,code=sm_50 -gencode arch=compute_52,code=sm_52 -gencode arch=compute_53,code=sm_53 -gencode arch=compute_60,code=sm_60 -gencode arch=compute_61,code=sm_61 -gencode arch=compute_62,code=sm_62 -gencode arch=compute_70,code=sm_70 -gencode arch=compute_72,code=sm_72 -gencode arch=compute_75,code=sm_75 -gencode arch=compute_80,code=sm_80 -gencode arch=compute_86,code=sm_86 -gencode arch=compute_87,code=sm_87")

add_library(accel_sort SHARED library.cu)

set_target_properties(accel_sort PROPERTIES
        CUDA_SEPARABLE_COMPILATION ON)
