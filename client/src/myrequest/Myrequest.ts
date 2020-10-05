interface IPostOption {
  headers?: any
  responseType?: 'text' | 'blob' | 'arrayBuffer' | 'json'
}

interface IGetOption {
  headers?: any
  responseType?: 'text' | 'blob' | 'arrayBuffer' | 'json',
  query?: {
    [p: string]: string
  }
}

type IOption = IPostOption | IGetOption

function getCorrectResponseData(res: Response, options: IOption) {
  switch (options.responseType) {
    case 'text':
      return res.text
    case 'blob':
      return res.blob
    case 'arrayBuffer':
      return res.arrayBuffer
    case 'json':
      return res.json()
    default:
      return res.json()
  }
}

const MyRequest = {
  post(path: string, body: any, options: IPostOption = {}) {
    if (options?.headers?.['Content-Type']?.search(/.*json.*/i)) body = JSON.stringify(body)
    if (!options.headers?.['Content-Type']) body = JSON.stringify(body)

    return fetch(path, {
      body,
      headers: {
        ['Content-Type']: 'application/json',
        ...options.headers,
      },
      method: 'POST'
    }).then(res => {
      return getCorrectResponseData(res, options)
    }).catch((err) => { })
  },

  get(path: string, options: IGetOption = {}) {
    let queryString = ''

    if (options.query) {
      queryString += '?'
      const entriesQuery = Object.entries(options.query)
      entriesQuery.forEach(([key, value], i) => {
        queryString += `${key}=${value}`
        if (entriesQuery.length > i + 1) queryString += '&'
      })
    }


    path += queryString

    return fetch(path, { method: "GET", headers: { ...options.headers } })
      .then((res) => {
        return getCorrectResponseData(res, options)
      }).catch((err) => { })
  }
}

export default MyRequest