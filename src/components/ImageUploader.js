import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from '../backend/firebase';
import firebase from 'firebase';
import './ImageUploader.css';

function ImageUploader({ username }) {
	const [ caption, setCaption ] = useState('');
	const [ progress, setProgress ] = useState(0);
	const [ image, setImage ] = useState();

	const handleChange = (event) => {
		if (event.target.files[0]) {
			setImage(event.target.files[0]);
		}
	};

	const handleUpload = (event) => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);

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
				storage.ref('images').child(image.name).getDownloadURL().then((url) => {
					db.collection('Post').add({
						timestamp: firebase.firestore.FieldValue.serverTimestamp(),
						caption: caption,
						imageUrl: url,
						username: username
					});
					setProgress(0);
					setCaption('');
					setImage(null);
				});
			}
		);
	};

	return (
		<div className="imageUploader">
			<progress className="progress_bar" value={progress} max="100" />
			<div className="xyz">
				<input
					className="input_field"
					type="text"
					placeholder="Enter a caption"
					value={caption}
					onChange={(event) => setCaption(event.target.value)}
				/>
				<Button className="imageupload__button" onClick={handleUpload}>
					upload
				</Button>
			</div>

			<input type="file" onChange={handleChange} />
		</div>
	);
}

export default ImageUploader;
