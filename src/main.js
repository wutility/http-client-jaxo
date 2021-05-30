export default function Jaxo () {
  let xhr = new XMLHttpRequest();
  let ops = {};

  function send (options) {
    ops.headers = options.headers;
    ops.method = options.method || 'GET';
    ops.url = options.url;
    ops.data = options.data;
    ops.async = options.async || true;
    ops.onProgress = options.onProgress;

    return new Promise((resolve, reject) => {
      xhr.open(ops.method, ops.url, ops.async);

      for (let i in ops.headers) {
        if (ops.headers.hasOwnProperty(i)) {
          xhr.setRequestHeader(i, ops.headers[i]);
        }
      }

      xhr.onreadystatechange = () => {
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

        console.log(xhr.responseType);

        // format response   
        let response = {
          response: xhr.response,
          status: xhr.status,
          statusText: xhr.statusText,
          headers
        };

        if (xhr.readyState === 4) {
          if (response.status >= 200 && response.status < 305) {
            resolve(response);
          } else {
            reject(response);
          }
        }
      };

      if (ops.onProgress) {
        handleEvent(xhr)
      }

      xhr.send(ops.data);
    });
  }

  function abort () {
    xhr.abort()
  }

  function handleEvent () {
    const onChange = ev => {
      if (ev.lengthComputable) {
        let percent = ev.loaded / ev.total * 100;
        ops.onProgress(percent)
      } else {
        ops.onProgress('Unable to compute progress information since the total size is unknown');
      }
    }

    xhr.upload.addEventListener('loadstart', onChange);
    xhr.upload.addEventListener('load', onChange);
    xhr.upload.addEventListener('loadend', onChange);
    xhr.upload.addEventListener('progress', onChange);
    xhr.upload.addEventListener('error', onChange);
    xhr.upload.addEventListener('abort', onChange);
  }

  return {
    send,
    abort
  }
}