document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('.tab a');
    const tabContents = document.querySelectorAll('.tab-content > div');

    tabLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            tabLinks.forEach(link => link.parentElement.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.parentElement.classList.add('active');
            document.querySelector(this.getAttribute('href')).classList.add('active');
        });
    });

    document.getElementById('registerForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const fullname = document.getElementById('reg-fullname').value;
        const gender = document.getElementById('reg-gender').value;
        const age = document.getElementById('reg-age').value;
        const phone = document.getElementById('reg-phone').value;
        const email = document.getElementById('reg-email').value;
        const country = document.getElementById('reg-country').value;
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        // Age validation
        if (age < 18) {
            alert('Age must be at least 18.');
            return;
        }

        // Phone number validation
        const phonePattern = /^\+?[0-9]{10,12}$/;
        if (!phonePattern.test(phone)) {
            alert('Invalid phone number format.');
            return;
        }

        // Password validation
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            alert('Password must be at least 8 characters long, include uppercase and lowercase letters, numbers, and special characters.');
            return;
        }

        // Hash the password
        const hashedPassword = await sha256(password);

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullname, gender, age, phone, email, country, username, password: hashedPassword }),
        });

        const message = await response.text();
        alert(message);

        if (response.status === 201) {
            localStorage.setItem('username', username);
            window.location.href = 'profile.html';
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Hash the password
        const hashedPassword = await sha256(password);

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password: hashedPassword }),
        });

        const message = await response.text();
        alert(message);

        if (response.status === 200) {
            localStorage.setItem('username', username);
            window.location.href = 'profile.html';
        }
    });

    document.getElementById('show-password').addEventListener('change', function () {
        const passwordField = document.getElementById('reg-password');
        if (this.checked) {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    });

    document.getElementById('login-show-password').addEventListener('change', function () {
        const passwordField = document.getElementById('login-password');
        if (this.checked) {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    });

    // Function to hash the password
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
});
