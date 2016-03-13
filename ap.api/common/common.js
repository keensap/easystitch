// common.js
// ========
module.exports = {
    message : function (text, type, errors) {
        //private
        var isError;
        var privateFn = function () { };
        
        //public
        this.message = text;
        this.type = type | "message";
        this.errors = [];
        
        if (errors) {
            for (var err in errors) {
                if (typeof errors[err] != 'function') {
                    this.errors.push({ message: errors[err].message, name: errors[err].name, value: errors[err].value });
                }
            }
        }
        
        this.add = function (text, name, value) {
            this.errors.push({ message: text, name: name, value: value });
        };

        return this;
    }
};


