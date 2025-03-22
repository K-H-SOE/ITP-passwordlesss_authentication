<?php
// Simple test endpoint to verify API access
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'API is accessible',
    'timestamp' => time(),
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
        'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'Unknown',
    ]
]);
?>
