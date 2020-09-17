import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './Login.module.css';
import  stylesLanding from './Landing.module.css';


function Login(props) {

	const sendLogin = () => {
		let username = document.getElementById("username_input").innerText
		let password = document.getElementById("password_input").innerText
		password
	    let response = await axios.post(`files`, {name: filename});
	    if(response.status === 200){
	      await fetchFiles()
	      setAddingFile(v => !v)
	    }
	}

	const errorMessageComponent =  () => {
		// put that in back
		let badPassword = password.length < 8 || password.match(/[0-9]+/) === null || password.match(/[^A-Za-z0-9]/) === null
		let msg = ''
		if(badPassword) msg += 'The password must be at least 8 characters, with one or more numbers and special characters'
			// check no space in username
		return (<div className={styles.ErrorMessage}>{errorMessage}</div>)
	}

	return (
		<div className={stylesLanding.LandingParent}>
			<div className={stylesLanding.Landing }>
				<div className={styles.Card}>
					<div className={`${styles.Logo} ${styles.Element}`}>&#931;xplicit</div>
					<input placeholder="Username" id="username_input" type="text" className={`Input ${styles.Element}`} />
					<input placeholder="Password" id="password_input" type="password" className={`Input ${styles.Element}`} />

					<div onClick={sendLogin} className={`${styles.GoButton}`}>Go</div>
				</div>
			</div>
		</div>
		)
}




export default Login;