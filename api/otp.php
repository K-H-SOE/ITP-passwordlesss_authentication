<?php
// Set appropriate headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Add error handling
try {
    // Generate a random 6-digit OTP
    $otp = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

    // In a real application, you would:
    // 1. Store the OTP in a database with a timestamp
    // 2. Associate it with the user's session
    // 3. Send it to the user via SMS or email

    // Log activity (optional)
    error_log('OTP generated: ' . $otp);

    // Return the OTP as JSON (for demo purposes only)
    // In a production environment, you'd typically not return the OTP directly
    echo json_encode([
        'success' => true,
        'otp' => $otp,
        'expires_in' => 60 // seconds
    ]);
} catch (Exception $e) {
    // Log the error
    error_log('Error generating OTP: ' . $e->getMessage());
    
    // Return an error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to generate OTP. Please try again.'
    ]);
}
?>
