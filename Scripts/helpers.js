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
      str += output
    })

    process.onStderr((error) => {
      err += error
    })

    process.onDidExit((status) => {
      if (status == 1) reject(err)

      str = str.trim()
      if (str.length == 0 || str == "rdbg not found") {
        reject(new Error("Impossible to find rdbg in $PATH."))
      }

      resolve(str)
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
      str += output
    })

    process.onStderr((error) => {
      err += error
    })

    process.onDidExit((status) => {
      if (status == 1) reject(err)

      str = str.trim()
      if (str.length == 0) {
        reject(new Error("No open socket. Make sure you have launched rdbg with the --open flag."))
      }
      if (str.split(/\r?\n/).length > 1) {
        reject(new Error("Multiple open sockets. Please specify which one to use."))
      }

      resolve(str)
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

      str = str.trim()
      if (str.length == 0) {
        reject(new Error("Impossible to generate socket path. Make sure rdbg is in $PATH."))
      }

      resolve(str)
    })

    process.start()
  })
}
