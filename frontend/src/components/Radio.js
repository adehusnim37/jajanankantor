import React from 'react';
import Form from 'react-bootstrap/Form';
import {value} from "mongoose/lib/options/propertyOptions";

function Radio({ label, radioValue, onRadioChange }) {
    return (
        <Form.Check // prettier-ignore
            type={"radio"}
            id={`bank-${radioValue}`}
            label={label}
            value={radioValue}
            name="bankOptions"
            onChange={(e) => onRadioChange(e, label)}
        />
    );
}


export default Radio;