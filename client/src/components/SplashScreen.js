import { Link } from 'react-router-dom'
export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <span id="main-text">Playlister</span>
            
            <div id="home-screen-buttons">
                <Link to='/login/'><button class="home-screen-button" id="login-button">
                    Login existing user
                </button>
            </Link>
            <Link to='/register/'>
            <button class="home-screen-button" id="register-button">
                Register an account
            </button>
        </Link>
        <button class="home-screen-button" id="guest-button">
            Continue as Guest
        </button>
        </div>
        </div>
        
    )
}