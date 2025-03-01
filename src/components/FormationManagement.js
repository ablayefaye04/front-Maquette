import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const FormationManagement = () => {
  const [formations, setFormations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [newFormation, setNewFormation] = useState({ intitule: "", archive: false });

  useEffect(() => {
    fetch("http://localhost:8080/formations")
      .then((response) => response.json())
      .then((data) => setFormations(data))
      .catch((error) => console.error("Erreur lors du chargement des formations :", error));
  }, []);

  const handleAddFormation = () => {
    fetch("http://localhost:8080/formations/ajouter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFormation)
    })
      .then((response) => response.json())
      .then((data) => {
        setFormations([...formations, data]);
        setShowAddModal(false);
      })
      .catch((error) => console.error("Erreur lors de l'ajout de la formation :", error));
  };

  const handleEditFormation = () => {
    fetch(`http://localhost:8080/formations/${selectedFormation.id}/modifier`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedFormation)
    })
      .then((response) => response.json())
      .then((updatedFormation) => {
        setFormations(formations.map((formation) => (formation.id === updatedFormation.id ? updatedFormation : formation)));
        setShowEditModal(false);
      })
      .catch((error) => console.error("Erreur lors de la modification de la formation :", error));
  };

  const handleArchiveFormation = (id) => {
    fetch(`http://localhost:8080/formations/${id}/archiver`, { method: "PUT" })
      .then((response) => response.json())
      .then((archivedFormation) => {
        setFormations(formations.map((formation) => (formation.id === archivedFormation.id ? archivedFormation : formation)));
      })
      .catch((error) => console.error("Erreur lors de l'archivage de la formation :", error));
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Gestion des Formations</h3>
      <Button variant="success" onClick={() => setShowAddModal(true)}>
        Ajouter Formation
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Intitulé</th>
            <th>Archive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {formations.map((formation) => (
            <tr key={formation.id}>
              <td>{formation.intitule}</td>
              <td>{formation.archive ? "Oui" : "Non"}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => {
                    setSelectedFormation(formation);
                    setShowEditModal(true);
                  }}
                >
                  Modifier
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleArchiveFormation(formation.id)}
                  className="ml-2"
                >
                  {formation.archive ? "Désarchiver" : "Archiver"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Ajouter */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Formation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Intitulé</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setNewFormation({ ...newFormation, intitule: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleAddFormation}>
            Enregistrer
          </Button>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Modifier */}
      {selectedFormation && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier Formation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Intitulé</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedFormation.intitule}
                  onChange={(e) => setSelectedFormation({ ...selectedFormation, intitule: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={handleEditFormation}>
              Enregistrer
            </Button>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default FormationManagement;
