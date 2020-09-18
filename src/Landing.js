import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './Landing.module.css';
import  './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";


function Landing(props) {

	return (
	<div className={styles.LandingParent}>
	<div className={styles.Landing}>

		<div className={styles.Header}>
				<div className={styles.Logo}>
					&#931;xplicit
				</div>
				<div className={styles.Connections}>
				<Link className="Link" to="/sign_in"><div className={styles.UpperButton}>Sign in the Alpha !</div></Link>
				<span>or </span>
				<div className={styles.LandingButton}>Log in</div>
				</div>
		</div>
		<div className={styles.HeaderSpace}>
		</div>
		
		<div className={styles.MainPart}>
			<div className={styles.SubTitleParent}>
				<div className={styles.SubTitle}>
                    The place for your Business
                 </div>   
                 <div className={styles.SubTitle}>
                     and Product Logic 
                 </div>   
                 </div>   
              
		<div className={styles.LandingPart}>
			<div className={styles.Button}>Try Demo</div>
		</div>
			
		</div>


		<div className={styles.Features}>
			<div className={styles.Feature}>
			<span className={`material-icons ${styles.Icon}`}>beach_access</span>
			<div className={styles.FeatureText}>
				  <div className={styles.FeatureTitle}>
				  		<span className={styles.ActualFeatureTitle}>Simple</span>
				  </div>
				  <div className={styles.FeatureContent}>
				   	No production complexities like performance, security or Front-Back communication. <br/>Only the business logic, as simple as it can be.
				   </div>
				</div>
			</div>

			<div className={styles.Feature}>
			<span className={`material-icons ${styles.Icon}`}>code</span>
			<div className={styles.FeatureText}>
				  <div className={styles.FeatureTitle}>
				  		<span className={styles.ActualFeatureTitle}>Still Code</span>
				  </div>
				  <div className={styles.FeatureContent} style={{width: '350px'}}>
	               So computers can run it, check consistency, properties of the system and more.
				   </div>
				</div>
			</div>
			
              
		</div>
		<div className={`${styles.Features} ${styles.ParentCenter}`}>
		<div className={styles.Feature}>
		<span className={`material-icons ${styles.Icon}`}>polymer</span>
			<div className={styles.FeatureText}>
				  <div className={styles.FeatureTitle}>
				  		<span className={styles.ActualFeatureTitle}>Flexible</span>
				  </div>
				  <div className={styles.FeatureContent}>
	               	Write as much or as little details you want. <br/> The code always runs and gives you valuable feedbacks.
				   </div>
				</div>
			</div>
		</div>
	</div>
	</div>)
}


export default Landing;



