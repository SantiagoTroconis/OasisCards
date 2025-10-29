import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "../Context/UserContext";
import '../Styles/Login.css'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

interface fdLogin {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    real_name?: string,
    date_of_birth?: string,
    profile_url?: string
}


export const Login = () => {
    const navigate = useNavigate();
    const { login, user } = useContext(UserContext) || {};
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [formData, setFormData] = useState<fdLogin>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        real_name: '',
        date_of_birth: '',
        profile_url: ''
    });

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        if (!isLogin) {
            if (name == 'password') {
                console.log(value)
                if (value === '') {
                    setPasswordError(false);
                } else if (value.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    setPasswordError(true);
                } else {
                    setPasswordError(false);
                }
            }
        }

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLogin) {
            try {
                const response = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                console.log(data)
                if (data[0].status === 'success') {

                    const token = data[0].token;
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(atob(base64));

                    
                    const user = {
                        user_id: payload.id || null,
                        username: payload.username || null,
                        email: payload.email || null,
                        profile_url: payload.profile_url || null,
                        credit: payload.credit || 0,
                        rating: payload.rating || 0
                    };

                    // Guardar en el contexto
                    if (login) {
                        login(user);
                    }


                    navigate('/')
                } else {
                    toast.error("Error: " + data[0].message, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                    });
                    setFormData({ username: '', password: '', email: '', confirmPassword: '' });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (formData.password === formData.confirmPassword && !isLogin) {            
            try {
                const response = await fetch('http://127.0.0.1:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                if (response.ok) {
                    toast.success(
                        <div style={{ textAlign: 'center', padding: '8px 0' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#2e7d32', marginBottom: 4 }}>
                                ¡Registro exitoso!
                            </div>
                            <div style={{ fontSize: '0.95em', color: '#555' }}>
                                Tu cuenta ha sido creada. <br />¡Bienvenido a frio.mx!
                            </div>
                        </div>,
                        {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            theme: "colored"
                        }
                    );
                     setFormData({ username: '', password: '', email: '', confirmPassword: '', real_name: '', date_of_birth: '', profile_url: '' });

                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    toast.error("Error en el registro: " + data.message, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            toast.error("Ha ocurrido algo inesperado", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
            });
        }

    };


    useEffect(() => {
        setFormData({ username: '', email: '', password: '', confirmPassword: '', real_name: '', date_of_birth: '', profile_url: '' });
        setPasswordError(false);
    }, [isLogin]);

    return (
        <>
            <ToastContainer />
            <div className="auth-container">
                <div className="form-section">
                    <div className="form-container">
                        <div className="logo-section">
                            <h1 className="logo-title">Oasis Cards</h1>
                            <p className="logo-subtitle">El futuro de las cartas futbolísticas</p>
                        </div>

                        <div className="toggle-container">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`toggle-button ${isLogin ? 'active' : 'inactive'}`}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`toggle-button ${!isLogin ? 'active' : 'inactive'}`}
                            >
                                Registrarse
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} autoComplete='off'>
                            {!isLogin && (
                                <>

                                    <div className="form-group">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Correo electrónico"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="real_name"
                                            placeholder="Nombre"
                                            value={formData.real_name}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required={!isLogin}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Nombre de usuario"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required={!isLogin}
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? '-' : 'O'}
                                </button>
                            </div>

                            {!isLogin && (
                                <>
                                    <div className="form-group">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirmar contraseña"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required={!isLogin}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="password-toggle"
                                        >
                                            {showConfirmPassword ? '-' : 'O'}
                                        </button>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            placeholder="Fecha de Nacimiento"
                                            value={formData.date_of_birth}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required={!isLogin}
                                        />
                                    </div>
                                </>
                            )}

                            {
                                passwordError && <p className="error-text">La contraseña debe tener al menos 6 caracteres y contar con un caractér especial.</p>
                            }

                            <button
                                type="submit"
                                className="submit-button"
                            >
                                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                            </button>
                        </form>

                        {isLogin && (
                            <div className="forgot-password">
                                <a href="#">¿Olvidaste tu contraseña?</a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="diagonal-section">
                    <div className="diagonal-bg"></div>

                    <div className="diagonal-content">
                        <h2 className="diagonal-title">¡Bienvenido a Fifa 2.0!</h2>
                        <p className="diagonal-description">
                            Colecciona cartas de los mejores jugadores del Mundial 2026 y enfréntate a otros entrenadores en batallas épicas
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};