exports.resolveRdbgPath = async function() {
  return new Promise((resolve, reject) => {
    const process = new Process("/usr/bin/env", {
      cwd: nova.workspace.path,
      args: ["which", "rdbg"],
      stdio: ["ignore", "pipe", "pipe"],
      shell: true
    })

    let str = ""
    let err = ""

    process.onStdout((output) => {
      str += output.trim()
    })

    process.onStderr((error) => {
      err += error
    })

    process.onDidExit((status) => {
      if (status == 1) reject(err)
      if (str.length == 0) reject("not found")

      return resolve(str)
    })

    process.start()
  })
}

exports.resolveRubyDebugSocketPath = async function() {
  return new Promise((resolve, reject) => {
    const process = new Process("/usr/bin/env", {
      cwd: nova.workspace.path,
      args: ["rdbg", "--util=list-socks"],
      stdio: ["ignore", "pipe", "pipe"],
      shell: true
    })

    let str = ""
    let err = ""

    process.onStdout((output) => {
      str += output.trim()
    })

    process.onStderr((error) => {
      err += error
    })

    process.onDidExit((status) => {
      if (status == 1) reject(err)
      if (str.length == 0) reject("not found")

      return resolve(str)
    })

    process.start()
  })
}

exports.generateRubyDebugSocketPath = async function() {
  return new Promise((resolve, reject) => {
    const process = new Process("/usr/bin/env", {
      cwd: nova.workspace.path,
      args: ["rdbg", "--util=gen-sockpath"],
      stdio: ["ignore", "pipe", "pipe"],
      shell: true
    })

    let str = ""
    let err = ""

    process.onStdout((output) => {
      str += output
    })

    process.onStderr((error) => {
      err += error
    })

    process.onDidExit((status) => {
      if (status == 1) reject(err)
      if (str.length == 0) reject("not found")

      return resolve(str)
    })

    process.start()
  })
}
