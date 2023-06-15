import{c as w,e as oe,m as Q}from"./index-34346f55.js";var Ge=t=>encodeURIComponent(t).replace(/[!'()*]/g,e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`),se="%[a-f0-9]{2}",z=new RegExp("("+se+")|([^%]+?)","gi"),K=new RegExp("("+se+")+","gi");function F(t,e){try{return[decodeURIComponent(t.join(""))]}catch{}if(t.length===1)return t;e=e||1;var s=t.slice(0,e),l=t.slice(e);return Array.prototype.concat.call([],F(s),F(l))}function ye(t){try{return decodeURIComponent(t)}catch{for(var e=t.match(z)||[],s=1;s<e.length;s++)t=F(e,s).join(""),e=t.match(z)||[];return t}}function ve(t){for(var e={"%FE%FF":"��","%FF%FE":"��"},s=K.exec(t);s;){try{e[s[0]]=decodeURIComponent(s[0])}catch{var l=ye(s[0]);l!==s[0]&&(e[s[0]]=l)}s=K.exec(t)}e["%C2"]="�";for(var d=Object.keys(e),v=0;v<d.length;v++){var S=d[v];t=t.replace(new RegExp(S,"g"),e[S])}return t}var We=function(t){if(typeof t!="string")throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof t+"`");try{return t=t.replace(/\+/g," "),decodeURIComponent(t)}catch{return ve(t)}},Xe=(t,e)=>{if(!(typeof t=="string"&&typeof e=="string"))throw new TypeError("Expected the arguments to be of type `string`");if(e==="")return[t];const s=t.indexOf(e);return s===-1?[t]:[t.slice(0,s),t.slice(s+e.length)]};const _e=t=>JSON.stringify(t,(e,s)=>typeof s=="bigint"?s.toString()+"n":s),pe=t=>{const e=/([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g,s=t.replace(e,'$1"$2n"$3');return JSON.parse(s,(l,d)=>typeof d=="string"&&d.match(/^\d+n$/)?BigInt(d.substring(0,d.length-1)):d)};function ge(t){if(typeof t!="string")throw new Error(`Cannot safe json parse value of type ${typeof t}`);try{return pe(t)}catch{return t}}function Y(t){return typeof t=="string"?t:_e(t)||""}const me="PARSE_ERROR",Ee="INVALID_REQUEST",we="METHOD_NOT_FOUND",be="INVALID_PARAMS",ie="INTERNAL_ERROR",L="SERVER_ERROR",Re=[-32700,-32600,-32601,-32602,-32603],P={[me]:{code:-32700,message:"Parse error"},[Ee]:{code:-32600,message:"Invalid Request"},[we]:{code:-32601,message:"Method not found"},[be]:{code:-32602,message:"Invalid params"},[ie]:{code:-32603,message:"Internal error"},[L]:{code:-32e3,message:"Server error"}},ae=L;function Oe(t){return Re.includes(t)}function Z(t){return Object.keys(P).includes(t)?P[t]:P[ae]}function Se(t){const e=Object.values(P).find(s=>s.code===t);return e||P[ae]}function Pe(t,e,s){return t.message.includes("getaddrinfo ENOTFOUND")||t.message.includes("connect ECONNREFUSED")?new Error(`Unavailable ${s} RPC url at ${e}`):t}var Ce={},D={},Te={get exports(){return D},set exports(t){D=t}};/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */(function(t){var e,s,l,d,v,S,j,M,N,C,A,x,U,b,B,J,H,$,V,q,G,W,X;(function(h){var T=typeof w=="object"?w:typeof self=="object"?self:typeof this=="object"?this:{};h(n(T,n(t.exports)));function n(r,o){return r!==T&&(typeof Object.create=="function"?Object.defineProperty(r,"__esModule",{value:!0}):r.__esModule=!0),function(a,c){return r[a]=o?o(a,c):c}}})(function(h){var T=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var o in r)r.hasOwnProperty(o)&&(n[o]=r[o])};e=function(n,r){T(n,r);function o(){this.constructor=n}n.prototype=r===null?Object.create(r):(o.prototype=r.prototype,new o)},s=Object.assign||function(n){for(var r,o=1,a=arguments.length;o<a;o++){r=arguments[o];for(var c in r)Object.prototype.hasOwnProperty.call(r,c)&&(n[c]=r[c])}return n},l=function(n,r){var o={};for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&r.indexOf(a)<0&&(o[a]=n[a]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var c=0,a=Object.getOwnPropertySymbols(n);c<a.length;c++)r.indexOf(a[c])<0&&Object.prototype.propertyIsEnumerable.call(n,a[c])&&(o[a[c]]=n[a[c]]);return o},d=function(n,r,o,a){var c=arguments.length,i=c<3?r:a===null?a=Object.getOwnPropertyDescriptor(r,o):a,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,r,o,a);else for(var y=n.length-1;y>=0;y--)(u=n[y])&&(i=(c<3?u(i):c>3?u(r,o,i):u(r,o))||i);return c>3&&i&&Object.defineProperty(r,o,i),i},v=function(n,r){return function(o,a){r(o,a,n)}},S=function(n,r){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(n,r)},j=function(n,r,o,a){function c(i){return i instanceof o?i:new o(function(u){u(i)})}return new(o||(o=Promise))(function(i,u){function y(p){try{f(a.next(p))}catch(R){u(R)}}function g(p){try{f(a.throw(p))}catch(R){u(R)}}function f(p){p.done?i(p.value):c(p.value).then(y,g)}f((a=a.apply(n,r||[])).next())})},M=function(n,r){var o={label:0,sent:function(){if(i[0]&1)throw i[1];return i[1]},trys:[],ops:[]},a,c,i,u;return u={next:y(0),throw:y(1),return:y(2)},typeof Symbol=="function"&&(u[Symbol.iterator]=function(){return this}),u;function y(f){return function(p){return g([f,p])}}function g(f){if(a)throw new TypeError("Generator is already executing.");for(;o;)try{if(a=1,c&&(i=f[0]&2?c.return:f[0]?c.throw||((i=c.return)&&i.call(c),0):c.next)&&!(i=i.call(c,f[1])).done)return i;switch(c=0,i&&(f=[f[0]&2,i.value]),f[0]){case 0:case 1:i=f;break;case 4:return o.label++,{value:f[1],done:!1};case 5:o.label++,c=f[1],f=[0];continue;case 7:f=o.ops.pop(),o.trys.pop();continue;default:if(i=o.trys,!(i=i.length>0&&i[i.length-1])&&(f[0]===6||f[0]===2)){o=0;continue}if(f[0]===3&&(!i||f[1]>i[0]&&f[1]<i[3])){o.label=f[1];break}if(f[0]===6&&o.label<i[1]){o.label=i[1],i=f;break}if(i&&o.label<i[2]){o.label=i[2],o.ops.push(f);break}i[2]&&o.ops.pop(),o.trys.pop();continue}f=r.call(n,o)}catch(p){f=[6,p],c=0}finally{a=i=0}if(f[0]&5)throw f[1];return{value:f[0]?f[1]:void 0,done:!0}}},X=function(n,r,o,a){a===void 0&&(a=o),n[a]=r[o]},N=function(n,r){for(var o in n)o!=="default"&&!r.hasOwnProperty(o)&&(r[o]=n[o])},C=function(n){var r=typeof Symbol=="function"&&Symbol.iterator,o=r&&n[r],a=0;if(o)return o.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&a>=n.length&&(n=void 0),{value:n&&n[a++],done:!n}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")},A=function(n,r){var o=typeof Symbol=="function"&&n[Symbol.iterator];if(!o)return n;var a=o.call(n),c,i=[],u;try{for(;(r===void 0||r-- >0)&&!(c=a.next()).done;)i.push(c.value)}catch(y){u={error:y}}finally{try{c&&!c.done&&(o=a.return)&&o.call(a)}finally{if(u)throw u.error}}return i},x=function(){for(var n=[],r=0;r<arguments.length;r++)n=n.concat(A(arguments[r]));return n},U=function(){for(var n=0,r=0,o=arguments.length;r<o;r++)n+=arguments[r].length;for(var a=Array(n),c=0,r=0;r<o;r++)for(var i=arguments[r],u=0,y=i.length;u<y;u++,c++)a[c]=i[u];return a},b=function(n){return this instanceof b?(this.v=n,this):new b(n)},B=function(n,r,o){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var a=o.apply(n,r||[]),c,i=[];return c={},u("next"),u("throw"),u("return"),c[Symbol.asyncIterator]=function(){return this},c;function u(_){a[_]&&(c[_]=function(O){return new Promise(function(I,de){i.push([_,O,I,de])>1||y(_,O)})})}function y(_,O){try{g(a[_](O))}catch(I){R(i[0][3],I)}}function g(_){_.value instanceof b?Promise.resolve(_.value.v).then(f,p):R(i[0][2],_)}function f(_){y("next",_)}function p(_){y("throw",_)}function R(_,O){_(O),i.shift(),i.length&&y(i[0][0],i[0][1])}},J=function(n){var r,o;return r={},a("next"),a("throw",function(c){throw c}),a("return"),r[Symbol.iterator]=function(){return this},r;function a(c,i){r[c]=n[c]?function(u){return(o=!o)?{value:b(n[c](u)),done:c==="return"}:i?i(u):u}:i}},H=function(n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r=n[Symbol.asyncIterator],o;return r?r.call(n):(n=typeof C=="function"?C(n):n[Symbol.iterator](),o={},a("next"),a("throw"),a("return"),o[Symbol.asyncIterator]=function(){return this},o);function a(i){o[i]=n[i]&&function(u){return new Promise(function(y,g){u=n[i](u),c(y,g,u.done,u.value)})}}function c(i,u,y,g){Promise.resolve(g).then(function(f){i({value:f,done:y})},u)}},$=function(n,r){return Object.defineProperty?Object.defineProperty(n,"raw",{value:r}):n.raw=r,n},V=function(n){if(n&&n.__esModule)return n;var r={};if(n!=null)for(var o in n)Object.hasOwnProperty.call(n,o)&&(r[o]=n[o]);return r.default=n,r},q=function(n){return n&&n.__esModule?n:{default:n}},G=function(n,r){if(!r.has(n))throw new TypeError("attempted to get private field on non-instance");return r.get(n)},W=function(n,r,o){if(!r.has(n))throw new TypeError("attempted to set private field on non-instance");return r.set(n,o),o},h("__extends",e),h("__assign",s),h("__rest",l),h("__decorate",d),h("__param",v),h("__metadata",S),h("__awaiter",j),h("__generator",M),h("__exportStar",N),h("__createBinding",X),h("__values",C),h("__read",A),h("__spread",x),h("__spreadArrays",U),h("__await",b),h("__asyncGenerator",B),h("__asyncDelegator",J),h("__asyncValues",H),h("__makeTemplateObject",$),h("__importStar",V),h("__importDefault",q),h("__classPrivateFieldGet",G),h("__classPrivateFieldSet",W)})})(Te);var m={},k;function je(){if(k)return m;k=1,Object.defineProperty(m,"__esModule",{value:!0}),m.isBrowserCryptoAvailable=m.getSubtleCrypto=m.getBrowerCrypto=void 0;function t(){return(w===null||w===void 0?void 0:w.crypto)||(w===null||w===void 0?void 0:w.msCrypto)||{}}m.getBrowerCrypto=t;function e(){const l=t();return l.subtle||l.webkitSubtle}m.getSubtleCrypto=e;function s(){return!!t()&&!!e()}return m.isBrowserCryptoAvailable=s,m}var E={},ee;function Ae(){if(ee)return E;ee=1,Object.defineProperty(E,"__esModule",{value:!0}),E.isBrowser=E.isNode=E.isReactNative=void 0;function t(){return typeof document>"u"&&typeof navigator<"u"&&navigator.product==="ReactNative"}E.isReactNative=t;function e(){return typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u"}E.isNode=e;function s(){return!t()&&!e()}return E.isBrowser=s,E}(function(t){Object.defineProperty(t,"__esModule",{value:!0});const e=D;e.__exportStar(je(),t),e.__exportStar(Ae(),t)})(Ce);function ce(t=3){const e=Date.now()*Math.pow(10,t),s=Math.floor(Math.random()*Math.pow(10,t));return e+s}function Ie(t=6){return BigInt(ce(t))}function Fe(t,e,s){return{id:s||ce(),jsonrpc:"2.0",method:t,params:e}}function Qe(t,e){return{id:t,jsonrpc:"2.0",result:e}}function De(t,e,s){return{id:t,jsonrpc:"2.0",error:Le(e,s)}}function Le(t,e){return typeof t>"u"?Z(ie):(typeof t=="string"&&(t=Object.assign(Object.assign({},Z(L)),{message:t})),typeof e<"u"&&(t.data=e),Oe(t.code)&&(t=Se(t.code)),t)}class ue{}class ze extends ue{constructor(e){super()}}class Me extends ue{constructor(){super()}}class Ne extends Me{constructor(e){super()}}const xe="^https?:",Ue="^wss?:";function Be(t){const e=t.match(new RegExp(/^\w+:/,"gi"));if(!(!e||!e.length))return e[0]}function fe(t,e){const s=Be(t);return typeof s>"u"?!1:new RegExp(e).test(s)}function te(t){return fe(t,xe)}function Ke(t){return fe(t,Ue)}function Ye(t){return new RegExp("wss?://localhost(:d{2,5})?").test(t)}function le(t){return typeof t=="object"&&"id"in t&&"jsonrpc"in t&&t.jsonrpc==="2.0"}function Ze(t){return le(t)&&"method"in t}function Je(t){return le(t)&&(He(t)||he(t))}function He(t){return"result"in t}function he(t){return"error"in t}class ke extends Ne{constructor(e){super(e),this.events=new oe.EventEmitter,this.hasRegisteredEventListeners=!1,this.connection=this.setConnection(e),this.connection.connected&&this.registerEventListeners()}async connect(e=this.connection){await this.open(e)}async disconnect(){await this.close()}on(e,s){this.events.on(e,s)}once(e,s){this.events.once(e,s)}off(e,s){this.events.off(e,s)}removeListener(e,s){this.events.removeListener(e,s)}async request(e,s){return this.requestStrict(Fe(e.method,e.params||[],Ie().toString()),s)}async requestStrict(e,s){return new Promise(async(l,d)=>{if(!this.connection.connected)try{await this.open()}catch(v){d(v)}this.events.on(`${e.id}`,v=>{he(v)?d(v.error):l(v.result)});try{await this.connection.send(e,s)}catch(v){d(v)}})}setConnection(e=this.connection){return e}onPayload(e){this.events.emit("payload",e),Je(e)?this.events.emit(`${e.id}`,e):this.events.emit("message",{type:e.method,data:e.params})}onClose(e){e&&e.code===3e3&&this.events.emit("error",new Error(`WebSocket connection closed abnormally with code: ${e.code} ${e.reason?`(${e.reason})`:""}`)),this.events.emit("disconnect")}async open(e=this.connection){this.connection===e&&this.connection.connected||(this.connection.connected&&this.close(),typeof e=="string"&&(await this.connection.open(e),e=this.connection),this.connection=this.setConnection(e),await this.connection.open(),this.registerEventListeners(),this.events.emit("connect"))}async close(){await this.connection.close()}registerEventListeners(){this.hasRegisteredEventListeners||(this.connection.on("payload",e=>this.onPayload(e)),this.connection.on("close",e=>this.onClose(e)),this.connection.on("error",e=>this.events.emit("error",e)),this.connection.on("register_error",e=>this.onClose()),this.hasRegisteredEventListeners=!0)}}const $e={Accept:"application/json","Content-Type":"application/json"},Ve="POST",ne={headers:$e,method:Ve},re=10;class et{constructor(e){if(this.url=e,this.events=new oe.EventEmitter,this.isAvailable=!1,this.registering=!1,!te(e))throw new Error(`Provided URL is not compatible with HTTP connection: ${e}`);this.url=e}get connected(){return this.isAvailable}get connecting(){return this.registering}on(e,s){this.events.on(e,s)}once(e,s){this.events.once(e,s)}off(e,s){this.events.off(e,s)}removeListener(e,s){this.events.removeListener(e,s)}async open(e=this.url){await this.register(e)}async close(){if(!this.isAvailable)throw new Error("Connection already closed");this.onClose()}async send(e,s){this.isAvailable||await this.register();try{const l=Y(e),v=await(await Q(this.url,Object.assign(Object.assign({},ne),{body:l}))).json();this.onPayload({data:v})}catch(l){this.onError(e.id,l)}}async register(e=this.url){if(!te(e))throw new Error(`Provided URL is not compatible with HTTP connection: ${e}`);if(this.registering){const s=this.events.getMaxListeners();return(this.events.listenerCount("register_error")>=s||this.events.listenerCount("open")>=s)&&this.events.setMaxListeners(s+1),new Promise((l,d)=>{this.events.once("register_error",v=>{this.resetMaxListeners(),d(v)}),this.events.once("open",()=>{if(this.resetMaxListeners(),typeof this.isAvailable>"u")return d(new Error("HTTP connection is missing or invalid"));l()})})}this.url=e,this.registering=!0;try{const s=Y({id:1,jsonrpc:"2.0",method:"test",params:[]});await Q(e,Object.assign(Object.assign({},ne),{body:s})),this.onOpen()}catch(s){const l=this.parseError(s);throw this.events.emit("register_error",l),this.onClose(),l}}onOpen(){this.isAvailable=!0,this.registering=!1,this.events.emit("open")}onClose(){this.isAvailable=!1,this.registering=!1,this.events.emit("close")}onPayload(e){if(typeof e.data>"u")return;const s=typeof e.data=="string"?ge(e.data):e.data;this.events.emit("payload",s)}onError(e,s){const l=this.parseError(s),d=l.message||l.toString(),v=De(e,d);this.events.emit("payload",v)}parseError(e,s=this.url){return Pe(e,s,"HTTP")}resetMaxListeners(){this.events.getMaxListeners()>re&&this.events.setMaxListeners(re)}}export{et as H,ze as I,ke as J,Ge as a,ge as b,Y as c,We as d,Ce as e,De as f,Ye as g,Pe as h,Ke as i,Ze as j,Qe as k,He as l,he as m,Je as n,Fe as o,ce as p,Xe as s};
