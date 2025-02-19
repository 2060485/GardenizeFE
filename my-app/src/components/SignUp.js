import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function SignUp() {
    const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        
        if (!emailRegex.test(formData.email)) {
            setError("Invalid email format");
            return;
        }
        if (!passwordRegex.test(formData.password)) {
            setError("Password must be at least 8 characters long and contain both letters and numbers");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError(""); 

        try {
            const response = await axios.post("https://localhost:3001/api/users", {
                email: formData.email,
                password: formData.password,
            });
            console.log("Sign up successful:", response.data);
            navigate("/SignIn"); 
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError("Account with this email already exists.");
            } else {
                console.error("Sign up failed", error);
                setError("Sign up failed. Please try again.");
            }
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-lg mt-5">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Sign Up</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success w-100">Sign Up</button>
                            </form>
                            <p className="text-center mt-3">
                                Already have an account? <a href="/signIn">Sign In</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
