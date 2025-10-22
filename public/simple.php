<?php
// Simple PHP server to serve the Student & Faculty Management System
// This bypasses Laravel compatibility issues with PHP 8.2

// If accessing the root, redirect to the working HTML version
if ($_SERVER['REQUEST_URI'] === '/' || $_SERVER['REQUEST_URI'] === '/index.php') {
    header('Location: /index.html');
    exit;
}

// For other requests, serve static files
$requested_file = __DIR__ . $_SERVER['REQUEST_URI'];

if (file_exists($requested_file) && !is_dir($requested_file)) {
    // Get the file extension to set proper content type
    $extension = pathinfo($requested_file, PATHINFO_EXTENSION);
    
    switch ($extension) {
        case 'html':
            header('Content-Type: text/html');
            break;
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'json':
            header('Content-Type: application/json');
            break;
        default:
            header('Content-Type: text/plain');
    }
    
    readfile($requested_file);
    exit;
}

// If file not found, redirect to the main app
header('Location: /index.html');
exit;
?>
