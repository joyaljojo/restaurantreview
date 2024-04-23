<?php
// RestaurantReviews.php

// Function to get restaurant names from XML file
function getRestaurantNames() {
  $xml = simplexml_load_file('../Data/restaurant_review.xml');
  $names = [];
  foreach ($xml->restaurant as $restaurant) {
    $names[] = (string)$restaurant->restaurantName;
  }
  return $names;
}

// Main logic to handle requests
if (isset($_GET['action']) && $_GET['action'] === 'getRestaurantNames') {
  header('Content-Type: application/json');
  echo json_encode(getRestaurantNames());
  exit;
}

?>
