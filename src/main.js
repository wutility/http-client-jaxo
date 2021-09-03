const Jaxo = {
  options: {
    method: 'GET',
    timeout: 2000,
    async: true
  },
  xhr: new XMLHttpRequest()
}

Jaxo.normalizeMethod = method => {
  const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
  let upper = method.toUpperCase()
  return methods.includes(upper) ? upper : method
}

Jaxo.Response = () => {
  let strHeaders = Jaxo.xhr.getAllResponseHeaders().split(/\n|\r\n/g);
  let headers = {};

  // format response headers
  strHeaders.forEach(header => {
    if (header) {
      let head = header.split(':');
      let value = head[1].trim();
      let key = head[0];
      headers[key] = isNaN(value) ? value : Number(value);
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

  return new Promise((resolve, reject) => {

    this.xhr.open(this.normalizeMethod(this.options.method), this.options.url, this.options.async);

    // set request headers
    for (let i in this.options.headers) {
      if (this.options.headers.hasOwnProperty(i)) {
        this.xhr.setRequestHeader(i, this.options.headers[i]);
      }
    }

    this.xhr.onload = function () {
      setTimeout(() => {
        resolve(Jaxo.Response())
      }, 0)
    }

    const onFail = e => {
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
      self = this
      if (this.xhr.readyState === 4) {
        setTimeout(() => {
          self.xhr.removeEventListener('abort', onFail);
          self.xhr.removeEventListener('timeout', onFail);
          self.xhr.removeEventListener('error', onFail);
          if (self.options.onProgress) {
            self.xhr.removeEventListener('progress', onProgress);
          }
        }, 0);
      }
    }

    // send data
    this.xhr.timeout = this.options.timeout;
    this.xhr.send(this.options.data);

    // handle fail events
    this.xhr.addEventListener('timeout', onFail)
    this.xhr.addEventListener('error', onFail)
    this.xhr.addEventListener('abort', onFail)

    if (this.options.onProgress) {
      this.options.method === 'GET'
        ? this.xhr.addEventListener('progress', onProgress)
        : this.xhr.upload.addEventListener('progress', onProgress);
    }
  });
}

export default Jaxo
