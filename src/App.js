import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import { db, auth } from './backend/firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUploader from './components/ImageUploader';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	}
}));

function App() {
	const classes = useStyles();

	const [ modalStyle ] = React.useState(getModalStyle);
	const [ posts, setPosts ] = useState([]);
	const [ isOpen, setIsOpen ] = useState(false);
	const [ signinOpen, setSigninOpen ] = useState(false);

	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ username, setUsername ] = useState('');
	const [ user, setUser ] = useState(null);

	const onSignup = (event) => {
		event.preventDefault();

		auth
			.createUserWithEmailAndPassword(email, password)
			.then((user) => {
				return user.user.updateProfile({
					displayName: username
				});
			})
			.catch((error) => alert(error.message));

		setIsOpen(false);
		setUsername('');
		setEmail('');
		setPassword('');
	};

	const onSignin = (event) => {
		event.preventDefault();

		auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err.message));

		setSigninOpen(false);
		setEmail('');
		setPassword('');
	};

	useEffect(
		() => {
			const unsubscribe = auth.onAuthStateChanged((user) => {
				if (user) {
					console.log(user);
					setUser(user);
				} else {
					setUser(null);
				}
			});

			return () => {
				unsubscribe();
			};
		},
		[ user, username ]
	);

	useEffect(() => {
		db.collection('Post').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
			setPosts(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					post: doc.data()
				}))
			);
		});
	}, []);

	return (
		<div className="app">
			<Modal
				open={isOpen}
				onClose={() => setIsOpen(false)}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app__header__image"
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
								alt="instagram"
							/>
						</center>
						<Input
							placeholder="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>

						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<Button type="submit" onClick={onSignup}>
							Sign up
						</Button>
					</form>
				</div>
			</Modal>
			<Modal
				open={signinOpen}
				onClose={() => setSigninOpen(false)}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app__header__image"
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
								alt="instagram"
							/>
						</center>

						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<Button type="submit" onClick={onSignin}>
							Sign in
						</Button>
					</form>
				</div>
			</Modal>
			<div className="app__header">
				<img
					className="app__header__image"
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
					alt="instagram"
				/>
				<div className="auth_buttons">
					{user ? (
						<Button onClick={() => auth.signOut()}>Sign out</Button>
					) : (
						<div className="app__authContainer">
							<Button onClick={() => setIsOpen(true)}>Sign up</Button>

							<Button onClick={() => setSigninOpen(true)}>Sign in</Button>
						</div>
					)}
				</div>
			</div>
			<div className="app__post">
				{posts.map(({ id, post }) => (
					<Post
						key={id}
						user={user}
						postId={id}
						username={post.username}
						caption={post.caption}
						imageUrl={post.imageUrl}
					/>
				))}
			</div>

			{/* Posts */}
			{user?.displayName ? <ImageUploader username={user.displayName} /> : <h3>Sorry you need to login.</h3>}
		</div>
	);
}

export default App;
