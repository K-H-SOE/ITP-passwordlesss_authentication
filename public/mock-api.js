/**
 * Mock API implementation for testing without a PHP backend
 * This provides client-side implementations of all the API endpoints
 */

class MockApi {
  constructor() {
    this.initialized = false;
    this.isActive = true; // Set to true by default
  }

  init() {
    if (this.initialized) return;
    
    // Check if we should use the mock API (default to true if not set)
    const storedValue = localStorage.getItem('useMockApi');
    this.isActive = storedValue === null ? true : storedValue === 'true';
    
    // Set default in localStorage if not already set
    if (storedValue === null) {
      localStorage.setItem('useMockApi', 'true');
    }
    
    if (this.isActive) {
      console.log('Mock API is active - all API calls will be handled client-side');
      this.interceptFetchCalls();
    }
    
    this.initialized = true;
  }
  
  activate() {
    localStorage.setItem('useMockApi', 'true');
    this.isActive = true;
    this.interceptFetchCalls();
    console.log('✅ Mock API activated');
    return true;
  }
  
  deactivate() {
    localStorage.setItem('useMockApi', 'false');
    this.isActive = false;
    console.log('❌ Mock API deactivated - will use real backend');
    return false;
  }
  
  toggle() {
    return this.isActive ? this.deactivate() : this.activate();
  }
  
  interceptFetchCalls() {
    const originalFetch = window.fetch;
    const self = this;
    
    window.fetch = function(url, options) {
      if (self.isActive && typeof url === 'string' && url.includes('/api/')) {
        return self.handleApiCall(url, options);
      }
      return originalFetch(url, options);
    };
  }
  
  handleApiCall(url, options) {
    console.log(`🔄 Mock API handling: ${url}`, options);
    
    // Extract the endpoint name
    const endpoint = url.split('/api/')[1].split('.')[0];
    
    // Handle different endpoints
    switch (endpoint) {
      case 'otp':
        return this.handleOtpGeneration();
      case 'verify_otp':
        return this.handleOtpVerification(options);
      case 'push':
        return this.handlePushNotification(options);
      case 'magic-link':
        return this.handleMagicLinkGeneration(options);
      case 'test':
        return this.handleTestEndpoint();
      default:
        return Promise.reject(new Error(`Unknown endpoint: ${endpoint}`));
    }
  }
  
  // Mock implementation of OTP generation
  handleOtpGeneration() {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    return this.createSuccessResponse({
      success: true,
      otp: otp,
      expires_in: 60
    });
  }
  
  // Mock implementation of OTP verification
  handleOtpVerification(options) {
    try {
      const body = JSON.parse(options.body);
      const { enteredOTP, generatedOTP } = body;
      
      const isValid = enteredOTP === generatedOTP;
      
      return this.createSuccessResponse({
        success: isValid,
        message: isValid 
          ? 'OTP verified successfully. You are now authenticated!' 
          : 'Invalid OTP. Please try again or request a new code.'
      });
    } catch (error) {
      return this.createErrorResponse('Invalid request format');
    }
  }
  
  // Mock implementation of push notification
  handlePushNotification(options) {
    try {
      const body = JSON.parse(options.body);
      const { action } = body;
      
      if (action === 'approve') {
        return this.createSuccessResponse({
          success: true,
          message: 'Push notification approved. You have been authenticated successfully!'
        });
      } else if (action === 'deny') {
        return this.createSuccessResponse({
          success: false,
          message: 'Authentication request denied. For security reasons, please try again.'
        });
      } else {
        return this.createErrorResponse('Invalid action');
      }
    } catch (error) {
      return this.createErrorResponse('Invalid request format');
    }
  }
  
  // Mock implementation of Magic Link generation
  handleMagicLinkGeneration(options) {
    try {
      // Parse request body if present
      let email = 'user@example.com';
      if (options && options.body) {
        const body = JSON.parse(options.body);
        if (body.email) {
          email = body.email;
        }
      }
      
      // Generate a random token (32 characters)
      const token = Array.from(Array(32), () => Math.floor(Math.random() * 36).toString(36)).join('');
      
      // Generate expiry time (15 minutes from now)
      const expiresAt = Math.floor(Date.now() / 1000) + (15 * 60);
      
      // Create a magic link URL
      const magicLinkUrl = `https://secureauth.example.com/verify?token=${token}&email=${encodeURIComponent(email)}`;
      
      return this.createSuccessResponse({
        success: true,
        token: token,
        expiresAt: expiresAt,
        magicLinkUrl: magicLinkUrl,
        email: email
      });
    } catch (error) {
      return this.createErrorResponse('Error generating magic link');
    }
  }
  
  // Mock implementation of test endpoint
  handleTestEndpoint() {
    return this.createSuccessResponse({
      success: true,
      message: 'Mock API is accessible',
      timestamp: Date.now(),
      server_info: {
        type: 'Mock API (JavaScript)',
        version: '1.0',
        environment: 'Browser'
      }
    });
  }
  
  // Helper to create a success response
  createSuccessResponse(data) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(data)
    });
  }
  
  // Helper to create an error response
  createErrorResponse(message, status = 400) {
    return Promise.resolve({
      ok: false,
      status: status,
      json: () => Promise.resolve({
        success: false,
        message: message
      })
    });
  }
}

// Initialize the mock API
const mockApi = new MockApi();
mockApi.init();
