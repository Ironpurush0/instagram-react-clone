import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from '../backend/firebase';
import firebase from 'firebase';
import './ImageUploader.css';

function ImageUploader({ username }) {
	const [ progress, setProgress ] = useState(0);
	const [ image, setImage ] = useState();

	const handleChange = (event) => {
		if (event.target.files[0]) {
			setImage(event.target.files[0]);
		}
	};

	const handleUpload = (event) => {
		const uploadTask = storage.ref(`profile-images/${image.name}`).put(image);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
				setProgress(progress);
			},
			(error) => {
				console.log(error);
				alert(error.message);
			},
			() => {
				storage.ref('profile-images').child(image.name).getDownloadURL().then((url) => {
					db.collection('Post').add({
						timestamp: firebase.firestore.FieldValue.serverTimestamp(),
						profileImage: url,
						username: username
					});
					setProgress(0);
					setImage(null);
				});
			}
		);
	};

	return (
		<div className="imageUploader">
			<progress className="progress_bar" value={progress} max="100" />
			<div className="xyz">
				<Button className="imageupload__button" onClick={handleUpload}>
					upload
				</Button>
			</div>

			<input type="file" onChange={handleChange} />
		</div>
	);
}

export default ImageUploader;
