import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
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
                <button className="btn btn-success w-100" type="submit">
                    Log In
                </button>
            </form>
        </div>
    );
}