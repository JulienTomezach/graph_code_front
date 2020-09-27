import React, { useState, useEffect, useCallback, useRef } from 'react';
import { withRouter } from "react-router";
import  styles from './TryDemo.module.css';
import axios from '../axios_utils';



function TryDemo(props){
	const {history} = props;

	let clickDemo = async () => {
		// try_demo
		let res = await axios.put("/try_demo")
		// if the response is 200, we got our token.
		if(res.status === 200){
			if(!props.newTab){
				history.push('/')
			}else{
				const win = window.open("/", "_blank");
  				win.focus();
			}
		}
	}

	return (<div className={styles.Button} onClick={clickDemo} >Try Live Demo</div>)

}

export default withRouter(TryDemo);