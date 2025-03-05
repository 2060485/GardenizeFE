import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ email: '', role: '', enableNotifications: false, enableAlarm: false });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('https://gardenizebe.onrender.com/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again.');
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.delete(`https://gardenizebe.onrender.com/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                console.error('Error deleting user:', err);
                setError('Failed to delete user. Please try again.');
            }
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user._id);
        setEditFormData({
            email: user.email,
            role: user.role,
            enableNotifications: user.settings?.enableNotifications || false, // Safe access
            enableAlarm: user.settings?.enableAlarm || false // Safe access
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                `https://gardenizebe.onrender.com/api/users/${editingUser}`,
                { ...editFormData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log("Response after update:", response.data);

            window.location.reload();
    
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">User List</h2>
            {loading && <p>Loading users...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {users.map((user) => (
                    <div key={user._id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                {editingUser === user._id ? (
                                    <form onSubmit={handleEditSubmit}>
                                        <input
                                            type="email"
                                            className="form-control mb-2"
                                            name="email"
                                            value={editFormData.email}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <div className="mb-2">
                                            <label htmlFor="role" className="form-label">Role</label>
                                            <select
                                                className="form-select"
                                                name="role"
                                                value={editFormData.role}
                                                onChange={handleEditChange}
                                                required
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="user">User</option>
                                            </select>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="enableNotifications"
                                                checked={editFormData.enableNotifications}
                                                onChange={(e) => setEditFormData({ ...editFormData, enableNotifications: e.target.checked })}
                                            />
                                            <label className="form-check-label">
                                                Enable Notifications
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="enableAlarm"
                                                checked={editFormData.enableAlarm}
                                                onChange={(e) => setEditFormData({ ...editFormData, enableAlarm: e.target.checked })}
                                            />
                                            <label className="form-check-label">
                                                Enable Alarm
                                            </label>
                                        </div>
                                        <button type="submit" className="btn btn-primary me-2">Save</button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <h5 className="card-title">User ID: {user._id}</h5>
                                        <p className="card-text">Email: {user.email}</p>
                                        <p className="card-text">Role: {user.role}</p>
                                        <p className="card-text">Notifications Enabled: {user.settings?.enableNotifications ? "Yes" : "No"}</p>
                                        <p className="card-text">Alarm Enabled: {user.settings?.enableAlarm ? "Yes" : "No"}</p>
                                        <button className="btn btn-primary me-2" onClick={() => handleEditClick(user)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserManagement;
