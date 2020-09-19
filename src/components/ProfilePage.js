import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from "./ProfilePage.module.css";
import axios from '../axios_utils';
import Logo from './Logo';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

function ProfilePage(props){
	// we could use redux here, but lets just fetch all the data		
	const {history} = props;
	const [username, setUsername] = useState('...')

	let fetchProfile = async () => {
	  let response = await axios.get('user')
	  if(response.status === 200)
	    setUsername(response.data.name)
	}	

	let logOut = async () => {
		let response = await axios.put('log_out')
		if(response.status === 200){
			history.push("/landing")
		}
	}

	useEffect(() => {
		fetchProfile()
	}, [])

	return (
		<div className={styles.Main}>
			<div className={styles.Header}>
				<Link className="Link" to="/"><div className={styles.Home}> Home</div></Link>
			</div>
			<div className={styles.Card}>
			<div className={styles.User}>
				<div className="material-icons" style={{fontSize: '48px'}}>person</div>
				<div>User name: {username}</div>
			</div>	
				<span onClick={logOut} className={styles.Button}>Log out</span>
			</div>
		</div>
	)
}

export default withRouter(ProfilePage);