import React, { useState } from 'react';
import '../Styles/Login.css'
import {ToastContainer, toast} from "react-toastify";

interface FormDataRegister {
    username: string,
    real_name: string,
    password: string,
    email: string,
    date_of_birth: string,
    profile_url: string
}



export const Register = () => {
    const [formData, setFormData] = useState<FormDataRegister>({
        username: '',
        real_name: '',
        password: '',
        email: '',
        date_of_birth: '',
        profile_url: ''
    });
    const [passwordError, setPasswordError] = useState<boolean>(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if(name == 'password'){
            console.log(value)
            if (value === '') {
                setPasswordError(false);
            } else if(value.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json();
        if (response.ok) {
            toast.success(
                <div style={{ textAlign: 'center' }}>
                    <span role="img" aria-label="check" style={{ fontSize: 24 }}>✅</span>
                    <div style={{ fontWeight: 'bold', marginTop: 8 }}>¡Registro exitoso!</div>
                    <div>Bienvenido a frio.mx</div>
                </div>,
                {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                }
            );
            setFormData({
                username: '',
                real_name: '',
                password: '',
                email: '',
                date_of_birth: '',
                profile_url: ''
            });

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
    }


    return (
        <>
            <ToastContainer />
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Crea tu Cuenta</h1>
                        <p>Únete a la acción de frio.mx</p>
                    </div>
                    <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
                        <div className="input-group">
                            <label htmlFor="real_name">Nombre Completo</label>
                            <input
                                type="text"
                                name="real_name"
                                id="real_name"
                                value={formData.real_name}
                                onChange={handleChange}

                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="username">Nombre de Usuario</label>
                            <input
                                type="username"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="date">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                id="date"
                                value={formData.date_of_birth}
                                onChange={handleChange}

                            />
                        </div>
                        {
                            passwordError && <p className="error-text">La contraseña debe tener al menos 6 caracteres y contar con un caractér especial.</p>
                        }
                        <button type="submit" className="login-button">
                            Crear Cuenta
                        </button>
                    </form>
                    <p className="login-footer-text">
                        ¿Ya tienes una cuenta?{' '}
                        <a href="/login">
                            Inicia sesión
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};