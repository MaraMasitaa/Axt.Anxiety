document.addEventListener('DOMContentLoaded', function() {
    const subscribeForm = document.getElementById('subscribeForm');

    subscribeForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        window.location.href = 'https://t.me/anxiety_axt'; // Redirect to the specified URL
    });
});

