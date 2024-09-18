// Fetch Current user

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Return null if cookie is not found
}

const token = getCookie('accessToken');

const axiosInstance = axios.create({
    baseURL: 'https://aristone-be.vercel.app',
    headers: {
        'Authorization': token ? `Bearer ${token}` : undefined
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch user data from the API
        const response = await axiosInstance.get('/api/users/own');

        // Check if the response indicates that the user is logged in
        if (response.data.result) {
            // Hide the login and register area if the user is logged in
            console.log(response.data.result)
            const loginArea = document.querySelector('.sj-loginarea');
            if (loginArea) {
                loginArea.style.display = 'none';
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized")
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
    }
});

// Create User
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();
        handleFormSubmission('signup');
    });

    document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();
        handleFormSubmission('login');
    });
});

async function handleFormSubmission(formType) {
    const errorMsgElement = document.getElementById('error-msg');
    if (errorMsgElement) {
        errorMsgElement.textContent = '';
    }

    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();
    const firstname = document.getElementById('firstname')?.value.trim();
    const lastname = document.getElementById('lastname')?.value.trim();
    const termsAccepted = document.getElementById('terms')?.checked;
    const keepLoggedIn = document.getElementById('keepLoggedIn')?.checked;

    // Common validation for both forms
    if (formType === 'signup') {
        if (!firstname || !lastname || !email || !password) {
            errorMsgElement.textContent = 'All fields are required.';
            return;
        }

        if (!termsAccepted) {
            errorMsgElement.textContent = 'You must accept the Terms & Conditions.';
            return;
        }
    } else if (formType === 'login') {
        if (!email || !password) {
            errorMsgElement.textContent = 'All fields are required.';
            return;
        }
    }

    try {
        let response;
        if (formType === 'signup') {
            response = await axios.post('https://aristone-be.vercel.app/api/users/create', {
                firstname,
                lastname,
                email,
                password
            });

            if (response.data.result) {
                document.cookie = `accessToken=${response.data.result.accessToken}; path=/; Secure; SameSite=Strict`;
                window.location.href = '/';
            }
        } else if (formType === 'login') {
            response = await axios.post('https://aristone-be.vercel.app/api/users/login', {
                email,
                password
            });

            console.log({ response })

            if (response.data.result.accessToken) {
                document.cookie = `accessToken=${response.data.result.accessToken}; path=/; Secure; SameSite=Strict`;
                window.location.href = '/';

            } else {
                errorMsgElement.textContent = 'Login failed. Please check your username and password.';
            }
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            errorMsgElement.textContent = error.response.data.message;
        } else {
            errorMsgElement.textContent = 'An error occurred. Please try again.';
        }
    }
}



