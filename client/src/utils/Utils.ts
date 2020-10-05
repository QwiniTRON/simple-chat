export function s(...classes: any[]) {
  return classes.join(' ')
}


type SObject = {
  (): string
  add: (className: string) => SObject
  remove: (className: string) => SObject
  toggle: (className: string) => SObject
}
export function S(...classesNames: any[]): SObject {
  const classes = classesNames
  const sfunction: any = function () {
    return classes.join(' ')
  }

  sfunction.add = (className: string) => {
    if (!classes.includes(className)) {
      classes.push(className)
    }
    return sfunction
  }

  sfunction.remove = (className: string) => {
    const position = classes.indexOf(className)
    if (position !== -1) classes.splice(position, 1)
    return sfunction
  }

  sfunction.toggle = (className: string) => {
    const position = classes.indexOf(className)
    if (position !== -1) classes.splice(position, 1)
    else classes[classes.length] = className
    return sfunction
  }

  return sfunction
}