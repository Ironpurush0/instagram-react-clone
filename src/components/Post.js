import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';
import { db } from '../backend/firebase';
import firebase from 'firebase';

import './Post.css';

const Post = ({ postId, user, username, imageUrl, caption }) => {
	const [ comments, setComments ] = useState([]);
	const [ comment, setComment ] = useState('');

	useEffect(
		() => {
			let unsubscribe;
			if (postId) {
				unsubscribe = db
					.collection('Post')
					.doc(postId)
					.collection('comments')
					.orderBy('timestamp', 'desc')
					.onSnapshot((snapshot) => {
						setComments(snapshot.docs.map((doc) => doc.data()));
					});
			}
			return () => {
				unsubscribe();
			};
		},
		[ postId ]
	);

	const postComment = (event) => {
		event.preventDefault();

		db.collection('Post').doc(postId).collection('comments').add({
			text: comment,
			username: user.displayName,
			timeStamp: firebase.firestore.FieldValue.serverTimestamp()
		});
		setComment('');
	};

	return (
		<div className="post">
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt="Witcher"
					src="https://images.pexels.com/photos/2899097/pexels-photo-2899097.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
				/>
				<h2>{username}</h2>
			</div>
			<img src={imageUrl} alt="witcher" className="post__image" />

			<h4 className="post__text">
				<strong>{username}</strong> {caption}
			</h4>

			<div className="post__comments">
				{comments.map((comment) => {
					return (
						<h4>
							<strong>{comment.username}</strong>
							{comment.text}
						</h4>
					);
				})}
			</div>

			<form className="post__commentBox">
				<input
					className="post__input"
					type="text"
					placeholder="comment..."
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				<button className="post__button" disabled={!comment} type="submit" onClick={postComment}>
					Post
				</button>
			</form>
		</div>
	);
};

export default Post;
