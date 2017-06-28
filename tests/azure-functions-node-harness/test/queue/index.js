module.exports = function(context, data) {
    context.log('here');
    context.bindings.output = "foobar";
    context.done();
}