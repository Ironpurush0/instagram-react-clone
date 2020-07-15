import React from 'react'
import {Avatar} from '@material-ui/core'

import './Post.css'

const Post = (props) => {
    return (
        <div className="post">
            <div className="post__header">
            <Avatar className="post__avatar" alt="Witcher" />
            <h2>{props.username}</h2>
            </div>
            <img src={props.imageUrl} alt="witcher" className="post__image" />

    <h4 className="post__text"><strong>{props.username}</strong> {props.caption}</h4>
        </div>
    )
}

export default Post
