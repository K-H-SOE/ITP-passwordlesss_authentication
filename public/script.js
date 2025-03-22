// Helper to get the correct API path based on environment
function getApiPath(endpoint) {
  // In this version, we'll always use mock API when possible
  // but keep the path structure for compatibility
  return `../api/${endpoint}`;
}

// Global variables
let otpTimer;
let biometricTimeout;

// Helper functions
function showElement(elementId) {
  const element = document.getElementById(elementId);
  element.classList.remove("hidden");
  element.classList.add("fade-in");
  return element;
}

function hideElement(elementId) {
  const element = document.getElementById(elementId);
  element.classList.remove("fade-in");
  element.classList.add("fade-out");
  setTimeout(() => {
    element.classList.add("hidden");
    element.classList.remove("fade-out");
  }, 500);
  return element;
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("active");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function showFeedback(message, type = "info") {
  const feedback = document.getElementById("feedback");
  feedback.innerText = message;
  feedback.className = ""; // Reset classes
  feedback.classList.add(type + "-message");
  feedback.classList.add("active");

  // Hide after 5 seconds
  setTimeout(() => {
    feedback.classList.remove("active");
  }, 5000);
}

function showLoading(message = "Processing...") {
  const overlay = document.getElementById("loadingOverlay");
  document.getElementById("loadingText").innerText = message;
  overlay.classList.remove("hidden");
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay");
  overlay.classList.add("hidden");
}

// Add a fallback to hide loading after maximum time
function showLoadingWithTimeout(message = "Processing...", timeout = 10000) {
  showLoading(message);

  // Safety timeout to ensure loading is never stuck
  setTimeout(() => {
    hideLoading();
  }, timeout);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded - initializing authentication app");

  // Initialize - make sure loading overlay is hidden on page load
  hideLoading();

  // Transition from login page to authentication options
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Login form submitted");

    const username = document.getElementById("username").value;
    console.log("Username entered:", username);

    // Store username for later use
    localStorage.setItem("lastUsername", username);

    // Display username in greeting
    document.getElementById("userGreeting").innerText = username.split("@")[0];

    hideElement("loginPage");
    setTimeout(() => {
      showElement("authOptions");
    }, 500);
  });

  // Go back to login
  document.getElementById("backToLogin").addEventListener("click", function () {
    hideElement("authOptions");
    setTimeout(() => {
      showElement("loginPage");
    }, 500);
  });

  // Handle OTP input fields
  const otpInputs = document.querySelectorAll(".otp-input");
  otpInputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      // Auto move to next input
      const index = parseInt(this.getAttribute("data-index"));
      if (this.value && index < 5) {
        otpInputs[index + 1].focus();
      }

      // Combine all inputs into hidden field
      let combinedOTP = "";
      otpInputs.forEach((input) => {
        combinedOTP += input.value;
      });
      document.getElementById("otpInput").value = combinedOTP;
    });

    input.addEventListener("keydown", function (e) {
      // Handle backspace to go to previous input
      const index = parseInt(this.getAttribute("data-index"));
      if (e.key === "Backspace" && !this.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  // Enhanced Biometric simulation
  document
    .getElementById("btnBiometric")
    .addEventListener("click", function () {
      hideElement("authOptions");
      setTimeout(() => {
        showElement("biometricSection");

        // Simulate fingerprint scanning
        showLoadingWithTimeout("Scanning fingerprint...", 5000);

        biometricTimeout = setTimeout(() => {
          hideLoading();
          hideElement("biometricSection");
          showFeedback(
            "Biometric authentication successful. Welcome back!",
            "success"
          );

          // Simulate redirect to dashboard
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 2000);
        }, 3000);
      }, 500);
    });

  // Cancel biometric
  document
    .getElementById("cancelBiometric")
    .addEventListener("click", function () {
      clearTimeout(biometricTimeout);
      hideLoading();
      hideElement("biometricSection");
      setTimeout(() => {
        showElement("authOptions");
      }, 500);
    });

  // Enhanced Push Notification simulation
  document.getElementById("btnPush").addEventListener("click", function () {
    hideElement("authOptions");
    showModal("pushModal");

    // Simulate sending push notification
    showFeedback("Push notification sent to your device.", "info");
  });

  document.getElementById("approvePush").addEventListener("click", function () {
    hideModal("pushModal");
    showLoadingWithTimeout("Verifying approval...", 6000);

    // For debugging - log the API path
    console.log("Calling API:", getApiPath("push.php"));

    // Simulate API call with a timeout
    setTimeout(() => {
      fetch(getApiPath("push.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })
        .then((response) => {
          // Log response status for debugging
          console.log("API Response Status:", response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Log response data for debugging
          console.log("API Response Data:", data);

          hideLoading();
          showFeedback(
            data.message || "Login approved successfully!",
            "success"
          );

          // Simulate redirect to dashboard
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 2000);
        })
        .catch((error) => {
          hideLoading();
          // More descriptive error message including the error details
          const errorMessage = `Error during push approval: ${error.message}`;
          showFeedback(errorMessage, "error");
          console.error("Push approval error:", error);

          setTimeout(() => {
            showElement("authOptions");
          }, 1000);
        });
    }, 1500);
  });

  document.getElementById("denyPush").addEventListener("click", function () {
    hideModal("pushModal");
    showLoadingWithTimeout("Processing...", 6000);

    // For debugging - log the API path
    console.log("Calling API:", getApiPath("push.php"));

    // Simulate API call with a timeout
    setTimeout(() => {
      fetch(getApiPath("push.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deny" }),
      })
        .then((response) => {
          // Log response status for debugging
          console.log("API Response Status:", response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          hideLoading();
          showFeedback(data.message || "Login request denied.", "error");
          setTimeout(() => {
            showElement("authOptions");
          }, 1000);
        })
        .catch((error) => {
          hideLoading();
          // More descriptive error message including the error details
          const errorMessage = `Error processing request: ${error.message}`;
          showFeedback(errorMessage, "error");
          console.error("Push denial error:", error);

          setTimeout(() => {
            showElement("authOptions");
          }, 1000);
        });
    }, 1500);
  });

  document.getElementById("cancelPush").addEventListener("click", function () {
    hideModal("pushModal");
    showElement("authOptions");
  });

  // Enhanced OTP simulation
  document.getElementById("btnOTP").addEventListener("click", function () {
    hideElement("authOptions");
    showLoadingWithTimeout("Generating OTP...", 6000);

    // Clear previous OTP inputs if any
    otpInputs.forEach((input) => {
      input.value = "";
    });
    document.getElementById("otpInput").value = "";

    // For debugging - log the API path
    console.log("Calling API:", getApiPath("otp.php"));

    // Simulate API call with a timeout
    setTimeout(() => {
      fetch(getApiPath("otp.php"))
        .then((response) => {
          // Log response status for debugging
          console.log("API Response Status:", response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Log response data for debugging
          console.log("API Response Data:", data);

          hideLoading();
          document.getElementById("otpCode").innerText = data.otp;
          showElement("otpSection");

          // Start OTP timer
          let timeLeft = 60;
          document.getElementById("otpTimer").innerText = timeLeft;

          if (otpTimer) {
            clearInterval(otpTimer);
          }

          otpTimer = setInterval(() => {
            timeLeft--;
            document.getElementById("otpTimer").innerText = timeLeft;

            if (timeLeft <= 0) {
              clearInterval(otpTimer);
              showFeedback(
                "OTP has expired. Please request a new one.",
                "warning"
              );
            }
          }, 1000);

          // Focus on first OTP input
          otpInputs[0].focus();
        })
        .catch((error) => {
          hideLoading();
          // More descriptive error message including the error details
          const errorMessage = `Error generating OTP: ${error.message}`;
          showFeedback(errorMessage, "error");
          console.error("OTP generation error:", error);

          setTimeout(() => {
            showElement("authOptions");
          }, 1000);
        });
    }, 1500);
  });

  document.getElementById("verifyOTP").addEventListener("click", function () {
    const enteredOTP = document.getElementById("otpInput").value;
    const generatedOTP = document.getElementById("otpCode").innerText;

    if (enteredOTP.length !== 6) {
      showFeedback("Please enter all 6 digits of the OTP.", "warning");
      return;
    }

    showLoadingWithTimeout("Verifying OTP...", 6000);

    // For debugging - log the API path and payload
    console.log("Calling API:", getApiPath("verify_otp.php"));
    console.log("Payload:", { enteredOTP, generatedOTP });

    // Simulate API call with a timeout
    setTimeout(() => {
      fetch(getApiPath("verify_otp.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enteredOTP, generatedOTP }),
      })
        .then((response) => {
          // Log response status for debugging
          console.log("API Response Status:", response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Log response data for debugging
          console.log("API Response Data:", data);

          hideLoading();
          clearInterval(otpTimer);

          if (data.success) {
            hideElement("otpSection");
            showFeedback(
              data.message || "OTP verified successfully.",
              "success"
            );

            // Simulate redirect to dashboard
            setTimeout(() => {
              window.location.href = "dashboard.html";
            }, 2000);
          } else {
            showFeedback(
              data.message || "Invalid OTP. Please try again.",
              "error"
            );
          }
        })
        .catch((error) => {
          hideLoading();
          // More descriptive error message including the error details
          const errorMessage = `Error verifying OTP: ${error.message}`;
          showFeedback(errorMessage, "error");
          console.error("OTP verification error:", error);
        });
    }, 1500);
  });

  document.getElementById("resendOTP").addEventListener("click", function () {
    clearInterval(otpTimer);
    hideElement("otpSection");

    // Trigger OTP generation again
    document.getElementById("btnOTP").click();
  });

  document.getElementById("cancelOTP").addEventListener("click", function () {
    clearInterval(otpTimer);
    hideElement("otpSection");
    setTimeout(() => {
      showElement("authOptions");
    }, 500);
  });

  // Magic Link Authentication
  document
    .getElementById("btnMagicLink")
    .addEventListener("click", function () {
      hideElement("authOptions");

      // Get the user's email
      const username = document.getElementById("username").value;

      // Display the email in the modal and preview
      document.getElementById("magicLinkEmail").textContent = username;
      document.querySelector(".email-recipient").textContent = username;

      // Show modal with loading state
      showModal("magicLinkModal");
      document.getElementById("magicLinkUrl").textContent =
        "Generating secure link...";
      document.getElementById("magicLinkUrl").classList.add("generating");

      // Generate a magic link
      fetch(getApiPath("magic-link.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Magic Link generated:", data);

          // Update the magic link button
          const magicLinkElement = document.getElementById("magicLinkUrl");
          magicLinkElement.href = data.magicLinkUrl;
          magicLinkElement.classList.remove("generating");
          magicLinkElement.innerHTML =
            '<i class="fas fa-lock"></i> Secure Sign In';

          // Store the token for verification
          magicLinkElement.dataset.token = data.token;

          // Setup expiry timer if available
          if (data.expiresAt) {
            const expiryMinutes = Math.floor(
              (data.expiresAt - Math.floor(Date.now() / 1000)) / 60
            );
            document.getElementById("magicLinkExpiry").textContent =
              expiryMinutes;
          }

          // Simulate sending magic link
          showFeedback(`Magic link sent to ${username}`, "info");

          // Set up event listener for the magic link
          magicLinkElement.addEventListener("click", handleMagicLinkClick);
        })
        .catch((error) => {
          console.error("Magic Link generation error:", error);
          const magicLinkElement = document.getElementById("magicLinkUrl");
          magicLinkElement.innerHTML =
            '<i class="fas fa-exclamation-triangle"></i> Error generating link';
          magicLinkElement.classList.add("error");
          showFeedback(`Error sending magic link: ${error.message}`, "error");
        });
    });

  // Handle magic link click
  function handleMagicLinkClick(e) {
    e.preventDefault();

    // Check if there's an error state
    if (
      this.classList.contains("error") ||
      this.classList.contains("generating")
    ) {
      showFeedback("Please wait or try again later", "warning");
      return;
    }

    hideModal("magicLinkModal");
    showLoadingWithTimeout("Verifying your identity...", 6000);

    // Get token from data attribute
    const token = this.dataset.token;

    // Simulate verification process
    setTimeout(() => {
      hideLoading();
      showFeedback(
        "Magic link verification successful! Welcome back!",
        "success"
      );

      // Simulate redirect to dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    }, 2000);
  }

  // Resend Magic Link
  document
    .getElementById("resendMagicLink")
    .addEventListener("click", function () {
      // Reset link display
      const magicLinkElement = document.getElementById("magicLinkUrl");
      magicLinkElement.textContent = "Generating secure link...";
      magicLinkElement.classList.add("generating");
      magicLinkElement.classList.remove("error");

      // Get the user's email
      const username = document.getElementById("username").value;

      // Generate a new magic link
      fetch(getApiPath("magic-link.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("New Magic Link generated:", data);

          // Update the magic link button
          magicLinkElement.href = data.magicLinkUrl;
          magicLinkElement.classList.remove("generating");
          magicLinkElement.innerHTML =
            '<i class="fas fa-lock"></i> Secure Sign In';

          // Store the token for verification
          magicLinkElement.dataset.token = data.token;

          // Setup expiry timer if available
          if (data.expiresAt) {
            const expiryMinutes = Math.floor(
              (data.expiresAt - Math.floor(Date.now() / 1000)) / 60
            );
            document.getElementById("magicLinkExpiry").textContent =
              expiryMinutes;
          }

          // Show success message
          showFeedback(`New magic link sent to ${username}`, "info");
        })
        .catch((error) => {
          console.error("Magic Link regeneration error:", error);
          magicLinkElement.innerHTML =
            '<i class="fas fa-exclamation-triangle"></i> Error generating link';
          magicLinkElement.classList.add("error");
          showFeedback(`Error resending magic link: ${error.message}`, "error");
        });
    });

  // Update the simulate login button to use the magic link click handler
  document
    .getElementById("simulateLogin")
    .addEventListener("click", function () {
      const magicLinkElement = document.getElementById("magicLinkUrl");

      // Don't proceed if link is in error or loading state
      if (
        magicLinkElement.classList.contains("error") ||
        magicLinkElement.classList.contains("generating")
      ) {
        showFeedback("Please wait for a valid link to be generated", "warning");
        return;
      }

      // Trigger the magic link click handler
      magicLinkElement.click();
    });

  // Load last username if available
  const lastUsername = localStorage.getItem("lastUsername");
  if (lastUsername) {
    document.getElementById("username").value = lastUsername;
  }
});

// Handle API errors globally
window.addEventListener("error", function (event) {
  hideLoading(); // Ensure loading is hidden if an error occurs
  showFeedback(
    "An unexpected error occurred. Please try again later.",
    "error"
  );
  console.error("Global error:", event.error);
});

// Add event listener for unhandled promise rejections
window.addEventListener("unhandledrejection", function (event) {
  hideLoading(); // Ensure loading is hidden if a promise is rejected
  showFeedback(
    "An unexpected error occurred. Please try again later.",
    "error"
  );
  console.error("Unhandled promise rejection:", event.reason);
});
