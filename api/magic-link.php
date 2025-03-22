<?php
// Set appropriate headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Add error handling
try {
    // Get email from request if provided
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);
    $email = isset($data['email']) ? $data['email'] : 'user@example.com';
    
    // Generate a secure token (for demo purposes only)
    // In production, this would be more complex with proper encryption
    $token = bin2hex(random_bytes(32));
    
    // Generate an expiry time (15 minutes from now)
    $expiresAt = time() + (15 * 60);
    
    // Generate the magic link URL
    $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
    $magicLinkUrl = $baseUrl . "/verify-magic-link.php?token=" . $token;
    
    // In a real application, you would:
    // 1. Store the token in a database with the user's email and expiry time
    // 2. Send the magic link URL to the user's email address
    
    // Log activity (optional)
    error_log("Magic link token generated for $email: $token");
    
    // For demo purposes, we'll return the token and URL
    echo json_encode([
        'success' => true,
        'token' => $token,
        'expiresAt' => $expiresAt,
        'magicLinkUrl' => $magicLinkUrl,
        'email' => $email
    ]);
} catch (Exception $e) {
    // Log the error
    error_log('Error generating magic link: ' . $e->getMessage());
    
    // Return an error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to generate magic link. Please try again.'
    ]);
}
?>
