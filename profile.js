document.addEventListener('DOMContentLoaded', async function () {
    const username = localStorage.getItem('username');
    if (username) {
        try {
            const response = await fetch(`/user/${username}`);
            if (response.ok) {
                const user = await response.json();
                document.getElementById('usernameDisplay').textContent = user.username;
                document.getElementById('fullnameDisplay').textContent = user.fullname;
                document.getElementById('emailDisplay').textContent = user.email;
                document.getElementById('genderDisplay').textContent = user.gender;
                document.getElementById('ageDisplay').textContent = user.age;
                document.getElementById('phoneDisplay').textContent = user.phone;
                document.getElementById('countryDisplay').textContent = user.country;

                // Fill edit fields with existing user data
                document.getElementById('edit-username').value = user.username;
                document.getElementById('edit-fullname').value = user.fullname;
                document.getElementById('edit-email').value = user.email;
                document.getElementById('edit-gender').value = user.gender;
                document.getElementById('edit-age').value = user.age;
                document.getElementById('edit-phone').value = user.phone;
                document.getElementById('edit-country').value = user.country;

                // Load profile picture from localStorage or server
                if (user.profileImage) {
                    document.getElementById('profileImage').src = user.profileImage;
                    localStorage.setItem('profileImage', user.profileImage);
                } else {
                    const profileImage = localStorage.getItem('profileImage');
                    if (profileImage) {
                        document.getElementById('profileImage').src = profileImage;
                    }
                }
            } else {
                alert('Failed to load user data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        window.location.href = 'login.html';
    }

    // Load preset images
    const presetImages = [
        'image1.jpg',
        'image2.jpg',
        'image3.jpg',
        'image4.jpg',
        'image5.jpg',
        'image6.jpg',
        'image7.jpg',
        'image8.jpg',
        'image9.jpg',
        'image10.jpg',
        'image11.jpg',
        'image12.jpg',
        'image13.jpg'
    ];

    const presetImagesContainer = document.getElementById('presetImagesContainer');
    presetImages.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = `preset-images/${image}`;
        imgElement.alt = 'Preset Image';
        imgElement.addEventListener('click', () => {
            document.getElementById('profileImage').src = `preset-images/${image}`;
            localStorage.setItem('profileImage', `preset-images/${image}`);
        });
        presetImagesContainer.appendChild(imgElement);
    });

    // Handle profile picture upload
    document.getElementById('uploadForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const fileInput = document.getElementById('uploadInput');
        const file = fileInput.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    const filePath = data.filePath;
                    document.getElementById('profileImage').src = filePath;
                    localStorage.setItem('profileImage', filePath);
                    // Update user profile image in server
                    updateProfileImage(username, filePath);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    });

    // Handle removing profile picture
    document.getElementById('removePhotoBtn').addEventListener('click', () => {
        document.getElementById('profileImage').src = 'default-avatar.png';
        localStorage.removeItem('profileImage');
        updateProfileImage(username, '');
    });

    document.getElementById('editProfileBtn').addEventListener('click', () => {
        document.querySelector('.user-info').classList.add('hidden');
        document.querySelector('.edit-profile').classList.remove('hidden');
    });

    document.getElementById('cancelEditBtn').addEventListener('click', () => {
        document.querySelector('.edit-profile').classList.add('hidden');
        document.querySelector('.user-info').classList.remove('hidden');
    });

    document.getElementById('editProfileForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const newUsername = document.getElementById('edit-username').value;
        const fullname = document.getElementById('edit-fullname').value;
        const email = document.getElementById('edit-email').value;
        const gender = document.getElementById('edit-gender').value;
        const age = document.getElementById('edit-age').value;
        const phone = document.getElementById('edit-phone').value;
        const country = document.getElementById('edit-country').value;

        try {
            const response = await fetch(`/user/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: newUsername, fullname, email, gender, age, phone, country, profileImage: localStorage.getItem('profileImage') || '' }),
            });

            if (response.ok) {
                alert('User data updated successfully');
                localStorage.setItem('username', newUsername);
                document.querySelector('.edit-profile').classList.add('hidden');
                document.querySelector('.user-info').classList.remove('hidden');
                document.getElementById('usernameDisplay').textContent = newUsername;
                document.getElementById('fullnameDisplay').textContent = fullname;
                document.getElementById('emailDisplay').textContent = email;
                document.getElementById('genderDisplay').textContent = gender;
                document.getElementById('ageDisplay').textContent = age;
                document.getElementById('phoneDisplay').textContent = phone;
                document.getElementById('countryDisplay').textContent = country;
            } else {
                alert('Failed to update user data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    document.getElementById('changePasswordForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;

        try {
            const response = await fetch(`/user/${username}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (response.ok) {
                alert('Password changed successfully');
            } else {
                alert('Failed to change password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    document.getElementById('show-new-password').addEventListener('change', function () {
        const passwordField = document.getElementById('new-password');
        if (this.checked) {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    });

    async function updateProfileImage(username, filePath) {
        try {
            const response = await fetch(`/user/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profileImage: filePath }),
            });

            if (!response.ok) {
                console.error('Failed to update profile image on the server');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
