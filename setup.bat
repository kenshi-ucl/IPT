@echo off
echo Setting up Student & Faculty Management System...
echo.

echo Installing PHP dependencies...
composer install

echo.
echo Installing Node.js dependencies...
npm install

echo.
echo Generating application key...
php artisan key:generate

echo.
echo Building assets...
npm run dev

echo.
echo Setup complete!
echo.
echo Default admin credentials:
echo Email: admin@admin.com
echo Password: password
echo.
echo To start the development server:
echo php artisan serve
echo.
echo Then visit: http://localhost:8000
pause

