import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ type, show, handleClose }) {
    const { login, signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isLogin = type === 'login';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            handleClose();
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isLogin ? 'Login' : 'Sign Up'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId={`${type}Email`}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Enter email"
                        />
                    </Form.Group>

                    <Form.Group controlId={`${type}Password`} className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant={isLogin ? 'primary' : 'success'}
                        className="mt-4 w-100"
                        disabled={loading}
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}