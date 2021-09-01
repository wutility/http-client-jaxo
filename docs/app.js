const code = `(async () => {
  // url for testing: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  try {
    let response = await Jaxo.send({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/users',
      headers: {
        "Accept": "application/json"
      }
    });

    // you can return only data
    //-> JSON.parse(response.data)
    return response
  } catch (error) {
    return error.message
  }
})();`;

const codeEl = document.getElementById('code')
const resultEl = document.getElementById('result')

const CodeMirrorOptions = {
  theme: 'material',
  mode: 'javascript',
  autoCloseBrackets: true,
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  foldGutter: true,
  gutter: true,
  matchBrackets: true
}

const editor = CodeMirror.fromTextArea(codeEl, CodeMirrorOptions);
const resultEditor = CodeMirror.fromTextArea(resultEl, CodeMirrorOptions);

editor.setValue(code)

document.getElementById('btn-send').addEventListener('click', async () => {
  let res = await eval(editor.getValue())
  resultEditor.setValue(JSON.stringify(res, null, "\t"))
});

document.getElementById('btn-abort').addEventListener('click', () => {
  Jaxo.xhr.abort()
})