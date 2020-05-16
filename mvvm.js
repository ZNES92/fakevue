
function Fakevue(options){
    let data = this._data = options.data;
    observe(data);
    for(let key in data){
        Object.defineProperty(this,key,{
            enumerable:true,
            configurable:true,
            get:function(){
                return this._data[key];
            },
            set:function(v){
                this._data[key] = v;
            }
        })
    }
}


function observe(data){
    
    for(let key in data){
        let val = data[key];
        if( typeof val == "object" ){
            observe(val);
        }
        Object.defineProperty(data,key,{
            enumerable: true,
            configurable: true,
            get: function(){
                // console.log("now get");
                return val;
            },
            set: function(newVal){
                if( newVal === val ){
                    return;
                }

                val = newVal;
                observe(val);
            }
        })
    }
}