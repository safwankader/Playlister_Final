
import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function CommentCard() {
    const { store } = useContext(GlobalStoreContext);

    const {name, comment} = props;


    return(
        <div
            className='comment-card'>
                <span>{name}</span>
                <p>{comment}</p>
        </div>
    )

}