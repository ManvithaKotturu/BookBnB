@echo off
echo Starting BookBnB Development Environment...
echo.

echo Installing server dependencies...
npm install

echo.
echo Installing client dependencies...
cd client
npm install
cd ..

echo.
echo Starting development servers...
npm run dev

pause
