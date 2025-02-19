    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import 'bootstrap/dist/css/bootstrap.min.css';

    const baseURL = "https://localhost:3001/api/login";

    function SignIn() {
        const navigate = useNavigate();
        const [login, setLogin] = useState({
            email: "",
            password: "",
        });
        const [error, setError] = useState("");

        const handleChange = (e) => {
            const { name, value } = e.target;
            setLogin({ ...login, [name]: value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            if (!login.email || !login.password) {
                setError("Please fill in all fields.");
                return;
            }
        
            setError("");
            const userData = {
                email: login.email,
                password: login.password
            };
        
            try {
                const response = await axios.post(baseURL, userData);
        
                if (response.data.token) {
                    localStorage.setItem("authToken", response.data.token);
                    console.log("Logged in successfully");
                    navigate("/");
                    window.location.reload();
                }
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.error || "Invalid credentials.");
                } else {
                    setError("An error occurred. Please try again later.");
                }
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
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={login.email}
                                            onChange={handleChange}
                                            placeholder="email"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={login.password}
                                            onChange={handleChange}
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
