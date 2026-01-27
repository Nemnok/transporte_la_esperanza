<?php
/**
 * Process Job Application Form
 * Transporte Ecológico La Esperanza
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
    $nombreCompleto = sanitize_input($_POST['nombreCompleto'] ?? '');
    $email = sanitize_input($_POST['email'] ?? '');
    $telefono = sanitize_input($_POST['telefono'] ?? '');
    $direccion = sanitize_input($_POST['direccion'] ?? '');
    $posicion = sanitize_input($_POST['posicion'] ?? '');
    $experiencia = sanitize_input($_POST['experiencia'] ?? '');
    $educacion = sanitize_input($_POST['educacion'] ?? '');
    $disponibilidad = sanitize_input($_POST['disponibilidad'] ?? '');
    $habilidades = sanitize_input($_POST['habilidades'] ?? '');
    $experienciaDetalle = sanitize_input($_POST['experienciaDetalle'] ?? '');
    $motivacion = sanitize_input($_POST['motivacion'] ?? '');
    
    // Validate required fields
    if (empty($nombreCompleto) || empty($email) || empty($telefono) || empty($direccion) || 
        empty($posicion) || empty($experiencia) || empty($educacion) || empty($disponibilidad)) {
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

    // Handle CV upload
    $cv_filename = '';
    if (isset($_FILES['cv']) && $_FILES['cv']['error'] == UPLOAD_ERR_OK) {
        $allowed_types = array('application/pdf', 'application/msword', 
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        $max_size = 5 * 1024 * 1024; // 5MB
        
        if (!in_array($_FILES['cv']['type'], $allowed_types)) {
            echo json_encode(array(
                'success' => false,
                'message' => 'Formato de archivo no permitido. Use PDF, DOC o DOCX.'
            ));
            exit;
        }
        
        if ($_FILES['cv']['size'] > $max_size) {
            echo json_encode(array(
                'success' => false,
                'message' => 'El archivo CV no debe superar los 5MB.'
            ));
            exit;
        }
        
        // Create uploads directory if it doesn't exist
        if (!file_exists('uploads/cv')) {
            mkdir('uploads/cv', 0755, true);
        }
        
        // Generate unique filename
        $extension = pathinfo($_FILES['cv']['name'], PATHINFO_EXTENSION);
        $cv_filename = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9]/', '_', $nombreCompleto) . '.' . $extension;
        $cv_path = 'uploads/cv/' . $cv_filename;
        
        if (!move_uploaded_file($_FILES['cv']['tmp_name'], $cv_path)) {
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar el archivo CV.'
            ));
            exit;
        }
    }

    // Save to CSV file
    $csv_file = 'data/job_applications.csv';
    
    // Create data directory if it doesn't exist
    if (!file_exists('data')) {
        mkdir('data', 0755, true);
    }

    $file_exists = file_exists($csv_file);
    $fp = fopen($csv_file, 'a');
    
    if ($fp) {
        $data = array(
            date('Y-m-d H:i:s'),
            $nombreCompleto,
            $email,
            $telefono,
            $direccion,
            $posicion,
            $experiencia,
            $educacion,
            $disponibilidad,
            $habilidades,
            $experienciaDetalle,
            $motivacion,
            $cv_filename
        );
        
        // Add headers if file is new
        if (!$file_exists) {
            fputcsv($fp, array('Fecha', 'Nombre', 'Email', 'Teléfono', 'Dirección', 'Posición', 
                              'Experiencia', 'Educación', 'Disponibilidad', 'Habilidades', 
                              'Experiencia Detalle', 'Motivación', 'CV'));
        }
        
        fputcsv($fp, $data);
        fclose($fp);
        
        // Send email notification to HR
        $to = "rrhh@transportelaesperanza.com";
        $subject = "Nueva Solicitud de Empleo: " . $posicion;
        $email_message = "Nueva solicitud de empleo recibida:\n\n";
        $email_message .= "Nombre: " . $nombreCompleto . "\n";
        $email_message .= "Email: " . $email . "\n";
        $email_message .= "Teléfono: " . $telefono . "\n";
        $email_message .= "Posición: " . $posicion . "\n";
        $email_message .= "Experiencia: " . $experiencia . "\n";
        $email_message .= "Educación: " . $educacion . "\n";
        $email_message .= "Disponibilidad: " . $disponibilidad . "\n\n";
        $email_message .= "Motivación:\n" . $motivacion . "\n";
        
        if ($cv_filename) {
            $email_message .= "\nCV adjunto: " . $cv_filename;
        }
        
        $headers = "From: noreply@transportelaesperanza.com\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // Uncomment to send email
        // mail($to, $subject, $email_message, $headers);
        
        // Send confirmation email to applicant
        $user_subject = "Aplicación Recibida - Transporte La Esperanza";
        $user_message = "Estimado/a " . $nombreCompleto . ",\n\n";
        $user_message .= "Gracias por su interés en formar parte de Transporte Ecológico La Esperanza.\n\n";
        $user_message .= "Hemos recibido su aplicación para la posición de " . $posicion . ".\n";
        $user_message .= "Nuestro equipo de recursos humanos la revisará y nos pondremos en contacto con usted pronto.\n\n";
        $user_message .= "Saludos cordiales,\n";
        $user_message .= "Equipo de RRHH\n";
        $user_message .= "Transporte La Esperanza";
        
        $user_headers = "From: rrhh@transportelaesperanza.com\r\n";
        $user_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // Uncomment to send confirmation email
        // mail($email, $user_subject, $user_message, $user_headers);
        
        echo json_encode(array(
            'success' => true,
            'message' => '¡Aplicación enviada correctamente!',
            'application_id' => uniqid()
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
