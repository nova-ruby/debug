<p align="center">
  <img src="https://raw.githubusercontent.com/tommasongr/nova-ruby-debug/main/misc/extension.png" width="80" height="80">
</p>
<h1 align="center">Ruby Debug for Nova</h1>

Connect Nova to the **[Ruby Debug](https://github.com/ruby/debug)** gem enabling local and remote debugging.

The connection is made possible by the `rdbg` command. This is why you can consider the extension as the Nova's [vscode-rdbg](https://github.com/ruby/vscode-rdbg) counterpart.

> Please be patient if you get into issues or limitations. We are still testing and improving the extension.

> Right now not all the settings and features of `vscode-rdbg` are supported.
> This is true especially for the remote debugger.
> The aim in the future is to bring it near to a one to one porting.

## Requirements

You need to install latest `debug` gem and `rdbg` command should be in `$PATH`.

```
$ gem install debug
```

If you are using `ruby 3.1.0` or later the `debug` gem comes bundled.

## Local debugging (launch)

### Setup

To start using the local debugger go to Nova's Project Settings and add a new "Ruby Debug" task from the provided template.

### Usage

You can configure the debugger as you like in the Project Settings or run it as it is.
The default configuration will try to find the `rdbg` command on your machine and run the current open file in Nova with the `ruby` command.

If a breakpoint is found, the program execution should pause and the debugger console should appear.

## Remote debugging (attach)

### Setup

To start using the remote debugger go to Nova's Project Settings and add a new "Ruby Remote Debug" task from the provided template.

### Usage

To use the remote debugger make sure you are running the `rdbg` command with the `--open` flag.
This informs `rdbg` to listen for connections from the outside.

**Right now the only connection method allowed is `domainSocket`.**
It means that if at startup the debugger finds a single open `socketPath` will use that, otherwise **you have to specify which one to use**.

**Specifying the socketPath**

Start by generating a `socketPath` with the `rdbg --util=gen-sockpath` command.
It should print something like:

```
/var/folders/0y/5cyl_crn3mv0y_gyg734ty2h0000gn/T/ruby-debug-sock-501/ruby-debug-tommaso-71169
```

Next configure the `rdbg` command to use the generated socket by specifying `--sock-path=SOCK_PATH`.

The last step is to tell the remote debugger to use the generated socket. You can do that in the Ruby Remote Debug task settings.

### Examples

**Ruby on Rails**

Allow remote debugging by running `rails server` under `rdbg`:

```
$ rdbg --command --open --nonstop -- rails server
```

To use the new `bin/dev` command edit your `Procfile.dev` accordingly:

```
web: rdbg --command --open --nonstop -- bin/rails server -p 3000
css: bin/rails tailwindcss:watch
``` 

## Contributing

You are welcome to contribute to the development!

All you have to do to get up and running is to fork, download and rename the folder from `nova-ruby-debug` to `Ruby Debug.novaextension`.
After that you should be able to active the project as extension from the Nova's `Extensions` menu.
