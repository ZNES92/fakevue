
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
    compile(options.el, this);

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

function compile(el, vm){
    vm.$el = document.querySelector(el.indexOf("#")>-1?el:"#"+el);
    let fragment = document.createDocumentFragment();
    while(child = vm.$el.firstChild){
        fragment.appendChild(child);
    }
    let reg = new RegExp(/\{\{(.*)\}\}/);
    replace(fragment);
    vm.$el.appendChild(fragment);
    function replace(_fragement){
        Array.from(_fragement.childNodes).forEach(function(node){
            let text = node.textContent;
            if( node.nodeType == 3 && reg.test(text) ){
                let keyArr = RegExp.$1.split(".");
                let val = vm;
                keyArr.map(function(key){
                    val = val[key];
                });
                node.textContent = text.replace(reg,val);
            }
    
            if( node.childNodes ){
                replace(node);
            }
        })
    }

    

}