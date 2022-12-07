
import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const {comment, index} = props;


    return(
        <div
            className='comment-card'>
                <span class='comment-card-text'>{comment.owner}</span>
                <p>{comment.comment}</p>
        </div>
    )

}

export default CommentCard;