import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Settings() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [alarmEnabled, setAlarmEnabled] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const response = await axios.get('https://localhost:3001/api/settings', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    }
                });
                
                const { enableNotifications, enableAlarm } = response.data;
                
                setNotificationsEnabled(enableNotifications);
                setAlarmEnabled(enableAlarm);
            } catch (err) {
                console.error('Error fetching settings:', err);
                setError('Failed to fetch settings');
            }
        };

        fetchUserSettings();
    }, []);

    const handleNotificationsChange = () => {
        setNotificationsEnabled(prevState => !prevState);
    };

    const handleAlarmChange = () => {
        setAlarmEnabled(prevState => !prevState);
    };

    const handleSaveSettings = async () => {
        try {
            const response = await axios.put('https://localhost:3001/api/settings',
                {
                    enableNotifications: notificationsEnabled,
                    enableAlarm: alarmEnabled,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    }
                }
            );
            if (response.status === 200) {
                alert('Settings updated successfully');
            } else {
                setError('Failed to update settings');
            }
        } catch (err) {
            console.error('Error saving settings:', err);
            setError('Failed to save settings');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow-lg">
                <h2 className="mb-4">Settings</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
                    <div className="mb-3 d-flex justify-content-between">
                        <label htmlFor="notifications" className="form-label">Enable Notifications</label>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="notifications"
                                checked={notificationsEnabled}
                                onChange={handleNotificationsChange}
                            />
                        </div>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                        <label htmlFor="alarm" className="form-label">Enable Alarm</label>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="alarm"
                                checked={alarmEnabled}
                                onChange={handleAlarmChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success">Save Settings</button>
                </form>
            </div>
        </div>
    );
}

export default Settings;
