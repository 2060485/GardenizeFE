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
        const fetchPlants = async () => {
            try {
                const response = await axios.get("https://localhost:3001/plants",{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setPlants(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching plants:", err);
                setError("Failed to load plants. Please try again.");
                setLoading(false);
            }
        };
        fetchPlants();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this plant?")) {
            try {
                await axios.delete(`https://localhost:3001/plants/${id}`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setPlants(plants.filter(plant => plant._id !== id));
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
            const response = await axios.put(`https://localhost:3001/plants/${editingPlant}`, editFormData,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            setPlants(plants.map(plant => (plant._id === editingPlant ? response.data : plant)));
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
            const response = await axios.post("https://localhost:3001/plants", newPlantData,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            setPlants([...plants, response.data]);
            setNewPlantData({ name: "", type: "", captorID: "" });
            setShowModal(false);
        } catch (err) {
            console.error("Error creating new plant:", err);
            setError("Failed to create new plant. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Plant List</h2>
            {loading && <p>Loading plants...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="text-center mb-4">
                <button className="btn btn-success" onClick={() => setShowModal(true)}>
                    Create New Plant
                </button>
            </div>

            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Plant</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleCreatePlant}>
                                <div className="modal-body">
                                    <input type="text" className="form-control mb-3" placeholder="Plant Name" name="name" value={newPlantData.name} onChange={handleNewPlantChange} required />
                                    <select className="form-select mb-3" name="type" value={newPlantData.type} onChange={handleNewPlantChange} required>
                                        <option value="">Select Type</option>
                                        {plantTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <input type="text" className="form-control mb-3" placeholder="Captor ID (optional)" name="captorID" value={newPlantData.captorID} onChange={handleNewPlantChange} />
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-success">Create</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                </div>
                            </form>
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
                                        <input type="text" className="form-control mb-2" name="name" value={editFormData.name} onChange={handleEditChange} required />
                                        <select className="form-select mb-2" name="type" value={editFormData.type} onChange={handleEditChange} required>
                                            {plantTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        <input type="text" className="form-control mb-2" name="captorID" value={editFormData.captorID} onChange={handleEditChange} placeholder="Captor ID (optional)" />
                                        <button type="submit" className="btn btn-primary me-2">Save</button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setEditingPlant(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <h5 className="card-title">{plant.name}</h5>
                                        <p className="card-text">Type: {plant.type}</p>
                                        {plant.captorID && <p className="card-text">Captor ID: {plant.captorID}</p>}
                                        <button className="btn btn-primary me-2" onClick={() => handleEditClick(plant)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(plant._id)}>Delete</button>
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
