// RestaurantReviews.js
import Config from './Config.js';

document.addEventListener('DOMContentLoaded', function () {
    // Ajax request to get restaurant names
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const restaurantNames = JSON.parse(xhr.responseText);
            populateDropdown(restaurantNames);
        }
    };
    xhr.open('GET', Config.apiUrl + '?action=getRestaurantNames', true);
    xhr.send();

    // Event listener for restaurant selection
    const dropdown = document.getElementById('drpRestaurant');
    dropdown.addEventListener('change', function () {
        const selectedRestaurantId = dropdown.value;
        console.log('Selected Restaurant ID:', selectedRestaurantId); // Add this line

        // Ajax request to get restaurant details
        const detailsXhr = new XMLHttpRequest();
        detailsXhr.onreadystatechange = function () {
            if (detailsXhr.readyState === 4) {
                if (detailsXhr.status === 200) {
                    try {
                        const restaurantDetails = JSON.parse(detailsXhr.responseText);
                        displayRestaurantDetails(restaurantDetails);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        console.log('Response:', detailsXhr.responseText);
                    }
                } else {
                    console.error('Error fetching restaurant details:', detailsXhr.statusText);
                }
            }
        };


        detailsXhr.open('GET', Config.detailsUrl + `?action=getRestaurantDetails&id=${selectedRestaurantId}`, true);
        detailsXhr.send();
    });

    // Function to populate the dropdown with restaurant names
    function populateDropdown(names) {
        const dropdown = document.getElementById('drpRestaurant');
        names.forEach((name) => {
            const option = document.createElement('option');
            option.text = name;
            option.value = name; // You may use the restaurant ID as the value if needed
            dropdown.add(option);
        });
    }

    // Function to display restaurant details in the UI
    function displayRestaurantDetails(response) {
        if (response.success) {
            const details = response.data;

            if (details.address) {
                document.getElementById('txtStreetAddress').value = details.address.street || '';
                document.getElementById('txtCity').value = details.address.city || '';
                document.getElementById('txtProvinceState').value = details.address.province || '';
                document.getElementById('txtPostalZipCode').value = details.address.postal_code || '';
            }

            document.getElementById('txtSummary').value = details.summary || '';

            // Create a dropdown for rating with options based on max and min rating
            const ratingDropdown = document.getElementById('drpRating');
            ratingDropdown.innerHTML = '';
            for (let i = details.rating.min; i <= details.rating.max; i += 0.1) {
                const option = document.createElement('option');
                option.text = i.toFixed(1);
                option.value = i.toFixed(1);
                ratingDropdown.add(option);
            }

            ratingDropdown.value = details.rating.current;
        } else {
            console.error('Error fetching restaurant details:', response.error);
            // Handle the error in the UI as needed
        }
    }
    

    // Event listener for Save Changes button
    const btnSave = document.getElementById('btnSave');
    btnSave.addEventListener('click', function () {
        // Gather updated data
        const selectedRestaurantId = dropdown.value;
        const updatedData = {
            id: selectedRestaurantId,
            address: {
                street: document.getElementById('txtStreetAddress').value,
                city: document.getElementById('txtCity').value,
                province: document.getElementById('txtProvinceState').value,
                postal_code: document.getElementById('txtPostalZipCode').value,
            },
            summary: document.getElementById('txtSummary').value,
            rating: parseFloat(document.getElementById('drpRating').value),
        };

        // Make an AJAX request to save changes
        const saveXhr = new XMLHttpRequest();
        saveXhr.onreadystatechange = function () {
            if (saveXhr.readyState === 4) {
                if (saveXhr.status === 200) {
                    const saveResponse = JSON.parse(saveXhr.responseText);
                    // Display the save response message
                    document.getElementById('lblConfirmation').textContent = saveResponse.message;
                } else {
                    console.error('Error saving restaurant details:', saveXhr.statusText);
                }
            }
        };

        saveXhr.open('POST', Config.saveUrl, true);
        saveXhr.setRequestHeader('Content-Type', 'application/json');
        saveXhr.send(JSON.stringify(updatedData));
    });



});
