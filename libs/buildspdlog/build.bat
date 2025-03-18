set ABI=x86_64

set ANDROID_NDK=D:\Programs\Android\Sdk\ndk\26.1.10909125
set TOOL_CHAIN=%ANDROID_NDK%\build\cmake\android.toolchain.cmake
set CMAKE=D:\Programs\Android\Sdk\cmake\3.22.1\bin\cmake.exe

mkdir %ABI%
cd %ABI%

%CMAKE% ..\..\spdlog -GNinja -DCMAKE_SYSTEM_NAME=Android -DCMAKE_SYSTEM_VERSION=21 -DANDROID_ABI=%ABI% -DCMAKE_TOOLCHAIN_FILE=%TOOL_CHAIN% -DCMAKE_CXX_FLAGS=-DSPDLOG_COMPILED_LIB

%CMAKE% --build .

pause