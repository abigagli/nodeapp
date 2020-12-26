{
    "targets": [{
        "target_name": "testaddon",
        "conditions":
        [
            [
                'OS=="mac"',
                {
                    "xcode_settings":
                    {
                        "CLANG_CXX_LANGUAGE_STANDARD": "c++17",
                        "GCC_ENABLE_CPP_RTTI": "YES",
                        "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
                    }
                },
            ],
            [
                'OS=="linux"',
                {
                    "cflags!": [ "-fno-exceptions" ],
                    "cflags_cc!": [ "-std=gnu++1y", "-fno-exceptions", "-fno-rtti" ],
                    "cflags_cc+": [ "-std=c++17", "-fexceptions", "-frtti" ]
                },
            ]
        ],
        "sources": [
            "cppsrc/main.cpp",
            "cppsrc/Samples/functionexample.cpp",
            "cppsrc/Samples/actualclass.cpp",
            "cppsrc/Samples/classexample.cpp"
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'libraries': [],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}
