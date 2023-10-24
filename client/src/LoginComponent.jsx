import API from './API';
import React, { useState } from 'react';
import './App.css'
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function LoginComponent(props) {
    const [username, setUsername] = useState("counter1");
    const [password, setPassword] = useState("ciaociao");

    const handleSubmit = e => {
        e.preventDefault();
        doLogin(username, password, () => setWaiting(false));
    };

    return (

        <Container fluid style={{ "marginTop": "2rem" }}>
            <Row className="justify-content-evenly">
                <Col style={{ "maxWidth": "1rem", "minWidth": "30rem" }}>
                    <Card>
                        <h2>Login</h2>
                        <Container style={{ "marginTop": "0.5rem", "padding": "1rem" }}>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="username"
                                            placeholder="Username"
                                            value={username}
                                            autoFocus
                                            onChange={event => { setUsername(event.target.value); setUsernameValid(true); }} />
                                    </Form.Group>
                                </Row>
                                <br></br>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={event => { setPassword(event.target.value); setPasswordValid(true); }} />
                                    </Form.Group>
                                </Row>
                                <br></br>
                                <Button type="submit" variant="secondary">Login</Button>
                            </Form>
                        </Container>
                    </Card>
                </Col>
                <Col md="3" />
            </Row>
        </Container>
    );
}

export default LoginComponent;