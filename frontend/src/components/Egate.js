import {useState} from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Radio from "./Radio";
import {Container} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {Link} from "react-router-dom";


function Egate({match, title, body, orderId}) {

    const [show, setShow] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRadioChange = (e, label) => {
        setSelectedValue(e.target.value);
        setSelectedLabel(label);
        console.log("Selected Radio Value:", e.target.value);
        console.log("Selected Radio Label:", label);
    };

    // Function to handle submit
    const handleSubmit = () => {
        console.log("Submitted Value:", selectedValue);
        handleClose();
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} className='btn btn-block'>
                Pembayaran Melalui Bank Transfer
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>

                <Container>
                    <Form>
                        <div key={`default-radio`} className="mb-3">
                            <Radio label="BNI" radioValue="009" onRadioChange={handleRadioChange}/>
                            <Radio label="Bank BCA" radioValue="014" onRadioChange={handleRadioChange}/>
                            <Radio label="Bank BRI" radioValue="002" onRadioChange={handleRadioChange}/>
                            <Radio label="Mandiri" radioValue="008" onRadioChange={handleRadioChange}/>
                            <Radio label="CIMB Niaga" radioValue="022" onRadioChange={handleRadioChange}/>
                            <Radio label="Bank Permata" radioValue="013" onRadioChange={handleRadioChange}/>
                            <Radio label="Bank Danamon" radioValue="011" onRadioChange={handleRadioChange}/>
                            <Radio label="Maybank" radioValue="016" onRadioChange={handleRadioChange}/>
                            <Radio label="Bank BSI" radioValue="451" onRadioChange={handleRadioChange}/>
                            <Radio label="Bank BNC" radioValue="490" onRadioChange={handleRadioChange}/>
                        </div>
                    </Form>

                    <Link
                        to={{pathname: `/pay/bank/${selectedValue}/${orderId}`, state: {selectedBank: selectedValue, selectedBankLabel: selectedLabel}}}>
                        <Button className={'mb-3'} variant="primary" onClick={handleSubmit}>Submit</Button>
                    </Link>
                </Container>

            </Modal>
        </>
    );
}


export default Egate;