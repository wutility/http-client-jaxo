// code origin https://github.com/github/fetch/blob/master/test/server.js
var http = require('http');
const url = require('url')
const querystring = require('querystring')

const routes = {
  '/request': function (res, req) {

    res.writeHead(200, { 'Content-Type': 'application/json' })
    var data = ''
    req.on('data', function (c) {
      data += c
    })
    req.on('end', function () {
      res.end(
        JSON.stringify({
          method: req.method,
          url: req.url,
          headers: req.headers,
          data: data
        }))
    })
  },
  '/hello': function (res, req) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'X-Request-URL': 'http://' + req.headers.host + req.url
    })
    res.end('hi')
  },
  '/hello/utf8': function (res) {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
    })
    // "hello"
    var buf = Buffer.from([104, 101, 108, 108, 111])
    res.end(buf)
  },
  '/hello/utf16le': function (res) {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-16le'
    })
    // "hello"
    var buf = Buffer.from([104, 0, 101, 0, 108, 0, 108, 0, 111, 0])
    res.end(buf)
  },
  '/binary': function (res) {
    res.writeHead(200, { 'Content-Type': 'application/octet-stream' })
    var buf = Buffer.alloc(256)
    for (var i = 0; i < 256; i++) {
      buf[i] = i
    }
    res.end(buf)
  },
  '/redirect/301': function (res) {
    res.writeHead(301, { Location: '/hello' })
    res.end()
  },
  '/redirect/302': function (res) {
    res.writeHead(302, { Location: '/hello' })
    res.end()
  },
  '/redirect/303': function (res) {
    res.writeHead(303, { Location: '/hello' })
    res.end()
  },
  '/redirect/307': function (res) {
    res.writeHead(307, { Location: '/hello' })
    res.end()
  },
  '/redirect/309': function (res) {
    res.writeHead(309, { Location: '/hello' })
    res.end()
  },
  '/boom': function (res) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('boom')
  },
  '/empty': function (res) {
    res.writeHead(204)
    res.end()
  },
  '/slow': function (res) {
    setTimeout(function () {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, must-revalidate'
      });

      res.end(JSON.stringify({ name: 'Hubot', login: 'hubot' }))
    }, 5000)
  },
  '/error': function (res) {
    res.destroy()
  },
  '/form': function (res) {
    res.writeHead(200, { 'Content-Type': 'application/x-www-form-urlencoded' })
    res.end('number=1&space=one+two&empty=&encoded=a%2Bb&')
  },
  '/post-json': function (res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ name: 'Hubot', login: 'hubot' }))
  },
  '/json': function (res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ name: 'Hubot', login: 'hubot' }))
  },
  '/json-error': function (res) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end('not json {')
  },
  '/no-response': function (res) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    //res.end('boom')
  },
  '/cookie': function (res, req) {
    var setCookie, cookie
    var params = querystring.parse(url.parse(req.url).query)
    if (params.name && params.value) {
      setCookie = [params.name, params.value].join('=')
    }
    if (params.name) {
      cookie = querystring.parse(req.headers['cookie'], '; ')[params.name]
    }
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Set-Cookie': setCookie || ''
    })
    res.end(cookie)
  },
  '/headers': function (res) {
    res.writeHead(200, {
      Date: 'Mon, 13 Oct 2014 21:02:27 GMT',
      'Content-Type': 'text/html; charset=utf-8'
    })
    res.end()
  }
}

function router (req, res, next) {
  const path = url.parse(req.url).pathname
  const route = routes[path]
  if (route) {
    route(res, req)
  } else {
    next()
  }
}

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const next = _ => {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Bad Request')
  }

  router(req, res, next)
}).listen(3000, function () {
  console.log("server start at port 3000"); // The server object listens on port 3000
});