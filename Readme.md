# ⌛ Jaxo HTTP Client

⚡️ **A lightweight JavaScript library for making AJAX requests**

## Usage

```js
import Jaxo from "jaxo";
```

Or include it via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/jaxo@1.0.0/build/index.min.js"></script>
access via global object Jaxo : window.Jaxo
```
## GET Example

```js
(async () => {
  let Jaxo = new Jaxo();

  let response = await Jaxo.send({
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    method: 'get', // default value
    async: true, // default value
    timeout: 2000 // default value
  });

  console.log(response);  

  Jaxo.abort() // cancel request
})();
```

## POST Example

```js
(async () => {
  let Jaxo = new window.Jaxo();

  let file = e.target.elements[0].files[0];

  const formData = new FormData();
  formData.append('key', 'your imgbb key')
  formData.append('image', file);
  formData.append('name', 'testing file');

  try {
    let response = await Jaxo.send({
      url: 'https://api.imgbb.com/1/upload',
      method: 'post',
      data: formData,
      onProgress: (percent) => {
        console.log(percent);
      }
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