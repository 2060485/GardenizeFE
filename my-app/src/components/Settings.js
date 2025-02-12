import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Settings() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [alarmEnabled, setAlarmEnabled] = useState(false);

    const handleNotificationsChange = () => {
        setNotificationsEnabled(prevState => !prevState);
    };

    const handleAlarmChange = () => {
        setAlarmEnabled(prevState => !prevState);
    };

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow-lg">
                <h2 className="mb-4">Settings</h2>
                <form>
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
