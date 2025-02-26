import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function PlantList() {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingPlant, setEditingPlant] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: "", type: "", captorID: "" });
    const [showModal, setShowModal] = useState(false);
    const [newPlantData, setNewPlantData] = useState({ name: "", type: "", captorID: "" });
    const [captorIds, setCaptorIds] = useState([]);
    const [hasPi, setHasPi] = useState(false);
    const [addPiLoading, setAddPiLoading] = useState(false);
    const [addPiError, setAddPiError] = useState(null);
    const [piModalVisible, setPiModalVisible] = useState(false);
    const [piData, setPiData] = useState({ piId: "", authNumber: "" });
    const [deletePiModalVisible, setDeletePiModalVisible] = useState(false);
    const [deletePiId, setDeletePiId] = useState("");
    const [captorHumidity, setCaptorHumidity] = useState({});

    const plantTypes = [
        "Tropical",
        "Succulents and Cacti",
        "Mediterranean",
        "Desert",
        "Marsh and Aquatic",
        "Common Indoor",
        "Carnivorous",
        "Low Maintenance Indoor"
    ];

    useEffect(() => {
        const checkUserPis = async () => {
            try {
                const response = await axios.get("https://localhost:3001/api/pi", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });

                if (response.data.length === 0) {
                    setHasPi(false);
                    setError("No Raspberry Pi linked.");
                } else {
                    setHasPi(true);
                    fetchPlants();
                }
            } catch (err) {
                console.error("Error checking Raspberry Pi:", err);
                if (err.response && err.response.status === 404) {
                    setHasPi(false);
                    setError("No Raspberry Pi linked.");
                } else {
                    setHasPi(false);
                    setError("Failed to check Raspberry Pi. Please try again.");
                }
            }
        };

        checkUserPis();
    }, []);

    useEffect(() => {
        const fetchCaptorIds = async () => {
            try {
                const response = await axios.get("https://localhost:3001/plants/captor", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setCaptorIds(response.data);
            } catch (err) {
                console.error("Error fetching captor IDs:", err);
            }
        };

        fetchCaptorIds();
    }, []);

    const fetchPlants = async () => {
        try {
            const response = await axios.get("https://localhost:3001/plants/user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            setPlants(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching plants:", err);
            if (err.response && err.response.status === 404) {
                setError("No plants available.");
            } else {
                setError("Failed to load plants. Please try again.");
            }
            setLoading(false);
        }
    };

    const fetchCaptorHumidity = async () => {
        try {
            const response = await axios.get("https://localhost:3001/plants/captorInfo", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            const humidityData = response.data.reduce((acc, captor) => {
                acc[captor.captorid] = captor.value;
                return acc;
            }, {});

            setCaptorHumidity(humidityData);
        } catch (err) {
            console.error("Error fetching captor humidity:", err);
        }
    };

    useEffect(() => {
        if (hasPi) {
            fetchCaptorHumidity();
        }
    }, [hasPi]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this plant?")) {
            try {
                await axios.delete(`https://localhost:3001/plants/${id}`);
                setPlants(plants.filter((plant) => plant._id !== id));
            } catch (err) {
                console.error("Error deleting plant:", err);
                setError("Failed to delete plant. Please try again.");
            }
        }
    };

    const handleEditClick = (plant) => {
        setEditingPlant(plant._id);
        setEditFormData({
            name: plant.name,
            type: plant.type,
            captorID: plant.captorID || "",
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://localhost:3001/plants/${editingPlant}`, editFormData);
            setPlants(plants.map((plant) => (plant._id === editingPlant ? response.data : plant)));
            setEditingPlant(null);
            setEditFormData({ name: "", type: "", captorID: "" });
        } catch (err) {
            console.error("Error updating plant:", err);
            setError("Failed to update plant. Please try again.");
        }
    };

    const handleNewPlantChange = (e) => {
        setNewPlantData({ ...newPlantData, [e.target.name]: e.target.value });
    };

    const handleCreatePlant = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://localhost:3001/plants", newPlantData);
            setPlants([...plants, response.data]);
            setNewPlantData({ name: "", type: "", captorID: "" });
            setShowModal(false);
        } catch (err) {
            console.error("Error creating new plant:", err);
            setError("Failed to create new plant. Please try again.");
        }
    };

    const handleAddPi = async () => {
        setAddPiLoading(true);
        setAddPiError(null);

        try {
            const response = await axios.put("https://localhost:3001/api/pi", {
                piId: piData.piId,
                authNumber: piData.authNumber,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.status === 200) {
                setHasPi(true);
                setError("");
                alert("Raspberry Pi added successfully!");
                setPiModalVisible(false);
                fetchCaptorHumidity();
                fetchPlants();
            }
        } catch (err) {
            console.error("Error adding Pi:", err);
            setAddPiError("Failed to add Raspberry Pi. Please try again.");
        }
        setAddPiLoading(false);
    };

    const handleDeletePi = async () => {
        try {
            const response = await axios.put("https://localhost:3001/api/deletePi", { piId: parseInt(deletePiId, 10) }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.status === 200) {
                setError("");
                alert("Raspberry Pi deleted successfully!");
                setDeletePiModalVisible(false);
                setPlants([]);
                fetchPlants();
            }
        } catch (err) {
            console.error("Error deleting Pi:", err);
            setError("Failed to delete Raspberry Pi. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Plant List</h2>

            {loading && hasPi && <p>Loading plants...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!hasPi && (
                <div className="alert alert-warning text-center">
                    No Raspberry Pi linked. You must link a Raspberry Pi to add a plant.
                </div>
            )}

            {hasPi && (
                <div className="text-center mb-4">
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>
                        Create New Plant
                    </button>
                </div>
            )}

            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => setPiModalVisible(true)}>
                    Add Raspberry Pi
                </button>
                <button className="btn btn-danger ms-2" onClick={() => setDeletePiModalVisible(true)}>
                    Delete Raspberry Pi
                </button>
            </div>

            {deletePiModalVisible && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Raspberry Pi</h5>
                                <button type="button" className="btn-close" onClick={() => setDeletePiModalVisible(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Pi ID"
                                    value={deletePiId}
                                    onChange={(e) => setDeletePiId(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleDeletePi}>
                                    Delete Pi
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setDeletePiModalVisible(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {piModalVisible && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Raspberry Pi</h5>
                                <button type="button" className="btn-close" onClick={() => setPiModalVisible(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Pi ID"
                                    value={piData.piId}
                                    onChange={(e) => setPiData({ ...piData, piId: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Authorization Number"
                                    value={piData.authNumber}
                                    onChange={(e) => setPiData({ ...piData, authNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleAddPi}>
                                    Add Pi
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setPiModalVisible(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Plant</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Plant Name"
                                    value={newPlantData.name}
                                    onChange={handleNewPlantChange}
                                    name="name"
                                    required
                                />
                                <select
                                    className="form-select mb-2"
                                    value={newPlantData.type}
                                    onChange={handleNewPlantChange}
                                    name="type"
                                    required
                                >
                                    <option value="" disabled>Select plant type</option>
                                    {plantTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="form-select mb-2"
                                    value={newPlantData.captorID}
                                    onChange={handleNewPlantChange}
                                    name="captorID"
                                    required
                                >
                                    <option value="" disabled>Select Captor ID</option>
                                    {captorIds.map((captorId) => (
                                        <option key={captorId} value={captorId}>
                                            {captorId}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleCreatePlant}>
                                    Add Plant
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row">
                {plants.map((plant) => (
                    <div key={plant._id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                {editingPlant === plant._id ? (
                                    <form onSubmit={handleEditSubmit}>
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <select
                                            className="form-select mb-2"
                                            name="type"
                                            value={editFormData.type}
                                            onChange={handleEditChange}
                                            required
                                        >
                                            <option value="" disabled>Select plant type</option>
                                            {plantTypes.map((type, index) => (
                                                <option key={index} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            className="form-select mb-2"
                                            name="captorID"
                                            value={editFormData.captorID}
                                            onChange={handleEditChange}
                                            required
                                        >
                                            <option value="" disabled>Select Captor ID</option>
                                            {captorIds.map((captorId) => (
                                                <option key={captorId} value={captorId}>
                                                    {captorId}
                                                </option>
                                            ))}
                                        </select>
                                        <button type="submit" className="btn btn-success">Save</button>
                                    </form>
                                ) : (
                                    <>
                                        <h5>{plant.name}</h5>
                                        <p>{plant.type}</p>
                                        <p>Captor ID: {plant.captorID}</p>
                                        <p>Humidity: {captorHumidity[plant.captorID] || 'N/A'}%</p>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEditClick(plant)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger ms-2"
                                            onClick={() => handleDelete(plant._id)}
                                        >
                                            Delete
                                        </button>
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

export default PlantList;
