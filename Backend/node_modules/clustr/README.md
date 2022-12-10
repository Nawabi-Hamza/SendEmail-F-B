# ClustrJS :herb:
> Interactive interface in front of functions.

ClustrJS may have different usages, its a tool that connects functions and values together and provides an interface that you
can reach them all through it.

## Install
Node JS
``` bash
$ npm i clustr
```

Browser
``` html
<script src='https://rawgit.com/Mahdimeraji07/clustr/master/dist/index.js'></script>
```

## Quick usage
``` JS
// Define new clustr
const greeting = new clustr('greeting', {
  greeting (args) { if (args[0]) this.me = newName }, // constructor
  me: 'Mohammad', // simple value
  hello (args) { return `Hi ${args[0]}.` },
  bye: { // define a subset in greeting root
    bye () { return 'Bye.' },
    seeYouSoon () { return 'Bye, see you soon!' },
    iDontEverWantToSeeYou () { return "i don't ever want to see you again!" }
  }
})

// Now greeting contains all above functions and values
greeting('Mahdi') // call greeting constructor
greeting.me() // Mahdi
greeting.hello('Ali') // Hi Ali.
greeting.bye().value // Bye.
greeting.bye.seeYouSoon() // Bye, see you soon!
greeting.bye.iDontEverWantToSeeYou() // i don't ever want to see you again!
```

## Other options

## Scope
Scope is an option that makes functions and values available in future.
### Example
``` JS
const greeting = new clustr('greeting', {
  _scope: { // define root scope
    handshake () { return true }
  }
  ...
})

greeting.hello.handshake() // true
greeting.bye.handshake() // true
greeting.bye.seeYouSoon.handshake() // true
```

## Alias
Functions can get several name by alias option.
### Example
``` JS
const greeting = new clustr('greeting', {
  _scope: { // define root scope
    handshake: {
      _alias: 'hs handS hShake', // space separated
      handshake () { return true }
    }
  }
  ...
})

greeting.hello.handshake() // true
greeting.hello.hs() // true
greeting.hello.handS() // true
greeting.hello.hShake() // true
```

## Pipe
Pipe make functions recursively available to itself
### Example
``` JS
function goAhead () { return 'Done' }
goAhead._pipe = true // transform a function to a pipe

const greeting = new clustr('greeting', {
  ...
  goAhead,
  ...
})

greeting.goAhead().value // Done
greeting.goAhead.goAhead().value // Done
greeting.goAhead.goAhead.goAhead().value // Done
// etc ...
```

## Streaming
After a function call, stack variable gets new item that is status of that function
to make last function call status available for future. you can get `last` and `stack`
as 2nd and 3rd function argument.
### Example
``` JS
const greeting = new clustr('greeting', {
  ...
  hello: {
    hello (args) {
      return `Hi ${args[0]}`
    },
    handshake (args, last, stack) {
      // last: is object that contains the status of last function called before this
      // stack: is an array that contains the status of all functions that called before
      return last.value + ' [with handshake]'
    }
  },
  ...
})

greeting.hello('Ali').value // Hi Ali
greeting.hello('Ali').handshake() // Hi Ali [with handshake]
greeting.hello.handshake() // undefined [with handshake] : because no function called before
```

## License

[ISC](http://opensource.org/licenses/ISC)