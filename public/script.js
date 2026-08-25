const API_URL = "/api";


// ==========================
// SHOW REGISTER
// ==========================

function showRegister() {

    document
        .getElementById("loginSection")
        .classList.add("hidden");

    document
        .getElementById("registerSection")
        .classList.remove("hidden");

}


// ==========================
// SHOW LOGIN
// ==========================

function showLogin() {

    document
        .getElementById("registerSection")
        .classList.add("hidden");

    document
        .getElementById("loginSection")
        .classList.remove("hidden");

}


// ==========================
// REGISTER
// ==========================

document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const name =
            document.getElementById("registerName").value;

        const email =
            document.getElementById("registerEmail").value;

        const password =
            document.getElementById("registerPassword").value;


        try {

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            document
                .getElementById("registerMessage")
                .innerText =
                data.message || "Registration completed";


            if (response.ok) {

                document
                    .getElementById("registerForm")
                    .reset();

                setTimeout(() => {
                    showLogin();
                }, 1000);

            }

        } catch (error) {

            document
                .getElementById("registerMessage")
                .innerText =
                "Registration failed";

            console.error(error);

        }

    });


// ==========================
// LOGIN
// ==========================

document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;


        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();


            if (!response.ok) {

                document
                    .getElementById("loginMessage")
                    .innerText =
                    data.message || "Login failed";

                return;
            }


            // Save JWT token

            localStorage.setItem(
                "token",
                data.token
            );


            // Hide login

            document
                .getElementById("loginSection")
                .classList.add("hidden");


            // Show dashboard

            document
                .getElementById("dashboardSection")
                .classList.remove("hidden");


            // Load feedback

            getFeedbacks();

        } catch (error) {

            document
                .getElementById("loginMessage")
                .innerText =
                "Login failed";

            console.error(error);

        }

    });


// ==========================
// CREATE FEEDBACK
// ==========================

document
    .getElementById("feedbackForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();


        const name =
            document.getElementById("feedbackName").value;

        const rating =
            document.getElementById("rating").value;

        const comments =
            document.getElementById("comments").value;

        const token =
            localStorage.getItem("token");


        try {

            const response = await fetch(
                `${API_URL}/feedback`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name,
                        rating,
                        comments
                    })
                }
            );

            const data = await response.json();


            document
                .getElementById("feedbackMessage")
                .innerText =
                data.message;


            if (response.ok) {

                document
                    .getElementById("feedbackForm")
                    .reset();

                getFeedbacks();

            }

        } catch (error) {

            document
                .getElementById("feedbackMessage")
                .innerText =
                "Feedback creation failed";

            console.error(error);

        }

    });


// ==========================
// GET MY FEEDBACK
// ==========================

async function getFeedbacks() {

    const token =
        localStorage.getItem("token");


    try {

        const response = await fetch(
            `${API_URL}/feedback/my-feedback`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        const feedbackList =
            document.getElementById("feedbackList");


        feedbackList.innerHTML = "";


        if (!response.ok) {

            feedbackList.innerHTML =
                `<p>${data.message || "Failed to load feedback"}</p>`;

            return;

        }


        if (!data.feedbacks ||
            data.feedbacks.length === 0) {

            feedbackList.innerHTML =
                "<p>No feedback available</p>";

            return;

        }


        data.feedbacks.forEach(function (feedback) {

            const div =
                document.createElement("div");


            div.className =
                "feedback-item";


            div.innerHTML = `

                <h3>
                    Name: ${feedback.name}
                </h3>

                <h3>
                    Rating: ${feedback.rating}/5
                </h3>

                <p>
                    Comments: ${feedback.comments}
                </p>

                <button
                    class="delete-btn"
                    onclick="deleteFeedback('${feedback._id}')"
                >
                    Delete
                </button>

            `;


            feedbackList.appendChild(div);

        });

    } catch (error) {

        console.error(error);

        document
            .getElementById("feedbackList")
            .innerHTML =
            "<p>Error loading feedback</p>";

    }

}


// ==========================
// DELETE FEEDBACK
// ==========================

async function deleteFeedback(id) {

    const token =
        localStorage.getItem("token");


    try {

        const response = await fetch(
            `${API_URL}/feedback/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message || "Failed to delete feedback"
            );

            return;

        }


        getFeedbacks();

    } catch (error) {

        console.error(error);

        alert("Error deleting feedback");

    }

}


// ==========================
// LOGOUT
// ==========================

function logout() {

    localStorage.removeItem("token");


    document
        .getElementById("dashboardSection")
        .classList.add("hidden");


    document
        .getElementById("loginSection")
        .classList.remove("hidden");

}


// ==========================
// AUTO LOGIN
// ==========================

window.addEventListener("load", function () {

    const token =
        localStorage.getItem("token");


    if (token) {

        document
            .getElementById("loginSection")
            .classList.add("hidden");


        document
            .getElementById("dashboardSection")
            .classList.remove("hidden");


        getFeedbacks();

    }

});