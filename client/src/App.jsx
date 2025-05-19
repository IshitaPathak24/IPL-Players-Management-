import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function App() {
  const [players, setPlayers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    country: '',
    runs: '',
    image: '',
    role: '',
    salary: ''
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    team: '',
    country: '',
    runs: '',
    image: '',
    role: '',
    salary: ''
  });

  // Fetch All Players Data
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:5500');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  // Handle Delete Action
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this player?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5500/${id}`);
      setPlayers(players.filter(player => player._id !== id));
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  // Handle Add Form Changes
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Add Form Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5500', formData);
      setPlayers([...players, response.data]);
      setFormData({
        name: '',
        team: '',
        country: '',
        runs: '',
        image: '',
        role: '',
        salary: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  // Handle Edit Form Changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Edit Form Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5500/${editFormData._id}`, editFormData);
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) =>
          p._id === editFormData._id ? response.data : p
        )
      );
      
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };
  

  return (
    <>
      <section className='mt-2'>
        <div className="container">
          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-between align-items-center bg-dark text-white px-4">
              <h2 className='py-2'>IPL Team Players List</h2>
              <Button variant="success" onClick={() => setShowAddModal(true)}>+ Add Player</Button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <table className="table table-striped table-responsive">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Team</th>
                    <th>Country</th>
                    <th>Role</th>
                    <th>Runs</th>
                    <th>Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {players.length > 0 ? (
                    players.map((player, index) => (
                      <tr key={player._id || index}>
                        <th scope="row">{index + 1}</th>
                        <td>{player.name}</td>
                        <td><img src={player.image} alt={player.name} width="50" /></td>
                        <td>{player.team}</td>
                        <td>{player.country}</td>
                        <td>{player.role}</td>
                        <td>{player.runs}</td>
                        <td>{player.salary}</td>
                        <td>
                          <div className='d-flex justify-content-around'>
                          <FaEdit
  style={{ color: 'blue', cursor: 'pointer' }}
  onClick={() => {
    setEditFormData({ ...player }); // ✅ includes _id
    setShowEditModal(true);
  }}
/>

                            <MdDelete
                              onClick={() => handleDelete(player._id)}
                              style={{ cursor: 'pointer', color: 'red' }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">Loading...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Add Player Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleAddChange} required />
            </Form.Group>

            <Form.Group controlId="team">
              <Form.Label>Team</Form.Label>
              <Form.Control type="text" name="team" value={formData.team} onChange={handleAddChange} required />
            </Form.Group>

            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control type="text" name="country" value={formData.country} onChange={handleAddChange} required />
            </Form.Group>

            <Form.Group controlId="runs">
              <Form.Label>Runs</Form.Label>
              <Form.Control type="number" name="runs" value={formData.runs} onChange={handleAddChange} required />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="url" name="image" value={formData.image} onChange={handleAddChange} required />
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" name="role" value={formData.role} onChange={handleAddChange} required />
            </Form.Group>

            <Form.Group controlId="salary">
              <Form.Label>Salary</Form.Label>
              <Form.Control type="number" name="salary" value={formData.salary} onChange={handleAddChange} required />
            </Form.Group>

            <Button variant="primary" type="submit" className='mt-3'>Add Player</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Player Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editFormData && (
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="editName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="editTeam">
                <Form.Label>Team</Form.Label>
                <Form.Control
                  type="text"
                  name="team"
                  value={editFormData.team}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="editCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={editFormData.country}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="editRuns">
                <Form.Label>Runs</Form.Label>
                <Form.Control
                  type="number"
                  name="runs"
                  value={editFormData.runs}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="editImage">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  value={editFormData.image}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="editRole">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="editSalary">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={editFormData.salary}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">Update Player</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
