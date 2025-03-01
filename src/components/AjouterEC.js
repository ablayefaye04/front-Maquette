import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const EcManagement = () => {
  const [ecs, setEcs] = useState([]);
  const [ues, setUes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEc, setSelectedEc] = useState(null);
  const [newEc, setNewEc] = useState({
    code: "",
    intitule: "",
    CM: "",
    TD: "",
    TP: "",
    coefficient: "",
    ue: ""
  });

  useEffect(() => {
    fetch("http://localhost:8080/ecs")
      .then((response) => response.json())
      .then((data) => setEcs(data))
      .catch((error) => console.error("Erreur lors du chargement des ECs :", error));

    fetch("http://localhost:8080/ues")
      .then((response) => response.json())
      .then((data) => setUes(data))
      .catch((error) => console.error("Erreur lors du chargement des UEs :", error));
  }, []);

  const handleAddEc = () => {
    // Validation des champs
    if (!newEc.code || !newEc.intitule || !newEc.coefficient || !newEc.idUE) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const ecToSend = {
      code: newEc.code,
      intitule: newEc.intitule,
      CM: Number(newEc.CM),
      TD: Number(newEc.TD),
      TP: Number(newEc.TP),
      coefficient: Number(newEc.coefficient)
    };

    fetch(`http://localhost:8080/ecs/${newEc.idUE}/ajouter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ecToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur HTTP : " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        // Rafraîchir la liste des ECs après ajout
        fetch("http://localhost:8080/ecs")
          .then((response) => response.json())
          .then((data) => setEcs(data))
          .catch((error) => console.error("Erreur lors du rechargement des ECs :", error));

        setShowAddModal(false);

        // Réinitialiser le formulaire
        setNewEc({
          code: "",
          intitule: "",
          CM: "",
          TD: "",
          TP: "",
          coefficient: "",
          ue: ""
        });
      })
      .catch((error) => console.error("Erreur lors de l'ajout de l'EC :", error));
  };

  const handleEditEc = () => {
    fetch(`http://localhost:8080/ecs/${selectedEc.id}/modifier`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedEc)
    })
      .then((response) => response.json())
      .then((updatedEc) => {
        setEcs(ecs.map((ec) => (ec.id === updatedEc.id ? updatedEc : ec)));
        setShowEditModal(false);
      })
      .catch((error) => console.error("Erreur lors de la modification de l'EC :", error));
  };

  const handleDeleteEc = () => {
    fetch(`http://localhost:8080/ecs/${selectedEc.id}/supprimer`, { method: "DELETE" })
      .then(() => {
        setEcs(ecs.filter((ec) => ec.id !== selectedEc.id));
        setShowDeleteModal(false);
      })
      .catch((error) => console.error("Erreur lors de la suppression de l'EC :", error));
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">La liste des EC</h3>
      <Button variant="success" onClick={() => setShowAddModal(true)}>
        Ajouter EC
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Code</th>
            <th>Intitulé</th>
            <th>CM</th>
            <th>TD</th>
            <th>TP</th>
            <th>Coefficient</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ecs.map((ec) => (
            <tr key={ec.id}>
              <td>{ec.code}</td>
              <td>{ec.intitule}</td>
              <td>{ec.CM}</td>
              <td>{ec.TD}</td>
              <td>{ec.TP}</td>
              <td>{ec.coefficient}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => { setSelectedEc(ec); setShowEditModal(true); }}>Modifier</Button>
                <Button variant="danger" size="sm" onClick={() => { setSelectedEc(ec); setShowDeleteModal(true); }} className="ml-2">Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Ajouter */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un EC</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewEc({ ...newEc, code: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Intitulé</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewEc({ ...newEc, intitule: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>CM</Form.Label>
              <Form.Control type="number" onChange={(e) => setNewEc({ ...newEc, CM: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>TD</Form.Label>
              <Form.Control type="number" onChange={(e) => setNewEc({ ...newEc, TD: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>TP</Form.Label>
              <Form.Control type="number" onChange={(e) => setNewEc({ ...newEc, TP: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Coefficient</Form.Label>
              <Form.Control type="number" onChange={(e) => setNewEc({ ...newEc, coefficient: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>UE</Form.Label>
              <Form.Control as="select" onChange={(e) => setNewEc({ ...newEc, idUE: Number(e.target.value) })}>
  <option value="">Sélectionner une UE</option>
  {Array.isArray(ues) && ues.length > 0 ? (
    ues.map((ue) => (
      <option key={ue.id} value={ue.id}>
        {ue.intitule}
      </option>
    ))
  ) : (
    <option disabled>Aucune UE disponible</option>
  )}
</Form.Control>

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleAddEc}>Enregistrer</Button>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Annuler</Button>
        </Modal.Footer>
      </Modal>
 
   

      {/* Modal Modifier */}
      {selectedEc && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier EC</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedEc.code}
                  onChange={(e) =>
                    setSelectedEc({ ...selectedEc, code: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Intitulé</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedEc.intitule}
                  onChange={(e) =>
                    setSelectedEc({ ...selectedEc, intitule: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>CM</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedEc.CM}
                  onChange={(e) =>
                    setSelectedEc({ ...selectedEc, CM: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>TD</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedEc.TD}
                  onChange={(e) =>
                    setSelectedEc({ ...selectedEc, TD: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>TP</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedEc.TP}
                  onChange={(e) =>
                    setSelectedEc({ ...selectedEc, TP: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Coefficient</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedEc.coefficient}
                  onChange={(e) =>
                    setSelectedEc({ ...selectedEc, coefficient: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>UE</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedEc.ue}
                  onChange={(e) =>
                    setSelectedEc({ ...selectedEc, ue: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={handleEditEc}>
              Enregistrer
            </Button>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Annuler  
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal Supprimer */}
      {selectedEc && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Supprimer EC</Modal.Title>
          </Modal.Header>
          <Modal.Body>Êtes-vous sûr de vouloir supprimer cet EC ?</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteEc}>
              Supprimer
            </Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default EcManagement;
