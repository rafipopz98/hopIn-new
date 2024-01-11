// frontend.js
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            

            alert('Login successful!');
            const g = localStorage.setItem('accessToken', data.accessToken);
            console.log(g)
            window.location.href = 'dashboard.html';
            
        } else {
            // Login failed
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}
