import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container mt-5 pb-5">
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <div className="card shadow-lg p-4 rounded">
                        <h1 className="display-4 text-success mb-3">Welcome to Gardenize</h1>
                        <p className="lead mb-4">Our app helps you take better care of your plants and protect them from threats.</p>
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/52201732e4b0377d7c2783e1/1576604438989-E2YE5CMG55UDUS4UQ6RK/ke17ZwdGBToddI8pDm48kDHPSfPanjkWqhH6pl6g5ph7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0mwONMR1ELp49Lyc52iWr5dNb1QJw9casjKdtTg1_-y4jz4ptJBmI9gQmbjSQnNGng/Cedar+Raised+Garden+Bed"
                            alt="Plants"
                            className="img-fluid rounded mb-4"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                        />
                        <h3 className="text-primary mb-3">Key Features:</h3>
                        <div className="list-group text-start mb-4">
                            <div className="list-group-item">
                                <strong>Water Reminder:</strong>
                                <p className="mb-0">Get reminders based on the soil's humidity level to ensure your plants get enough water.</p>
                            </div>
                            <div className="list-group-item">
                                <strong>Animal Protection:</strong>
                                <p className="mb-0">Using a motion detector, the app can alert you if animals are near your plants, helping protect them from being eaten or damaged.</p>
                            </div>
                            <div className="list-group-item">
                                <strong>Alarm Notification:</strong>
                                <p className="mb-0">When a potential threat is detected, an alarm will play to scare off the animal.</p>
                            </div>
                        </div>
                        <p className="mt-3">
                            Ready to give your plants the best care they deserve? <Link to="/signUp" className="text-primary text-decoration-underline fw-bold">Let's get started!</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
