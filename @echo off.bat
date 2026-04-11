@echo off
cd /d "%~dp0"

for %%f in (*) do (
    if /I not "%%~xf"==".bat" (
        ren "%%f" "%%~nf.jpg"
    )
)

echo Done!
pause