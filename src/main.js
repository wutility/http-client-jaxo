export default function Jaxo () {
  let xhr = new XMLHttpRequest();
  let ops = {};

  function normalizeMethod (method) {
    const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
    let upper = method.toUpperCase()
    return methods.includes(upper) ? upper : method
  }

  function send (options) {

    ops.headers = options.headers;
    ops.method = normalizeMethod(options.method || 'GET');
    ops.url = options.url;
    ops.data = options.data;
    ops.async = options.async || true;
    ops.timeout = options.timeout || 2000;

    ops.onProgress = options.onProgress;

    return new Promise((resolve, reject) => {

      xhr.open(ops.method, ops.url, ops.async);
      xhr.timeout = ops.timeout;

      // handle events [error, timeout, abort, progress]
      function eventHandler (e) {
        setTimeout(() => {
          if (e.type === 'abort') {
            reject(new DOMException('Aborted', 'AbortError'))
          }
          if (e.type === 'progress') {
            if (e.lengthComputable) {
              let percent = e.loaded / e.total * 100;
              ops.onProgress(percent)
            } else {
              ops.onProgress('Unable to compute progress information since the total size is unknown');
            }
          }
          else {
            reject(new TypeError('Network request failed ' + e.type))
          }
        }, 0);
      }

      // set request headers
      for (let i in ops.headers) {
        if (ops.headers.hasOwnProperty(i)) {
          xhr.setRequestHeader(i, ops.headers[i]);
        }
      }

      // called when an XMLHttpRequest transaction completes successfully.
      xhr.onload = () => {
        let strHeaders = xhr.getAllResponseHeaders().split(/\n|\r\n/g);
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

        // format response   
        let response = {
          response: xhr.response,
          status: xhr.status,
          statusText: xhr.statusText,
          headers
        };

        setTimeout(() => {
          resolve(response);
        }, 0);
      }

      xhr.onreadystatechange = () => {
        console.log(xhr.readyState);
        if (xhr.readyState === 4) {
          // if (response.status >= 200 && response.status < 305) {
          //   resolve('ok');
          // } else {
          //   reject('err');
          // }
          setTimeout(() => {
            xhr.removeEventListener('abort', eventHandler);
            xhr.removeEventListener('timeout', eventHandler);
            xhr.removeEventListener('error', eventHandler);
            if (ops.onProgress) { xhr.removeEventListener('progress', eventHandler); }
          }, 0);
        }
      };

      if (ops.onProgress) { xhr.upload.addEventListener('progress', eventHandler); }
      xhr.addEventListener('error', eventHandler)
      xhr.addEventListener('timeout', eventHandler)
      xhr.addEventListener('abort', eventHandler)
      xhr.send(ops.data);
    });
  }

  return {
    send,
    abort: () => xhr.abort()
  }
}