import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">Sign Up</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-primary w-100" type="submit">
                    Create Account
                </button>
            </form>
        </div>
    );
}