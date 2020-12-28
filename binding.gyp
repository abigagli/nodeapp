{
    "targets": [{
        "target_name": "hdrbil",
        "conditions":
        [
            [
                'OS=="mac"',
                {
                    "xcode_settings":
                    {
                        "CLANG_CXX_LANGUAGE_STANDARD": "c++17",
                        "GCC_ENABLE_CPP_RTTI": "YES",
                        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                        "MACOSX_DEPLOYMENT_TARGET": "10.7"
#                        "OTHER_CPLUSPLUSFLAGS" : [ "-stdlib=libc++" ],
                    },
                    'include_dirs': [
                        "/opt/local/include",
                        "/Users/abigagli/BOOST-CURRENT/include"
                    ],
                    'libraries': [
                        #"/opt/local/lib/libsnappy.dylib"
                    ],
                },
            ],
            [
                'OS=="linux"',
                {
                    "cflags!": [ "-fno-exceptions" ],
                    "cflags_cc!": [ "-std=gnu++1y", "-fno-exceptions", "-fno-rtti" ],
                    "cflags_cc+": [ "-std=c++17", "-fexceptions", "-frtti" ],
                    'libraries': [],
                },
            ]
        ],
        "sources": [
            "../hdrbil/main.cpp",
            "cppsrc/hdrbilwrapper.cpp"
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")",
            "../hdrbil",
        ],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")",
        ],
        #'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}
