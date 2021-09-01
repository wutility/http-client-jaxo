# ⌛ Jaxo HTTP Client

⚡️ **A lightweight JavaScript library for making AJAX requests**

## Usage

```js
import Jaxo from "jaxo";
```

Or include it via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/jaxo/build/index.min.js"></script>
<!-- access via global object Jaxo : window.Jaxo -->
```

### Methods
```js
// send request
const options = { //-> default options
  method: 'GET',
  timeout: 2000,
  async: true,
  // upload and download progress event
  onProgress: (percent) => {
    console.log(percent)
  }
}

Jaxo.send(options: Object | String) : Promise

// cancel request
// xhr is XMLHttpRequest object
Jaxo.xhr.abort()
```

### GET Example

```js
Jaxo.send('https://jsonplaceholder.typicode.com/users')
  .then(response => {
    console.log(response);
  })
  .catch(e => {
    console.log(e.message)
  });
```

### POST Example

```js
(async () => {

  let file = e.target.elements[0].files[0];

  const formData = new FormData();
  formData.append('key', 'your imgbb key')
  formData.append('image', file);
  formData.append('name', 'testing file');

  try {
    let response = await Jaxo.send({
      url: 'https://api.imgbb.com/1/upload',
      method: 'POST',
      data: formData
    });    

    console.log(response);    
  } catch (error) {
    console.log(error.message);
  }
})();
```

## Notes
- All pull requests are welcome.

## License
MIT