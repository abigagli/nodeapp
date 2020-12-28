cmake_minimum_required(VERSION 3.9)
cmake_policy(SET CMP0042 NEW)

project (hdrbil)
set (CMAKE_CXX_STANDARD 17)
set (CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(${CMAKE_JS_INC})
set(SOURCE_FILES
    cppsrc/hdrbilwrapper.cpp
    hdrbil/main.cpp)

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} png snappy)

# Include N-API wrappers
execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})


if (CMAKE_SYSTEM_NAME STREQUAL "Linux")
    target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})
elseif (CMAKE_SYSTEM_NAME STREQUAL "Darwin")
    target_include_directories(${PROJECT_NAME} PRIVATE
        ${NODE_ADDON_API_DIR}
        /opt/local/include
        $ENV{HOME}/BOOST-CURRENT/include)
    target_link_directories(${PROJECT_NAME} PRIVATE
        /opt/local/lib
        $ENV{HOME}/BOOST-CURRENT/lib)
endif()

# define NPI_VERSION
add_definitions(-DNAPI_VERSION=3)
