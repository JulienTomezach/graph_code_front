import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './ErrorUI.module.css';
import { connect } from "react-redux";

import {closeError} from './redux/actions.js'
import _ from "lodash";

function ErrorUI({ errors, closeError }) {

  let errorsA = Object.entries(errors)
  errorsA = _.uniqBy(errorsA, e => e.message )
  let nbErrors = errorsA.length
  if(nbErrors === 0)
    return null

  let closeErrorHandle = (idError) => {
    closeError(idError)
  }

  let getMessage = (error) => {
    let message = <span>{error.message}</span>

    if(error.type==='parsing'){
      let l1 = error.message.length/2-4
      let l2 = error.message.length/2+4
      message = <span>
          {error.message.substring(0, l1)}
          <span style={{color: 'red'}}>{error.message.substring(l1, l2)}</span>
          {error.message.substring(l2, error.message.length)}
        </span>
    }
    return message;
  }

  let anError = (idError, error) => {
    let message = getMessage(error)
    return (<span>
      <span className={styles.NotifType}><span className="material-icons">error_outline</span></span>
      <span onClick={() => closeErrorHandle(idError)} className={styles.Close}>X</span>
      <span className={styles.ContentParent}>
        <span className={styles.Content}>
            {error.type}:{message}
        </span>
      </span>
    </span>)
  }

  let theErrors = errorsA.map(([idError, error]) => {
    return anError(idError, error)
  })

  console.log("theErrors", theErrors)

  return <div className= {styles.ErrorUI}>
    {theErrors}
  </div>
}

const mapStateToProps = state => {
  const { errors } = state;
  return { errors };
};




export default connect(mapStateToProps,  { closeError })(ErrorUI);


//Phasellus pretium enim metus, sit amet tincidunt ligula semper mattis. Maecenas magna neque, congue ut dignissim consectetur, feugiat vel quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam luctus accumsan metus. Cras mattis laoreet varius. Suspendisse vel tempus ante. Proin risus nulla, ullamcorper at finibus quis, feugiat eu dolor. Nulla placerat sapien ex, in consequat felis ultrices eget.
