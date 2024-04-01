cmake_minimum_required(VERSION 3.14)
project(accel_sort LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)

find_package(CUDA QUIET)
if(CUDA_FOUND)
    enable_language(CUDA)
    set(USE_CUDA ON)
else()
    find_package(ROCm QUIET)
    if(ROCm_FOUND)
        set(USE_ROCM ON)
    else()
        message(FATAL_ERROR "Neither CUDA nor ROCm found, unable to proceed.")
    endif()
endif()

include(FetchContent)
if(USE_CUDA)
    FetchContent_Declare(
            thrust
            GIT_REPOSITORY https://github.com/NVIDIA/cccl.git
            GIT_TAG        v2.3.2
    )
    FetchContent_MakeAvailable(thrust)
elseif(USE_ROCM)
    FetchContent_Declare(
            rocThrust
            GIT_REPOSITORY https://github.com/ROCmSoftwarePlatform/rocThrust.git
            GIT_TAG        rocm-6.0.2
    )
    FetchContent_MakeAvailable(rocThrust)
endif()

if(USE_CUDA)
    set(CMAKE_CUDA_FLAGS "${CMAKE_CUDA_FLAGS} -gencode arch=compute_50,code=sm_50 -gencode arch=compute_52,code=sm_52 -gencode arch=compute_53,code=sm_53 -gencode arch=compute_60,code=sm_60 -gencode arch=compute_61,code=sm_61 -gencode arch=compute_62,code=sm_62 -gencode arch=compute_70,code=sm_70 -gencode arch=compute_72,code=sm_72 -gencode arch=compute_75,code=sm_75 -gencode arch=compute_80,code=sm_80 -gencode arch=compute_86,code=sm_86 -gencode arch=compute_87,code=sm_87")
elseif(USE_ROCM)
    add_compile_definitions(__HIP_PLATFORM_HCC__)
    set(CMAKE_CXX_COMPILER hipcc)
endif()

add_library(accel_sort SHARED library.cu)

if(USE_CUDA)
    set_target_properties(accel_sort PROPERTIES CUDA_SEPARABLE_COMPILATION ON)
endif()

target_link_libraries(accel_sort PRIVATE ${BACKEND_TARGET})
