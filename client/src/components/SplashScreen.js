import { Link } from 'react-router-dom'
export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <span id="main-text">Playlister</span>
            
            <div id="home-screen-buttons">
            <button class="home-screen-button" id="login-button">
            <Link to='/login/'>Login existing user</Link>
            
        </button>
        <button class="home-screen-button" id="register-button">
            Register an account
        </button>
        <button class="home-screen-button" id="guest-button">
            Continue as Guest
        </button>
        </div>
        </div>
        
    )
}