import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './ErrorUI.module.css';
import { connect } from "react-redux";

function ErrorUI({ errors }) {

  let errorsA = Object.entries(errors)
  let nbErrors = errorsA.length
  if(nbErrors === 0)
    return null

  let error = Object.entries(errors)[0][1]

  return <div className= {styles.ErrorUI}>
      <span className={styles.NotifType}><span className="material-icons">error_outline</span></span>
      <span className={styles.Close}>X</span>
      <span className={styles.ContentParent}>
        <span className={styles.Content}>
            error.message
        </span>
      </span>
  </div>
}

const mapStateToProps = state => {
  const { errors } = state;
  return { errors };
};




export default connect(mapStateToProps)( ErrorUI);


//Phasellus pretium enim metus, sit amet tincidunt ligula semper mattis. Maecenas magna neque, congue ut dignissim consectetur, feugiat vel quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam luctus accumsan metus. Cras mattis laoreet varius. Suspendisse vel tempus ante. Proin risus nulla, ullamcorper at finibus quis, feugiat eu dolor. Nulla placerat sapien ex, in consequat felis ultrices eget.
