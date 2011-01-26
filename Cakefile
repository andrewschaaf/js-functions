
{spawn, exec} = require 'child_process'


FUNCTIONS = [
  "msgpack_pack"
  "msgpack_unpack"
  "base64_encode"
  "base64_decode"
]


run = (cmd, callback) ->
  p = spawn 'bash', ['-c', cmd]
  p.stdout.on 'data', (buf) -> console.log buf.toString()
  p.stderr.on 'data', (buf) -> console.log buf.toString()
  p.on 'exit', (status) ->
    if status != 0
      process.exit(1)
    if callback
      callback()


task 'build', 'build', (options) ->
  run "coffee -co build/ src/", () ->
    for name in FUNCTIONS
      run "cat src/#{name}.js | java -jar $CLOSURE_JAR --compilation_level ADVANCED_OPTIMIZATIONS > build/#{name}.min.js"

task 'test', 'test', (options) ->
  run 'expresso build/test/test*'

