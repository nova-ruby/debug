const {
  resolveRdbgPath,
  generateRubyDebugSocketPath,
  resolveRubyDebugSocketPath
} = require("./helpers")

class RubyTasksAssistant {
  async resolveTaskAction(context) {
    const { action, data, config } = context

    if (action == Task.Run && data.type == "rubyDebug") {
      try {
        const action = new TaskDebugAdapterAction("rdbg")

        action.adapterStart = "launch"
        action.debugRequest = "launch"
        action.transport    = "domainSocket"

        const rdbgPath   = config.get("ruby.debug.rdbgPath") || await resolveRdbgPath()
        const socketPath = await generateRubyDebugSocketPath()
        const hasGemfile = nova.workspace.contains(nova.workspace.path + "/Gemfile") ||
                            nova.workspace.contains(nova.workspace.path + "/gems.rb")
        const useBundler = config.get("ruby.debug.useBundler") && hasGemfile
        const program    = config.get("ruby.debug.command") || useBundler ? "bundle exec ruby" : "ruby"
        const script     = config.get("ruby.debug.script") || nova.workspace.activeTextEditor.document.path
        const args       = [ "--command", "--open", "--stop-at-load", `--sock-path=${socketPath}`, "--", program, script ]
        const customArgs = config.get("ruby.debug.customArgs") || []

        const env = {}
        Object.entries(config.get("ruby.debug.env")).forEach(([key, value]) => {
          env[value.key] = value.value
        })

        action.command = rdbgPath
        action.cwd     = config.get("ruby.debug.workingDirectory") || nova.workspace.path
        action.args    = [ ...args, ...customArgs ]
        action.env     = env

        action.socketPath = socketPath

        return action
      } catch (error) {
        console.error(error)
        throw error
      }
    } else if (action == Task.Run && data.type == "rubyRemoteDebug") {
      try {
        const socketPath = config.get("ruby.debug.socketPath") || await resolveRubyDebugSocketPath()
        if (!socketPath) return null

        const action = new TaskDebugAdapterAction("rdbg")

        action.adapterStart = "attach"
        action.debugRequest = "attach"
        action.transport    = "domainSocket"

        action.socketPath = socketPath

        return action
      } catch (error) {
        console.error(error)
        throw error
      }
    }

    return null
  }
}

module.exports = new RubyTasksAssistant()
