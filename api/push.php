<?php
// Set appropriate headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Error handling wrapper
try {
    // Get the request body
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);
    
    // Check if JSON is valid
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON: ' . json_last_error_msg());
    }

    // Check if action is provided
    if (!isset($data['action'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing action parameter'
        ]);
        exit;
    }

    // Process the action
    switch ($data['action']) {
        case 'approve':
            // In a real application, you would:
            // 1. Verify the user's identity
            // 2. Create a session or token
            // 3. Log the successful authentication
            
            // Log activity (optional)
            error_log('Push notification approved by user');
            
            echo json_encode([
                'success' => true,
                'message' => 'Push notification approved. You have been authenticated successfully!'
            ]);
            break;
            
        case 'deny':
            // In a real application, you would:
            // 1. Log the denied authentication attempt
            // 2. Possibly implement security measures for multiple denials
            
            // Log activity (optional)
            error_log('Push notification denied by user');
            
            echo json_encode([
                'success' => false,
                'message' => 'Authentication request denied. For security reasons, please try again.'
            ]);
            break;
            
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action: ' . $data['action']
            ]);
    }
} catch (Exception $e) {
    // Log the error
    error_log('Error processing push notification: ' . $e->getMessage());
    
    // Return an error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error processing your request. Please try again.'
    ]);
}
?>
