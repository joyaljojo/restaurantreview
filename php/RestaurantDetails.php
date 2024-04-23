<?php
// RestaurantDetails.php

// Function to get restaurant details by ID from XML file
function getRestaurantDetailsById($id) {
     error_log('Received Restaurant ID: ' . $id);

    $xml = simplexml_load_file('../Data/restaurant_review.xml');
    foreach ($xml->restaurant as $restaurant) {
        if ($restaurant->restaurantName == $id) {
            $address = [
                'street' => (string) $restaurant->location->address,
                'city' => (string) $restaurant->location->city,
                'province' => (string) $restaurant->location->province,
                'postal_code' => (string) $restaurant->location->postalCode,
            ];

            $details = [
                'address' => $address,
                'summary' => (string) $restaurant->summary,
                'rating' => [
                    'min' => (float) $restaurant->rating['min'],
                    'max' => (float) $restaurant->rating['max'],
                    'current' => (float) $restaurant->rating,
                ],
            ];

            // Send valid JSON response
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'data' => $details]);
            return;
        }
    }

    // If no matching restaurant is found, send an error message as JSON
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid restaurant ID']);
    return;
}

// Main logic to handle requests
if (isset($_GET['action']) && $_GET['action'] === 'getRestaurantDetails' && isset($_GET['id'])) {
    $restaurantId = $_GET['id'];
    getRestaurantDetailsById($restaurantId);
    exit;
}
?>
