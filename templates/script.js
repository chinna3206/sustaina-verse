document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    
    let username = document.querySelector('#username');
    let email = document.querySelector('#emaill');
    let password = document.querySelector('#password');
    let login = document.querySelector('#Login');
    let register = document.querySelector('#Register');
    let form = document.querySelector('form');
    let username1 = document.querySelector('#Username1');
    let password1 = document.querySelector('#Password1');

    // Toggle between login and register views
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
        localStorage.clear();
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });

    // Register user
    register.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (username.value && email.value && password.value) {
            // Send a POST request to the Flask backend
            const registerData = {
                username: username.value,
                email: email.value,
                password: password.value
            };

            fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message); // Registration success
                    setTimeout(() => {
                        window.location.href = "home.html"; // Redirect to home page
                    }, 1500);
                } else {
                    alert(data.error); // Show any error messages
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Login user
    login.addEventListener('click', (e) => {
        e.preventDefault();
        
        const loginData = {
            username: username1.value,
            password: password1.value
        };

        // Send a POST request to the Flask backend
        fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Login success
                setTimeout(() => {
                    window.location.href = "home.html"; // Redirect after login
                }, 1500);
            } else {
                alert(data.error); // Show any error messages
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});
