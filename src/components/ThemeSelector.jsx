import React from 'react';
import {Form} from "react-bootstrap";

const ThemeSelector = ({ value, onChange }) => {

    return (
        <div style={{display: "flex", marginLeft: "6vw", alignItems: "center", fontSize: "1vw"}}>
            <p style={{color: "white", marginBottom: "0"}}>Dark theme</p>
            <Form.Check id="toggler" type="switch" style={{marginLeft: "1vw", width: "1.5vw", display: "flex", alignItems: "center"}} onClick={onChange} checked={value} readOnly/>
        </div>
    );
}

export default ThemeSelector;