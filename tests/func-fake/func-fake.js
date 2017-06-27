var crypto = require('crypto');

module.exports = {
     httpContext: function (request) {
        return {
            invocationId: crypto.randomBytes(10).toString('hex'), // https://stackoverflow.com/a/14869745
            bindings: {
              req: request
            },
            log: function(value){
                console.log(value);
            },
            done: function(){
                console.log("Done called.")
                console.log(res)
            },
            res: null
        }
    },

    httpRequest: function(body){
        return{
            method: "POST",
            body:body,
            rawBody: JSON.stringify(body),
        };
    }
}
