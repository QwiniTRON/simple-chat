import React from 'react'

import c from './Loader.module.scss'

type LoaderProps = {
  color?: 'red' | 'green' | 'gold'
}

const Loader: React.FC<LoaderProps> = function ({ color }) {
  const loaderClasses = [c["lds-ring"]]
  if (color) loaderClasses.push(c[color])

  return (
    <div className={loaderClasses.join(' ')}><div></div><div></div><div></div><div></div></div>
  );
}

export default Loader