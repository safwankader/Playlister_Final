import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api, { updatePlaylistById } from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    GET_PLAYLIST : "GET_PLAYLIST",
    UPDATE_PLAYLIST : "UPDATE_PLAYLIST",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    PUBLISH_CURRENT_LIST : "PUBLISH_CURRENT_LIST",
    SET_SONG_TO_PLAY : "SET_SONG_TO_PLAY"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {

     // HANDLE KEY PRESSES. UNDO IF CTRL+Z, REDO IF CTRL+Y
     const handleKeyPress = useCallback((event) => {
        if (event.ctrlKey) {
            if (event.key === 'z') {
                store.undo()
            }
            if (event.key === 'y') {
                store.redo()
            }
        }
    }, []);

    useEffect(() => {
        // ATTACH THE EVENT LISTENER
        document.addEventListener('keydown', handleKeyPress);

        // REMOVE THE EVENT LISTENER
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        listToUpdate : null,
        newListCounter: 0,
        playerList: null,
        playerListName : "",
        queue: [],
        songNumberPlaying: 0,
        songInPlayer: "",
        songNamePairs: [{
            title : "",
            artist : "",
            youTubeId : ""
        }],
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
    
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: null,
                    playerListName : "",
                    queue: [],
                    songNumberPlaying: 0,
                    songInPlayer: "",
                    songNamePairs: [{
                    title : "",
                    artist : "",
                    youTubeId : ""
                    }],
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter + 1,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }


            // UPDATE A PLAYLIST 
            case GlobalStoreActionType.UPDATE_PLAYLIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : payload,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }

            case GlobalStoreActionType.SET_SONG_TO_PLAY: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: payload.playerList,
                    playerListName : payload.playerListName,
                    queue: payload.queue,
                    songNumberPlaying: payload.songNumberPlaying,
                    songInPlayer: payload.songInPlayer,
                    songNamePairs: payload.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                });
            }
            // PUBLISH CURRENT LIST
            case GlobalStoreActionType.PUBLISH_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }

            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listToUpdate : store.listToUpdate,
                    newListCounter: store.newListCounter,
                    playerList: store.playerList,
                    playerListName : store.playerListName,
                    queue: store.queue,
                    songNumberPlaying: store.songNumberPlaying,
                    songInPlayer: store.songInPlayer,
                    songNamePairs: store.songNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: null
        });
        tps.clearAllTransactions();
        history.push("/");
    }


    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.userName, []);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            store.loadIdNamePairs();
            history.push('/');
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.duplicateCurrentList = async function() {
        let newListName = `${store.currentList.name} ${store.newListCounter}`;
        const response = await api.createPlaylist(newListName, store.currentList.songs, auth.user.email, auth.user.userName,[])
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            store.loadIdNamePairs();
            history.push('/');
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }

    }

    store.loadAllPlaylistPairs = function() {
        async function asyncLoadAllPlaylistPairs(){
            const response = await api.getAllPlaylistPairs();
            if(response.data.success){
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadAllPlaylistPairs();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.getPlaylistsByQuery = function(query){
        async function asyncGetPlaylistsByQuery(query){
            const response = await api.getPlaylistsByQuery(query);
            if(response.data.success){
                let pairsArray = response.data.idNamePairs;
                let queriedArray = "";
                console.log(pairsArray);
                if (query.name && query.ownerName){
                    console.log("BOTH")
                    queriedArray = pairsArray.filter((pair,index) =>(pair.name === query.name && (pair.owner === query.ownerName || pair.ownerName === query.ownerName)))
                }
                else if(query.ownerName){
                    queriedArray = pairsArray.filter((pair,index) =>(pair.ownerName === query.ownerName || pair.owner === query.ownerName))
                }
                else if(query.name){
                    queriedArray = pairsArray.filter((pair,index) =>(pair.name === query.name))
                }
                

                console.log(queriedArray);
                
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: queriedArray
                });
                history.push('/')
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncGetPlaylistsByQuery(query);
    }

    store.publishList = function(id) {
        async function asyncPublishList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.published = true;
                playlist.publishedAt = new Date();
                console.log(playlist)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.PUBLISH_CURRENT_LIST,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                store.loadIdNamePairs();

                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncPublishList(id);
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.loadIdNamePairs();
        store.hideModals();
    }

    // store.showDeleteModal(){

    // }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        console.log("EDITING A SONG")
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });      

    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    //

    store.playNextOrPrevSong = function (isNext) {
        let songIndex = store.songNumberPlaying;
        console.log("store songs", store.queue.length)
        if (isNext && songIndex < store.queue.length - 1) {
            songIndex++;
        } else if (!isNext && songIndex > 0) {
            songIndex--;
        }
        console.log("SONG INDEX", songIndex)
        storeReducer({
            type: GlobalStoreActionType.SET_SONG_TO_PLAY,
            payload: {
                playerList : store.playerList,
                playerListName : store.PlayerListName,
                queue : store.queue,
                songNumberPlaying: songIndex,
                songInPlayer: store.queue[songIndex],
                songNamePairs: store.songNamePairs,
                idNamePairs : store.idNamePairs
            }
        });
    }


    store.changeQueueSong = function(id, index) {
        async function changeQueueSong(id,index) {
            let response = await api.getPlaylistById(id);
            if(response.data.success){
                let playlist = response.data.playlist;
                let updatedNamePairs = store.idNamePairs;

                let urls = store.queue;
                if(!store.playerList || store.playerList._id !== id){
                    urls = []
                    if (playlist.songs.length > 0) {
                        for (let i = 0; i < playlist.songs.length; i++) {
                            urls.push(playlist.songs[i].youTubeId)
                        }
                    playlist.listens++;
                    updatedNamePairs[index].listens++;
                }
            }

            response = await updatePlaylistById(id,playlist);
            if(response.data.success){
                let queueObject = {
                    playerList : playlist,
                    playerListName : playlist.name,
                    queue: urls,
                    songNumberPlaying: index,
                    songInPlayer: urls[index],
                    songNamePairs: playlist.songs,
                    idNamePairs : updatedNamePairs
                };
               
                storeReducer({
                    type: GlobalStoreActionType.SET_SONG_TO_PLAY,
                    payload: queueObject
                });

                history.push('/')
                }
        
            }
        }
        changeQueueSong(id,index);

    }


    store.updateQueue = function (id) {
        async function playFromBeginning(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {

                let playlist = response.data.playlist;

                let updatedNamePairs = store.idNamePairs;

                let index = updatedNamePairs.findIndex(pair => pair._id === id)

                if(!store.playerList || store.playerList._id !== id && store.playerList.published){
                    playlist.listens++;
                    updatedNamePairs[index].listens++;
                }

                

                
                let urls = []
                if (playlist.songs.length > 0) {
                    for (let i = 0; i < playlist.songs.length; i++) {
                        urls.push(playlist.songs[i].youTubeId)
                    }

                    console.log(playlist.songs);


                    response = await updatePlaylistById(id,playlist);
                    if(response.data.success){
                        let queueObject = {
                            playerList : playlist,
                            playerListName : playlist.name,
                            queue: urls,
                            songNumberPlaying: 0,
                            songInPlayer: urls[0],
                            songNamePairs: playlist.songs,
                            idNamePairs : updatedNamePairs
                        };
                       
                        storeReducer({
                            type: GlobalStoreActionType.SET_SONG_TO_PLAY,
                            payload: queueObject
                        });

                        history.push('/')
                    }
                    
                    
                }
            }
        }
        playFromBeginning(id);
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });

            }
        }
        asyncSetCurrentList(id);
    }

    

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
    let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
    tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }

    store.addComment = function(comment){
        async function asyncAddComment(comment){
            let response = await api.getPlaylistById(store.playerList._id)
                if(response.data.success){
                    let playlist = response.data.playlist;
                    playlist.comments.push({
                        owner : `${auth.user.userName}`,
                        comment : comment
                    })
                    response = await api.updatePlaylistById(store.playerList._id,playlist)
                    if(response.data.success){
                        let queueObject = {
                            playerList : playlist,
                            playerListName : store.playerListName,
                            queue: store.queue,
                            songNumberPlaying: store.songNumberPlaying,
                            songInPlayer: store.songInPlayer,
                            songNamePairs: store.songNamePairs,
                            idNamePairs : store.idNamePairs
                        };
                        storeReducer({
                            type : GlobalStoreActionType.SET_SONG_TO_PLAY,
                            payload : queueObject
                        })
                        history.push('/');
                    }
                }
            }
            asyncAddComment(comment);
        }

    

    store.updateLikeDislike = function(id, like,dislike){
        async function asyncUpdateLikesDislikes(id, like,dislike){
            let response = await api.getPlaylistById(id);

            if(response.data.success){
                let playlist = response.data.playlist;
                
                if(like) {
                    playlist.likes.push({
                        userName : auth.user.userName
                    })
                }
                else if(!like){
                    playlist.likes = playlist.likes.filter((user) => (user.userName !== auth.user.userName))
                }

                if(dislike) {
                    playlist.dislikes.push({
                        userName : auth.user.userName
                    })
                }
                else if(!dislike){
                    playlist.dislikes = playlist.dislikes.filter((user) => (user.userName !== auth.user.userName))
                }
                
                response = await api.updatePlaylistById(id,playlist)
                if(response.data.success){

                    let newIdNamePairs = store.idNamePairs;

                    let playlistIndex = newIdNamePairs.findIndex( pair => {
                        return pair._id === playlist._id;
                    })

                    newIdNamePairs[playlistIndex].likes = playlist.likes;
                    newIdNamePairs[playlistIndex].dislikes = playlist.dislikes;

                    storeReducer({
                        type : GlobalStoreActionType.UPDATE_PLAYLIST,
                        payload : {
                            playlist : playlist,
                            idNamePairs : newIdNamePairs
                        }
                    })

                
                }

            }
        }

        asyncUpdateLikesDislikes(id,like,dislike);
    }

    store.nameSort = async function () {
        store.idNamePairs.sort(function(a, b){
            if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
            if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
            return 0;
        });
        history.push('/');
    }

    store.listensSort = async function () {
        store.idNamePairs.sort(function(a, b){
            return b.listens - a.listens;
        })
        history.push('/');
    }
    store.likesSort = async function () {
        store.idNamePairs.sort(function(a, b){
            return b.likes.length - a.likes.length;
        })
        history.push('/');
    }
    store.dislikesSort = async function () {
        store.idNamePairs.sort(function(a, b){
            return b.dislikes.length - a.dislikes.length;
        })
        history.push('/');
    }

    store.publishDateSort = async function () {
        store.idNamePairs.sort(function(a,b) {
            if (!a.published) return 1;
            if (!b.published) return -1;
            return new Date(b.publishedAt) - new Date(a.publishedAt);
        })
        history.push('/');
    }

    store.undo = function () {
        if (store.currentModal === CurrentModal.NONE)
            tps.undoTransaction();
    }
    store.redo = function () {
        if (store.currentModal === CurrentModal.NONE)
            tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return ((store.currentList !== null) && store.currentModal === CurrentModal.NONE);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo() && store.currentModal === CurrentModal.NONE);
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo() && store.currentModal === CurrentModal.NONE);
    }
    store.canClose = function() {
        return ((store.currentList !== null) && store.currentModal === CurrentModal.NONE);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };