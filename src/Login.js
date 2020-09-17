import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './Login.module.css';
import  stylesLanding from './Landing.module.css';


function Login(props) {
	return (
		<div className={stylesLanding.LandingParent}>
			<div className={stylesLanding.Landing }>
				<div className={styles.Card}>
					<div className={`${styles.Logo} ${styles.Element}`}>&#931;xplicit</div>
					<input placeholder="Username" id="username_input" type="text" className={`Input ${styles.Element}`} />
					<input placeholder="Password" id="password_input" type="password" className={`Input ${styles.Element}`} />
					<div className={`${styles.GoButton}`}>Go</div>
				</div>
			</div>
		</div>
		)
}




export default Login;