import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './Login.module.css';
import  stylesLanding from './Landing.module.css';
import axios from './axios_utils'
import Logo from './components/Logo'

function Login(props) {

	const sendLogin = async () => {
		let username = document.getElementById("username_input").innerText
		let password = document.getElementById("password_input").innerText
		if(username.length > 0 && password.length > 0){
			    let response = await axios.post(`login`, {username, password});
			    if(response.status === 200){
			    	// push history to /
			    }else{
			    	let {message} = response.data
			    	// do something
			    }
		}
	}

	return (
		<div className={stylesLanding.LandingParent}>
			<div className={stylesLanding.Landing }>
				<div className={styles.Card}>
					<Logo/>
					<input placeholder="Username" id="username_input" type="text" className={`Input ${styles.Element}`} />
					<input placeholder="Password" id="password_input" type="password" className={`Input ${styles.Element}`} />

					<div onClick={sendLogin} className={`${styles.GoButton}`}>Go</div>
				</div>
			</div>
		</div>
		)
}




export default Login;