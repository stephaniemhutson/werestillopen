import React from 'react';
import pin from './pin.svg';
import { Link, Router } from 'react-router-dom';

export default function Header () {
  return <div className='header'>
    <div className="name">
      Open For Business
    </div>
    <div className="description">
      Find which businesses near you are open and in what capacity during COVID-19 shutdowns
    </div>
  </div>
}
