import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const MaquetteGestion = () => {
    const [maquettes, setMaquettes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [ues, setUes] = useState([]);
    const [show, setShow] = useState(false);
    const [classe, setClasse] = useState('');
    const [semestre, setSemestre] = useState('');
    const [idUEs, setIdUEs] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchMaquettes();
        fetchClasses();
        fetchUEs();
    }, []);

    const fetchMaquettes = async () => {
        const response = await axios.get('/maquettes');
        setMaquettes(response.data);
    };

    const fetchClasses = async () => {
        const response = await axios.get('/classes');
        setClasses(response.data);
    };

    const fetchUEs = async () => {
        const response = await axios.get('/ues');
        setUes(response.data);
    };

    const handleAdd = async () => {
        try {
            await axios.post('/maquettes/ajouter', null, {
                params: { classe, semestre, idUEs }
            });
            fetchMaquettes();
            setShow(false);
            setMessage("Maquette ajoutée avec succès !");
        } catch (error) {
            setMessage("Ereur lors de l'ajout de la maquette !");
        }
    };

    const handleDelete = async (id) => {
        await axios.post('/maquettes/${id}/supprimer');
        fetchMaquettes();
    };

    return (
        <div className="container">
            <h2 className="my-3">Gestion des Maquettes</h2>
            {message && <Alert variant="info">{message}</Alert>}
            <Button variant="primary" onClick={() => setShow(true)}>Ajouter Maquette</Button>

            <Table striped bordered hover className="my-3">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Semestre</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {maquettes.map((maquette) => (
                        <tr key={maquette.id}>
                            <td>{maquette.nom}</td>
                            <td>{maquette.semestre}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(maquette.id)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter Maquette</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Classe</Form.Label>
                            <Form.Control as="select" onChange={(e) => setClasse(e.target.value)}>
                                <option>Choisir une classe...</option>
                                {classes.map((classe) => (
                                    <option key={classe.id} value={classe.id}>{classe.nom}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Semestre</Form.Label>
                            <Form.Control type="number" value={semestre} onChange={(e) => setSemestre(e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>UEs</Form.Label>
                            <Form.Control as="select" multiple onChange={(e) => {
                                const options = Array.from(e.target.selectedOptions).map(o => o.value);
                                setIdUEs(options);
                            }}>
                                {ues.map((ue) => (
                                    <option key={ue.id} value={ue.id}>{ue.intitule}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Fermer</Button>
                    <Button variant="primary" onClick={handleAdd}>Ajouter</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MaquetteGestion;
