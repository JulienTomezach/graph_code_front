import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './Login.module.css';


function Login(props) {

	return <div className={styles.Login}>

		<div className={styles.Header}>
				<div className={styles.HeaderTitle}>
					Explicit
				</div>
		</div>
		<div className={styles.HeaderSpace}>
		</div>
		
		<div className={styles.MainPart}>
				<div className={styles.SubTitle}>
                    The place for your Business and Product Logic 
                 </div>   
              
		<div className={styles.LoginPart}>
			<div className={styles.Username}>Username:</div>
			<div className={styles.Password}>Password:</div>
			<div className={styles.Button}>Login</div>
		</div>
			
		</div>


		<div className={styles.Features}>
			<div className={styles.Feature}>
			  <div className={styles.FeatureTitle}>
			  		<span className={styles.ActualFeatureTitle}>Simple</span>
			  </div>
			  <div className={styles.FeatureContent}>
			   	No Production Code constraints like performance, security or Front-Back communication. The business logic is as simple as it can be.
			   </div>
			</div>
			<div className={styles.Feature}>
			  <div className={styles.FeatureTitle}>
			  		<span className={styles.ActualFeatureTitle}>Still Code</span>
			  </div>
			  <div className={styles.FeatureContent}>
               So computer can run it, check consistency, properties of the system and more.
			   </div>
			</div>
			
              
		</div>
		<div className={styles.Features}>
		<div className={styles.Feature}>
			  <div className={styles.FeatureTitle}>
			  		<span className={styles.ActualFeatureTitle}>Flexible</span>
			  </div>
			  <div className={styles.FeatureContent}>
               	Go in as much or as little detail you want. The code always runs and gives you valuable feedbacks.
			   </div>
			</div>
		</div>
	</div>
}


export default Login;



