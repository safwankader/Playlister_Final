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
        <Box
        component='div'
        id="navigation-bar">
        <Box component="div" sx={{ display: 'flex' }}>
            <Box sx={{ '& > :not(style)': { ml: 2, mr: 0.5, mt: 2} }}>
            <Fab
                size="medium"
                color="secondary"
                aria-label='home'
                onClick={handleCloseCurrentList}
                >
                <HomeIcon />
                </Fab>
            <Fab
            
                size="medium"
                color="secondary"
                aria-label='search-lists'
                >
                <ManageSearchIcon />
                </Fab>
            <Fab
                size="medium"
                color="secondary"
                aria-label='search-users'
                >
                <PeopleIcon />
                </Fab>
                
            </Box>
            <TextField 
                id="outlined-search" 
                label="Search" 
                type="search"
                sx={{display: 'flex', mt : 1.5 , width : "35%", left : "20%", background : "white", }} />
                
                <Fab
                variant='extended'
                justify='space-between'
                color="secondary"
                aria-label='sort-by'
                sx={{display: 'flex', mt : 2, justifyContent : 'flex-end', ml : 80}}
                >
                <SortIcon />
                SORT BY
                </Fab>

    
            </Box>
            
            </Box>
    )

}

export default NavigationBar;