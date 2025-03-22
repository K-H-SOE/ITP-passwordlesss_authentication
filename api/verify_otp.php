<?php
// Enable error reporting during development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set appropriate headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Log API access for debugging
error_log('verify_otp.php accessed. Method: ' . $_SERVER['REQUEST_METHOD']);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Error handling wrapper
try {
    // Get the request body
    $requestBody = file_get_contents('php://input');
    error_log('Request body: ' . $requestBody);
    
    $data = json_decode($requestBody, true);

    // Check if JSON is valid
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON: ' . json_last_error_msg());
    }

    // Check if required parameters are provided
    if (!isset($data['enteredOTP']) || !isset($data['generatedOTP'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required parameters',
            'debug' => [
                'received' => $data,
                'expected' => ['enteredOTP', 'generatedOTP']
            ]
        ]);
        exit;
    }

    $enteredOTP = $data['enteredOTP'];
    $generatedOTP = $data['generatedOTP'];

    // Log verification attempt (optional)
    error_log("OTP verification: entered=$enteredOTP, generated=$generatedOTP");

    // For this demo, we'll just compare the entered OTP with the generated one
    if ($enteredOTP === $generatedOTP) {
        // OTP verified successfully
        echo json_encode([
            'success' => true,
            'message' => 'OTP verified successfully. You are now authenticated!'
        ]);
    } else {
        // Invalid OTP
        echo json_encode([
            'success' => false,
            'message' => 'Invalid OTP. Please try again or request a new code.'
        ]);
    }
} catch (Exception $e) {
    // Log the error
    error_log('Error verifying OTP: ' . $e->getMessage());
    
    // Return an error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error processing your request: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>
