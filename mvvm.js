
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


window.deps = [];
function observe(data){
    if( typeof data != "object" ){
        return;
    }
    let dep = new Dep();
    window.deps.push(dep);
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
                if( Dep.listener ){
                    dep.addSub(Dep.listener);
                }
                return val;
            },
            set: function(newVal){
                if( newVal === val ){
                    return;
                }
                val = newVal;
                // if( typeof val == "object" ){
                //     observe(val);
                // }
                dep.notify();
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

                new Watcher(vm,keyArr,function(newVal){
                    node.textContent = text.replace(reg,newVal);
                });

                node.textContent = text.replace(reg,val);
                
            }
    
            if( node.childNodes ){
                replace(node);
            }
        })
    }

    

}

var id = 0;

function Dep(){
    this.subs = [];
    this.id = id ++;
}

Dep.prototype = {
    addSub(sub){
        this.subs.push(sub);
    },
    notify(){
        console.log("now , dep id:",this.id);
        this.subs.forEach(sub=>{
            sub.update();
        })
    }
}

function Watcher(vm,exp,fn){
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;
    
    // Dep.listener = this;
    let val = vm;
    for(let i = 0 ; i < exp.length ; i ++ ){
        if( i == exp.length - 1 ){
            Dep.listener = this;
        }
        val = val[exp[i]];
    }
    Dep.listener = undefined;
}

Watcher.prototype = {
    update(){
        let val = this.vm;
        this.exp.forEach(function(key){
            val = val[key];
        })
        this.fn(val);
    }
}