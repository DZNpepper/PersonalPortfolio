let selectedRating = 0;

function setRating(rating) {
  selectedRating = rating;
  updateStarColors();
}

function updateStarColors() {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < selectedRating) {
      star.style.color = 'red';
    } else {
      star.style.color = 'gray';
    }
  });
}

function submitReview() {
  const name = document.getElementById("reviewer-name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("message", message);

  fetch("https://formspree.io/tobydeane101@gmail.com", {
    method: "POST",
    headers: {
      "Accept": "application/json",
    },
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    console.log("Review submitted successfully:", data);
    // Optionally, display a confirmation message to the user
  })
  .catch(error => {
    console.error("Error submitting review:", error);
    // Optionally, display an error message to the user
  });
}

function showUserReviews() {
  const userReviewsContainer = document.getElementById("user-reviews-container");
  const allReviewsContainer = document.getElementById("all-reviews-container");

  userReviewsContainer.style.display = "block";
  allReviewsContainer.style.display = "none";
}

function showAllReviews() {
  const userReviewsContainer = document.getElementById("user-reviews-container");
  const allReviewsContainer = document.getElementById("all-reviews-container");

  userReviewsContainer.style.display = "none";
  allReviewsContainer.style.display = "block";
}
