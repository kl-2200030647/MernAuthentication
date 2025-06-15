import React from 'react';
//import {error_img} from '/error_img.png'

const NotFound = () => {
  return (
    <div className='text-center justify-center '>
      {/*<h1>404 error </h1>
      <p>The page you are searching is not available </p>
      */}
      <img src='/error_img.png' alt=" "
      className='mx-auto mt-6 w-64 h-auto rounded-lg shadow-lg text-center'/>
    </div>
  )
}

export default NotFound
