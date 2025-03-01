import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const UeManagement = () => {
  const [ues, setUes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUe, setSelectedUe] = useState(null);
  const [newUe, setNewUe] = useState({ code: "", intitule: "", credit: "", coefficient: "" });

  // 🔹 Charger les UEs depuis la base de données
  useEffect(() => {
    fetch("http://localhost:8080/ues")
      .then(response => response.json())
      .then(data => setUes(data))
      .catch(error => console.error("Erreur lors du chargement des UEs :", error));
  }, []);

  // 🔹 Ajouter un UE
  const handleAddUe = () => {
    fetch("http://localhost:8080/ues/ajouter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUe)
    })
      .then(response => response.json())
      .then(data => {
        setUes([...ues, data]);
        setShowAddModal(false);
      })
      .catch(error => console.error("Erreur lors de l'ajout de l'UE :", error));
  };

  // 🔹 Modifier un UE
  const handleEditUe = () => {
    fetch(`http://localhost:8080/ues/${selectedUe.id}/modifier`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedUe)
    })
      .then(response => response.json())
      .then(updatedUe => {
        setUes(ues.map(ue => (ue.id === updatedUe.id ? updatedUe : ue)));
        setShowEditModal(false);
      })
      .catch(error => console.error("Erreur lors de la modification de l'UE :", error));
  };

  // 🔹 Supprimer un UE
  const handleDeleteUe = () => {
    fetch(`http://localhost:8080/ues/${selectedUe.id}/supprimer`, { method: "DELETE" })
      .then(() => {
        setUes(ues.filter(ue => ue.id !== selectedUe.id));
        setShowDeleteModal(false);
      })
      .catch(error => console.error("Erreur lors de la suppression de l'UE :", error));
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">La liste des UE</h3>
      <Button variant="success" onClick={() => setShowAddModal(true)}>Ajouter UE</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Code</th>
            <th>Intitulé</th>
            <th>Crédit</th>
            <th>Coefficient</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ues.map(ue => (
            <tr key={ue.id}>
              <td>{ue.code}</td>
              <td>{ue.intitule}</td>
              <td>{ue.credit}</td>
              <td>{ue.coefficient}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => { setSelectedUe(ue); setShowEditModal(true); }}>Modifier</Button>
                <Button variant="danger" size="sm" onClick={() => { setSelectedUe(ue); setShowDeleteModal(true); }} className="ml-2">Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Ajouter */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton><Modal.Title>Ajouter un UE</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control type="text" onChange={e => setNewUe({ ...newUe, code: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Intitulé</Form.Label>
              <Form.Control type="text" onChange={e => setNewUe({ ...newUe, intitule: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Crédit</Form.Label>
              <Form.Control type="number" onChange={e => setNewUe({ ...newUe, credit: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Coefficient</Form.Label>
              <Form.Control type="number" onChange={e => setNewUe({ ...newUe, coefficient: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleAddUe}>Enregistrer</Button>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Annuler</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Modifier */}
      {selectedUe && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton><Modal.Title>Modifier UE</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Code</Form.Label>
                <Form.Control type="text" value={selectedUe.code} onChange={e => setSelectedUe({ ...selectedUe, code: e.target.value })} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Intitulé</Form.Label>
                <Form.Control type="text" value={selectedUe.intitule} onChange={e => setSelectedUe({ ...selectedUe, intitule: e.target.value })} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Crédit</Form.Label>
                <Form.Control type="number" value={selectedUe.credit} onChange={e => setSelectedUe({ ...selectedUe, credit: e.target.value })} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Coefficient</Form.Label>
                <Form.Control type="number" value={selectedUe.coefficient} onChange={e => setSelectedUe({ ...selectedUe, coefficient: e.target.value })} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={handleEditUe}>Enregistrer</Button>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Annuler</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal Supprimer */}
      {selectedUe && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton><Modal.Title>Supprimer UE</Modal.Title></Modal.Header>
          <Modal.Body>Êtes-vous sûr de vouloir supprimer cet UE ?</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteUe}>Supprimer</Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UeManagement;
