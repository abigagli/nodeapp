#include <napi.h>
#include <iostream>
#include <vector>
#include <string>
#include <memory>

int module_main(int argc, char const *argv[]);

std::tuple<int, std::unique_ptr<char const *[]>>
make_argc_argv(std::vector<std::string> const &args)
{
    int const argc = args.size();
    std::unique_ptr<char const *[]> argv{new char const *[argc + 1]};

    auto i = 0U;
    for (; i != args.size(); ++i)
    {
        argv[i] = args[i].c_str();
    }
    argv[i] = nullptr;

    return {argc, std::move(argv)};
}

static Napi::Value main_caller(Napi::CallbackInfo const &info)
{
    Napi::Env env = info.Env();

    if (info.Length() != 1 || !info[0].IsArray())
    {
        Napi::Error::New(info.Env(), "Expected a single array argument").
        ThrowAsJavaScriptException();

        return info.Env().Undefined();
    }

    Napi::Array args_from_js = info[0].As<Napi::Array>();

    std::vector<std::string> args_for_cpp{"arg0_placeholder"};
    for (auto i = 0U; i != args_from_js.Length(); ++i)
    {
        Napi::Value const v = args_from_js[i];
        args_for_cpp.push_back(v.ToString());
    }

    auto [argc, argv] = make_argc_argv(args_for_cpp);

    int returnValue = module_main(argc, argv.get());

    return Napi::Number::New(env, returnValue);
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("run", Napi::Function::New(env, main_caller));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)