import { Box } from '@mui/system';
import PeopleIcon from '@mui/icons-material/People';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Fab from '@mui/material/Fab'
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import SortIcon from '@mui/icons-material/Sort';
import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function NavigationBar() {

    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const menuId = 'primary-search-account-menu';

    

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function handleLoadUserPairs() {
        store.loadIdNamePairs();
    }

    function handleFindByName(){
        if(text !== ""){
            store.getPlaylistsByQuery({
                name : text
            })
            setText("");
        }

    }

    function handleFindByUser(){
        if(text !== ""){
            store.getPlaylistsByQuery({
                ownerName : text
            })

            setText("");
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
      }

      const sortbymenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );



    return(
        <div
        component='div'
        id="navigation-bar">
            <Fab
                size="medium"
                color="secondary"
                aria-label='home'
                className='navbar-button'
                onClick={handleLoadUserPairs}
                sx={{ml : 1}}
                >
                <HomeIcon />
                </Fab>
            <Fab
            
                size="medium"
                color="secondary"
                aria-label='search-lists'
                className='navbar-button'
                onClick={handleFindByName}
                sx={{ml : 1, }}
                >
                <ManageSearchIcon />
                </Fab>
            <Fab
                size="medium"
                color="secondary"
                aria-label='search-users'
                className='navbar-button'
                onClick={handleFindByUser}
                sx={{ml : 1, mr : 1}}
                >
                <PeopleIcon />
                </Fab>
                <TextField 
                id="outlined-search" 
                label="Search" 
                type="search"
                value={text}
                onChange={handleUpdateText}
                sx={{flexGrow : 0.9, mt : -0.5}} />
                
                <Fab
                variant='extended'
                justify='space-between'
                color="secondary"
                aria-controls={menuId}
                aria-haspopup="true"
                aria-label='sort-by'
                className='navbar-button'
                onClick={handleProfileMenuOpen}
                sx={{ml : 1, mr : 1}}
                >
                <SortIcon />
                SORT BY
                </Fab>
{
    sortbymenu
}
            
            </div>
    )

}

export default NavigationBar;