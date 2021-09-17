(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Jaxo = factory());
}(this, (function () { 'use strict';

  const Jaxo = {
    options: {
      method: 'GET',
      timeout: 2000,
      async: true
    },
    xhr: new XMLHttpRequest()
  };

  Jaxo.NormalizeMethod = method => {
    const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
    let upper = method.toUpperCase();
    return methods.includes(upper) ? upper : method
  };

  Jaxo.Response = function () {
    let strHeaders = this.xhr.getAllResponseHeaders().split(/\n|\r\n/g);
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
      url: this.options.url,
      data: this.xhr.response,
      status: this.xhr.status,
      statusText: this.xhr.statusText,
      headers
    };
  };

  Jaxo.FormatData = function () {
    const { headers, data } = this.options;
    const isJson = headers['Content-Type'] && headers['Content-Type'].includes('application/json');
    return isJson ? JSON.stringify(data) : data
  };

  Jaxo.send = function (ops) {
    if (typeof ops === 'string') { this.options.url = ops; }
    else { this.options = { ...this.options, ...ops }; }

    return new Promise((resolve, reject) => {

      const { method, headers, async, url, data, timeout } = this.options;

      this.xhr.open(this.NormalizeMethod(method), url, async);

      // set request headers
      for (let h in headers) {
        if (headers.hasOwnProperty(h)) {
          this.xhr.setRequestHeader(h, headers[h]);
        }
      }

      this.xhr.onload = function () {
        setTimeout(() => { resolve(Jaxo.Response()); }, 0);
      };

      const onFail = e => {
        if (e.type === 'abort') {
          reject(new DOMException('Aborted', 'AbortError'));
        }
        else {
          reject(new TypeError('Network request failed ' + e.type));
        }
      };

      const onProgress = (e) => {
        if (e.lengthComputable) {
          let percent = e.loaded / e.total * 100;
          this.options.onProgress(percent);
        } else {
          reject(new TypeError('Unable to compute progress information since the total size is unknown'));
        }
      };

      this.xhr.onreadystatechange = () => {
        self = this;
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
      };

      // send data
      this.xhr.timeout = timeout;
      this.xhr.send(Jaxo.FormatData(data));

      // handle fail events
      this.xhr.addEventListener('timeout', onFail);
      this.xhr.addEventListener('error', onFail);
      this.xhr.addEventListener('abort', onFail);

      if (this.options.onProgress) {
        method === 'GET'
          ? this.xhr.addEventListener('progress', onProgress)
          : this.xhr.upload.addEventListener('progress', onProgress);
      }
    });
  };

  Jaxo.retry = async (fn, nb) => {
    try {
      return await fn
    } catch (error) {
      if (nb > 1) return Jaxo.retry(fn, nb - 1)
      else return await fn
    }
  };

  return Jaxo;

})));
