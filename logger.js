//**************************Set up your functionLogger*****************//
var functionLogger = {};

functionLogger.log = true;//Set this to false to disable logging 

/**
 * Gets a function that when called will log information about itself if logging is turned on.
 *
 * @param func The function to add logging to.
 * @param name The name of the function.
 *
 * @return A function that will perform logging and then call the function. 
 */
functionLogger.getLoggableFunction = function (func, name) {
  return function () {
    if (functionLogger.log) {
      var logText = name + '(';

      for (var i = 0; i < arguments.length; i++) {
        if (i > 0) {
          logText += ', ';
        }
        logText += arguments[i];
      }
      logText += ');';

      console.log(logText);
    }

    func.apply(this, arguments);
  }
};

/**
 * After this is called, all direct children of the provided namespace object that are 
 * functions will log their name as well as the values of the parameters passed in.
 *
 * @param namespaceObject The object whose child functions you'd like to add logging to.
 */
functionLogger.addLoggingToNamespace = function (namespaceObject) {
  for (var name in namespaceObject) {
    var potentialFunction = namespaceObject[name];

    if (Object.prototype.toString.call(potentialFunction) === '[object Function]') {
      namespaceObject[name] = functionLogger.getLoggableFunction(potentialFunction, name);
    }
  }
};


//**************************Set up your namespace functions*****************//
var namespaceObject = {};

namespaceObject.test1 = function (a, b, c, d, e) {
  namespaceObject.test2(a + b, c + d + e);
};

namespaceObject.test2 = function (ab, cde) {

};





//**************************Add logging to your namespace functions*****************//    
functionLogger.addLoggingToNamespace(namespaceObject);






//**************************Test it out*****************// 
namespaceObject.test1("alli", "gatssor", 3, 4, 5);



//  


function extend(sup, base) {
  var descriptor = Object.getOwnPropertyDescriptor(
    base.prototype, 'constructor'
  );
  base.prototype = Object.create(sup.prototype);
  var handler = {
    construct: function (target, args) {
      var obj = Object.create(base.prototype);
      this.apply(target, obj, args);
      return obj;
    },
    apply: function (target, that, args) {
      sup.apply(that, args);
      base.apply(that, args);
    }
  };
  var proxy = new Proxy(base, handler);
  descriptor.value = proxy;
  Object.defineProperty(base.prototype, 'constructor', descriptor);
  return proxy;
}

var Person = function (name) {
  this.name = name;
};

var Boy = extend(Person, function (name, age) {
  this.age = age;
});

Boy.prototype.sex = 'M';

var Peter = new Boy('Peter', 13);
console.log(Peter.sex);  // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age);  // 13

//  sdfsdlfkj 

function inject(obj, beforeFn) {
  for (let propName of Object.getOwnPropertyNames(obj)) {
    let prop = obj[propName];
    if (Object.prototype.toString.call(prop) === '[object Function]') {
      obj[propName] = (function (fnName) {
        return function () {
          beforeFn.call(this, fnName, arguments);
          return prop.apply(this, arguments);
        }
      })(propName);
    }
  }
}

function logFnCall(name, args) {
  let s = name + '(';
  for (let i = 0; i < args.length; i++) {
    if (i > 0)
      s += ', ';
    s += String(args[i]);
  }
  s += ')';
  console.log(s);
}

inject(Foo.prototype, logFnCall);


class TestClass {
  a(fds) {
    this.aa = 1;
    console.log('a called');
  }
  b() {
    this.bb = 1;
  }
}


const logger = className => {
  return new Proxy(new className(), {
    get: function (target, name, receiver) {
      console.log(`target ${arguments[0]} name ${name.toString()}`);
      if (!target.hasOwnProperty(name)) {
        if (typeof target[name] === "function") {
          if (this.arguments) {
            const d = Array.from(this.arguments).slice().join(',');
            console.log(`calling ${target.constructor.name}:${name}(${d})`);
          } else {
            console.log(`calling ${target.constructor.name}:${name}(d)`);
          }
        }
        return new Proxy(target[name], this);
      }
      return Reflect.get(target, name, receiver);
    }
  });
};

function traceMethodCallsEs6(obj) {
  let handler = {
    get(target, propKey, receiver) {
      const origMethod = target[propKey];
      return function (...args) {
        let result = origMethod.apply(this, args);
        console.log(propKey + JSON.stringify(args)
          + ' -> ' + JSON.stringify(result));
        return result;
      };
    }
  };
  return new Proxy(obj, handler);
}

function traceMethodCallsProxy(obj) {
  const handler = {
    get(target, propKey, receiver) {
      const targetValue = Reflect.get(target, propKey, receiver);
      if (typeof targetValue === 'function') {
        return function (...args) {
          const x = args.reduce((item, a) => a + item);
          console.log(x);
          console.log(`CALL ${target.constructor.name}:${name}(${args.join(',')})`, args);
          console.log('CALL', propKey, args);
          return targetValue.apply(this, args); // (A)
        }
      } else {
        return targetValue;
      }
    }
  };
  return new Proxy(obj, handler);
}

const instance = logger(TestClass)

instance.a(3) // output: "Calling Method : a || on : TestClass"
instance.b('3') // output: "Calling Method : a || on : TestClass"

const c = traceMethodCallsProxy(new TestClass());
c.a('3', 4)

// a('a-1');
// b('b-1');
// c('c-1');

console.log('run');