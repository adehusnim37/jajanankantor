import {Button, Modal} from "react-bootstrap";
import React from "react";

const Modals = ({show, handleClose, title, children}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Tutup
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Modals;