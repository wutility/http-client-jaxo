const Jaxo = {
  options: {
    method: 'GET',
    timeout: 2000,
    async: true
  },
  readystate: 0,
  xhr: new XMLHttpRequest()
}

Jaxo.normalizeMethod = method => {
  const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
  let upper = method.toUpperCase()
  return methods.includes(upper) ? upper : method
}

Jaxo.response = () => {
  let strHeaders = Jaxo.xhr.getAllResponseHeaders().split(/\n|\r\n/g);
  let headers = {};

  // format response headers
  strHeaders.forEach(header => {
    if (header) {
      let head = header.split(':');
      let value = head[1].trim();
      let key = head[0];
      headers[key] = isNaN(value) ? value : parseInt(value, 10);
    }
  });

  return {
    url: Jaxo.options.url,
    data: Jaxo.xhr.response,
    status: Jaxo.xhr.status,
    statusText: Jaxo.xhr.statusText,
    headers
  };
}

Jaxo.send = function (ops) {
  if (typeof ops === 'string') {
    this.options.url = ops
  }
  else {
    this.options = { ...this.options, ...ops };
  }

  // set request headers
  for (let i in this.options.headers) {
    if (this.options.headers.hasOwnProperty(i)) {
      this.xhr.setRequestHeader(i, this.options.headers[i]);
    }
  }

  return new Promise((resolve, reject) => {
    this.xhr.onload = function () {
      setTimeout(() => {
        resolve(Jaxo.response())
      }, 0)
    }

    const errHandler = e => {
      if (e.type === 'abort') {
        reject(new DOMException('Aborted', 'AbortError'))
      }
      else {
        reject(new TypeError('Network request failed ' + e.type))
      }
    }

    const onProgress = (e) => {
      if (e.lengthComputable) {
        let percent = e.loaded / e.total * 100;
        this.options.onProgress(percent)
      } else {
        reject(new TypeError('Unable to compute progress information since the total size is unknown'));
      }
    }

    this.xhr.onreadystatechange = () => {
      this.readyState = this.xhr.readyState
      self = this
      if (this.readyState === 4) {
        setTimeout(() => {
          self.xhr.removeEventListener('abort', errHandler);
          self.xhr.removeEventListener('timeout', errHandler);
          self.xhr.removeEventListener('error', errHandler);
          if (self.options.onProgress) {
            self.xhr.removeEventListener('progress', onProgress);
          }
        }, 0);
      }
    }

    // send data
    this.xhr.timeout = this.options.timeout;
    this.xhr.open(this.normalizeMethod(this.options.method), this.options.url, this.options.async);
    this.xhr.send(this.options.data);

    // handle events
    this.xhr.addEventListener('timeout', errHandler)
    this.xhr.addEventListener('error', errHandler)
    this.xhr.addEventListener('abort', errHandler)

    if (this.options.onProgress) {
      this.options.method === 'GET'
        ? this.xhr.addEventListener('progress', onProgress)
        : this.xhr.upload.addEventListener('progress', onProgress);
    }
  });
}

export default Jaxo
