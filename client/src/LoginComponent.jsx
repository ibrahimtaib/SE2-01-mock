import API from './API';
import React, { useState } from 'react';
import './App.css'
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import { Link, useNavigate } from "react-router-dom";

function LoginComponent(props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("counter1");
    const [password, setPassword] = useState("ciaociao");
    const [errorMessage, setErrorMessage] = useState('');

    const doLogin = (username, password, onFinish) => {
        API.login(username, password)
            .then(user => {
                props.loginSuccessful(user);
            })
            .catch(err => {
                setErrorMessage('Errore login!');
            })
            .finally(() => onFinish?.());
    }
    const handleSubmit = e => {
        e.preventDefault();
        doLogin(username, password, () => props.setWaiting(false));
    };

    return (

        <div className="fullscreen-container">
            <div className='queue'>
                <Row className="justify-content-evenly">
                    <Col>
                        <Card>
                            <h2 style={{ "color": "black" }}>Login</h2>
                            <Container style={{ "marginTop": "0.5rem", "padding": "1rem" }}>
                                <Form noValidate onSubmit={handleSubmit}>
                                    {errorMessage ? <Alert style={{"color" : "black"}}dismissible onClick={() => setErrorMessage('')}>{errorMessage}</Alert> : ''}
                                    <Row className="mb-3">
                                        <Form.Group as={Col}>
                                            <Form.Control
                                                type="username"
                                                placeholder="Username"
                                                value={username}
                                                autoFocus
                                                onChange={event => { setUsername(event.target.value); }} />
                                        </Form.Group>
                                    </Row>
                                    <br></br>
                                    <Row className="mb-3">
                                        <Form.Group as={Col}>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={event => { setPassword(event.target.value); }} />
                                        </Form.Group>
                                    </Row>
                                    <br></br>
                                    <Button type="submit" variant="secondary">Login</Button>
                                    <Button type="submit" variant="secondary" href="/" active={false} onClick={event => { event.preventDefault(); navigate("/"); }}>Home</Button>
                                </Form>
                            </Container>
                        </Card>
                    </Col>
                    <Col md="3" />
                </Row>
            </div>

        </div>
    );
}

function LogoutButton(props) {
    return (
        <Button variant='outline-light' onClick={props.logout}>Logout</Button>
    )
}

export { LoginComponent, LogoutButton };

