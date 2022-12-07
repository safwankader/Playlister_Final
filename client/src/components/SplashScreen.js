import { Link } from 'react-router-dom'
import { useContext } from 'react';
import AuthContext from '../auth'
export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    function useAsGuest(){
        auth.useAsGuest();
    }
    return (
        <div id="splash-screen">
            <span id="main-text">Playlister</span>
            <p>Create, edit and share wonderful playlists with your friends and tell them all about it!</p>
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
        <button class="home-screen-button" onClick={useAsGuest} id="guest-button">
            Continue as Guest
        </button>
        </div>
        </div>
        
    )
}