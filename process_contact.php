<?php
/**
 * Process Contact Form
 * Transporte Ecológico Compás
 */

header('Content-Type: application/json');

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Collect and sanitize form data
    $nombre = sanitize_input($_POST['nombre'] ?? '');
    $email = sanitize_input($_POST['email'] ?? '');
    $telefono = sanitize_input($_POST['telefono'] ?? '');
    $asunto = sanitize_input($_POST['asunto'] ?? '');
    $mensaje = sanitize_input($_POST['mensaje'] ?? '');
    
    // Validate required fields
    if (empty($nombre) || empty($email) || empty($asunto) || empty($mensaje)) {
        echo json_encode(array(
            'success' => false,
            'message' => 'Por favor, complete todos los campos obligatorios.'
        ));
        exit;
    }

    // Validate email format
    if (!validate_email($email)) {
        echo json_encode(array(
            'success' => false,
            'message' => 'Por favor, proporcione un correo electrónico válido.'
        ));
        exit;
    }

    // Save to CSV file
    $csv_file = 'data/contacts.csv';
    
    // Create data directory if it doesn't exist
    if (!file_exists('data')) {
        mkdir('data', 0755, true);
    }

    $file_exists = file_exists($csv_file);
    $fp = fopen($csv_file, 'a');
    
    if ($fp) {
        $data = array(
            date('Y-m-d H:i:s'),
            $nombre,
            $email,
            $telefono,
            $asunto,
            $mensaje
        );
        
        // Add headers if file is new
        if (!$file_exists) {
            fputcsv($fp, array('Fecha', 'Nombre', 'Email', 'Teléfono', 'Asunto', 'Mensaje'));
        }
        
        fputcsv($fp, $data);
        fclose($fp);
        
        // Send email notification
        $to = "info@transportecompas.com";
        $subject = "Nuevo mensaje de contacto: " . $asunto;
        $email_message = "Nuevo mensaje de contacto recibido:\n\n";
        $email_message .= "Nombre: " . $nombre . "\n";
        $email_message .= "Email: " . $email . "\n";
        $email_message .= "Teléfono: " . $telefono . "\n";
        $email_message .= "Asunto: " . $asunto . "\n";
        $email_message .= "Mensaje:\n" . $mensaje . "\n";
        
        $headers = "From: noreply@transportecompas.com\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // Uncomment to send email
        // mail($to, $subject, $email_message, $headers);
        
        // Send confirmation email to user
        $user_subject = "Gracias por contactarnos - Transporte Compás";
        $user_message = "Estimado/a " . $nombre . ",\n\n";
        $user_message .= "Gracias por ponerse en contacto con Transporte Ecológico Compás.\n\n";
        $user_message .= "Hemos recibido su mensaje y nos pondremos en contacto con usted a la brevedad posible.\n\n";
        $user_message .= "Saludos cordiales,\n";
        $user_message .= "Equipo de Transporte Compás";
        
        $user_headers = "From: info@transportecompas.com\r\n";
        $user_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // Uncomment to send confirmation email
        // mail($email, $user_subject, $user_message, $user_headers);
        
        echo json_encode(array(
            'success' => true,
            'message' => '¡Mensaje enviado correctamente!',
            'contact_id' => uniqid()
        ));
    } else {
        echo json_encode(array(
            'success' => false,
            'message' => 'Error al procesar su solicitud. Por favor, intente nuevamente.'
        ));
    }

} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'Método de solicitud no válido.'
    ));
}
?>
