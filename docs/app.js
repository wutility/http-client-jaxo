const selectSamples = document.getElementById('samples')
const samples = { jsonReqPost, jsonReqGet };

const jsBeautyOptions = {
  'indent_size': 2,
  'jslint_happy': false,
  'e4x': true,
  'brace_style': 'preserve-inline',
  'break_chained_methods': false,
  'detect_packers': true
};

for (const smp in samples) {
  const option = document.createElement('option')
  option.value = smp
  option.textContent = smp
  selectSamples.appendChild(option)
}

function generate(value) {
  return `(async () => {
    // URL for testing: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    // Good website for testing: https://reqres.in
    try {
      let response = await Jaxo.send(${JSON.stringify(value, null, '\t')});
      
      return JSON.parse(response.data)
    } catch (error) {
      return error.message
    }
  })();`
}

let code = samples[selectSamples.value];

selectSamples.onchange = e => {
  code = samples[e.target.value];
  editor.setValue(js_beautify(generate(code), jsBeautyOptions))
}

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

Split(['#code-wrapper', '#result-wrapper'], {sizes: [50, 50], minSize: [10, 10]})

editor.setValue(js_beautify(generate(code), jsBeautyOptions))

document.getElementById('btn-send').addEventListener('click', async () => {
  let res = await eval(editor.getValue())
  console.log(res);
  resultEditor.setValue(JSON.stringify(res, null, "\t"))
});

document.getElementById('btn-abort').addEventListener('click', () => {
  Jaxo.xhr.abort()
})