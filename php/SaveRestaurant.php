<?php
// SaveRestaurant.php

// Path to your XML file
$xmlFilePath = '../Data/restaurant_review.xml';

// Function to update the restaurant_review.xml with new data
function updateRestaurantData($data, $xmlFilePath)
{
    try {
        // Load the XML file
        $xml = simplexml_load_file($xmlFilePath);

        foreach ($xml->restaurant as $restaurant) {
            // Find the restaurant by ID
            if ($restaurant->restaurantName == $data['id']) {
                // Update restaurant data
                $restaurant->location->address = $data['address']['street'];
                $restaurant->location->city = $data['address']['city'];
                $restaurant->location->province = $data['address']['province'];
                $restaurant->location->postalCode = $data['address']['postal_code'];
                $restaurant->summary = $data['summary'];
                $restaurant->rating = $data['rating'];

                // Save the updated XML
                $xml->asXML($xmlFilePath);

                // Return success
                return true;
            }
        }

        // If no matching restaurant is found
        return false;
    } catch (Exception $e) {
        // Handle exceptions
        error_log('Error updating restaurant data: ' . $e->getMessage());
        return false;
    }
}

// Decode JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Update restaurant data and get success status
$success = updateRestaurantData($data, $xmlFilePath);

// Send success or error message
header('Content-Type: application/json');
if ($success) {
    echo json_encode(['message' => 'Changes saved successfully']);
} else {
    echo json_encode(['message' => 'Error saving changes']);
}
?>
