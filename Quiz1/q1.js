let myObj = {
  foo: "bar",
  func: function () {
    var self = this;
    console.log("Outer func:this.foo=" + this.foo);
    console.log("Outer func:self.foo=" + self.foo);
    (function () {
      console.log("Inner func:this.foo=" + this.foo);
      console.log("Inner func:self.foo=" + self.foo);
    })();
  },
};
myObj.func();

//output
// Outer func:this.foo=bar
// Outer func:self.foo=bar
// Inner func:this.foo=undefined
// Inner func:self.foo=bar


// Reason

// In the outer function this references the object myObj while in the inner function this references the global object

//Confusion
//Don't understand the syntax of the inner function
