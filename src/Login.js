import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './Login.module.css';


function Login(props) {

	return <div className={styles.Login}>
		<div className={styles.Header}>
				<div className={styles.HeaderTitle}>
					Explicit
				</div>
				<div className={styles.HeaderSubTitle}>
                    The place for your Business and Product Logic 
                 </div>   
              
		</div>
		<div className={styles.Features}>
			<div className={styles.Feature}>
			  <div className={styles.FeatureTitle}>
			  		Simple
			  </div>
			  <div className={styles.FeatureContent}>
			   	No Production Code constraints like performance, security or Front-Back communication. The business logic is as simple as it can be.
			   </div>
			</div>
			<div className={styles.Feature}>
			  <div className={styles.FeatureTitle}>
			  		Still Code
			  </div>
			  <div className={styles.FeatureContent}>
               So computer can run it, check consistency, properties of the system and more.
			   </div>
			</div>
			<div className={styles.Feature}>
			  <div className={styles.FeatureTitle}>
			  		Flexible
			  </div>
			  <div className={styles.FeatureContent}>
               	Go in as much or as little detail you want. The code always runs and gives you valuable feedbacks.
			   </div>
			</div>
              
		</div>
	</div>
}


export default Login;



