import { Box } from '@mui/system';
import PeopleIcon from '@mui/icons-material/People';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Fab from '@mui/material/Fab'
import { TextField } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SortIcon from '@mui/icons-material/Sort';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function NavigationBar() {

    const { store } = useContext(GlobalStoreContext);
    function handleCloseCurrentList() {
        store.closeCurrentList()
    }

    return(
        <div
        component='div'
        id="navigation-bar">
            <Fab
                size="medium"
                color="secondary"
                aria-label='home'
                className='navbar-button'
                onClick={handleCloseCurrentList}
                sx={{ml : 1}}
                >
                <HomeIcon />
                </Fab>
            <Fab
            
                size="medium"
                color="secondary"
                aria-label='search-lists'
                className='navbar-button'
                sx={{ml : 1, }}
                >
                <ManageSearchIcon />
                </Fab>
            <Fab
                size="medium"
                color="secondary"
                aria-label='search-users'
                className='navbar-button'
                sx={{ml : 1, mr : 1}}
                >
                <PeopleIcon />
                </Fab>
                <TextField 
                id="outlined-search" 
                label="Search" 
                type="search"
                sx={{flexGrow : 0.9, mt : -0.5}} />
                
                <Fab
                variant='extended'
                justify='space-between'
                color="secondary"
                aria-label='sort-by'
                className='navbar-button'
                sx={{ml : 1, mr : 1}}
                >
                <SortIcon />
                SORT BY
                </Fab>

            
            </div>
    )

}

export default NavigationBar;