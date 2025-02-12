import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('https://localhost:3001/api/login', {
                email: email,
                password: password
            });

            console.log(response.data); // Log the response object
            
            // Check if token exists in the response
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token); // Store the token in localStorage
                navigate('/'); // Navigate to home page if successful login
            } else {
                setError('Invalid credentials. Please try again.'); // Set error if credentials are incorrect
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('An error occurred. Please try again later.');
        }
    };
    
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-lg mt-5">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Sign In</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success w-100">Sign In</button>
                            </form>
                            <p className="text-center mt-3">
                                Don't have an account? <a href="/signUp">Sign Up</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
