var Apple = function(x) {
    that = this;
    this.foo = x;
    return {
        y: x,
        bar: function() {
            return that.foo;
        }
    }
}

console.log(Apple(1).bar());
console.log(new Apple(2).bar());