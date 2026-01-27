<?php
/**
 * Process Questionnaire Form
 * Transporte Ecológico La Esperanza
 */

header('Content-Type: application/json');

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Collect and sanitize form data
    $data = array(
        'timestamp' => date('Y-m-d H:i:s'),
        'enteraste' => isset($_POST['enteraste']) ? $_POST['enteraste'] : array(),
        'enteraste_otro' => sanitize_input($_POST['enteraste_otro'] ?? ''),
        'frecuencia' => sanitize_input($_POST['frecuencia'] ?? ''),
        'rating_puntualidad' => sanitize_input($_POST['rating_puntualidad'] ?? ''),
        'rating_comodidad' => sanitize_input($_POST['rating_comodidad'] ?? ''),
        'rating_limpieza' => sanitize_input($_POST['rating_limpieza'] ?? ''),
        'rating_trato' => sanitize_input($_POST['rating_trato'] ?? ''),
        'rating_informacion' => sanitize_input($_POST['rating_informacion'] ?? ''),
        'rating_ecologico' => sanitize_input($_POST['rating_ecologico'] ?? ''),
        'seguridad' => sanitize_input($_POST['seguridad'] ?? ''),
        'satisfaccion' => sanitize_input($_POST['satisfaccion'] ?? ''),
        'accesibilidad' => sanitize_input($_POST['accesibilidad'] ?? ''),
        'recomendaria' => sanitize_input($_POST['recomendaria'] ?? ''),
        'precio' => sanitize_input($_POST['precio'] ?? ''),
        'volveria' => sanitize_input($_POST['volveria'] ?? ''),
        'imagen' => sanitize_input($_POST['imagen'] ?? ''),
        'mas_gusto' => sanitize_input($_POST['mas_gusto'] ?? ''),
        'mejorar' => sanitize_input($_POST['mejorar'] ?? ''),
        'sugerencias' => sanitize_input($_POST['sugerencias'] ?? '')
    );

    // Validate required fields
    $required_fields = ['frecuencia', 'rating_puntualidad', 'rating_comodidad', 'rating_limpieza', 
                        'rating_trato', 'rating_informacion', 'rating_ecologico', 'seguridad', 
                        'satisfaccion', 'accesibilidad', 'recomendaria', 'precio', 'volveria', 'imagen'];
    
    $missing_fields = array();
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            $missing_fields[] = $field;
        }
    }

    if (!empty($missing_fields)) {
        echo json_encode(array(
            'success' => false,
            'message' => 'Por favor, complete todos los campos obligatorios.',
            'missing_fields' => $missing_fields
        ));
        exit;
    }

    // Save to CSV file
    $csv_file = 'data/questionnaires.csv';
    
    // Create data directory if it doesn't exist
    if (!file_exists('data')) {
        mkdir('data', 0755, true);
    }

    // Check if file exists to add headers
    $file_exists = file_exists($csv_file);
    
    // Open file for appending
    $fp = fopen($csv_file, 'a');
    
    if ($fp) {
        // Add headers if file is new
        if (!$file_exists) {
            fputcsv($fp, array_keys($data));
        }
        
        // Convert arrays to strings
        $data['enteraste'] = is_array($data['enteraste']) ? implode(', ', $data['enteraste']) : $data['enteraste'];
        
        // Write data
        fputcsv($fp, $data);
        fclose($fp);
        
        // Send email notification (optional)
        $to = "info@transportelaesperanza.com";
        $subject = "Nueva Encuesta de Satisfacción";
        $message = "Se ha recibido una nueva encuesta de satisfacción.\n\n";
        $message .= "Satisfacción General: " . $data['satisfaccion'] . "/5\n";
        $message .= "Fecha: " . $data['timestamp'] . "\n";
        
        $headers = "From: noreply@transportelaesperanza.com\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // Uncomment to send email
        // mail($to, $subject, $message, $headers);
        
        echo json_encode(array(
            'success' => true,
            'message' => '¡Gracias por completar la encuesta!',
            'data_id' => uniqid()
        ));
    } else {
        echo json_encode(array(
            'success' => false,
            'message' => 'Error al guardar los datos. Por favor, intente nuevamente.'
        ));
    }

} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'Método de solicitud no válido.'
    ));
}
?>
