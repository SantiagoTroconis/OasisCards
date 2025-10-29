import '../Styles/Footer.css';

export const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content container">
                <nav className="footer-nav">
                    <a href="/terminos">Términos y condiciones</a>
                    <a href="/privacidad">Política de privacidad</a>
                    <a href="/contacto">Contacto</a>
                </nav>
                <small className="footer-copy">&copy; 2025 Oasis. Todos los derechos reservados.</small>
            </div>
        </footer>
    );
};