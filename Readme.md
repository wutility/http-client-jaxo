# ⌛ Jaxo HTTP Client

⚡️ **A lightweight JavaScript library for making AJAX requests**

![HTTP Client](https://badgen.net/bundlephobia/dependency-count/jaxo) ![HTTP Client](https://badgen.net/npm/v/jaxo) ![HTTP Client](https://badgen.net/bundlephobia/minzip/jaxo) ![HTTP Client](https://badgen.net/npm/dt/jaxo) ![HTTP Client](https://data.jsdelivr.com/v1/package/npm/jaxo/badge)

#### [🔆 Playground](https://wutility.github.io/http-client-jaxo/)

## Usage

```js
import Jaxo from "jaxo";
```

Or include it via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/jaxo/build/index.min.js"></script>
<!-- access via global object Jaxo : window.Jaxo -->
```

## Documentation
```js
const options = {
  method: 'GET', //-> default
  timeout: 2000, //-> default
  async: true,   //-> default
  headers: {
    "Accept": "application/json, text/plain",
    "Content-Type": "application/json"
  },
  onProgress: (percent) => { //-> upload and download progress event
    console.log(percent)
  }
}

// Send request
Jaxo.send(options: Object | String) : Promise

// cancel request (xhr is XMLHttpRequest object)
Jaxo.xhr.abort()
```

### GET Example

```js
Jaxo.send('https://jsonplaceholder.typicode.com/users')
  .then(response => {
    console.log(response)
  })
  .catch(e => {
    console.log(e.message)
  });
```

### POST Example

```js
document.getElementById('form-file')
  .addEventListener('submit', e => {

    let file = e.target.elements[0].files[0];

    const formData = new FormData();
    formData.append('key', 'your imgbb key')
    formData.append('image', file);
    formData.append('name', 'testing file');

    let response = await Jaxo.send({
      url: 'https://api.imgbb.com/1/upload',
      method: 'POST',
      data: formData
    })
      .then(response => {
        console.log(response);    
      })
      .catch(error => {
        console.log(error.message);
      });
});
```

## Notes
- All pull requests are welcome.

## License
MIT