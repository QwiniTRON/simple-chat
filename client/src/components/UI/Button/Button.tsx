import React from 'react'
import {s} from '../../../utils/Utils'

import c from './Button.module.scss'

type buttonProps = {
  color?: 'load' | 'blue',
  [p: string]: any
}

const Button: React.FC<buttonProps> = function ({color = 'blue', children, ...props}) {
  return (
    <div {...props} className={s(c['btn'], c[color])} >
      {children}
    </div>
  );
}

export default Button