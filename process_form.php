<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    // Recipient email address
    $recipient = "tobydeane101@gmail.com";

    // Subject of the email
    $subject = "New Contact Form Submission";

    // Email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Message:\n$message";

    // Send email
    mail($recipient, $subject, $email_content);

    // Redirect after sending email
    header("Location: thank_you.html");
}
?>
