<?php
header('Content-Type: application/json');

// ... (database connection and configuration)

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ... (input sanitization and validation)

    // Prepare and execute the SQL statement
    $stmt = $conn->prepare("INSERT INTO messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $subject, $message, $created_at);

    if ($stmt->execute()) {
        // Success
        echo json_encode(['status' => 'success', 'message' => 'Your message has been sent successfully!']);
    } else {
        // Error
        echo json_encode(['status' => 'error', 'message' => 'Failed to save message: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    // Invalid request method
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

$conn->close();