#JS中this关键字的解析
* ###我们需要根据 "调用位置" 上函数的 "调用方式" 来确定函数中this使用的   "绑定规则。
* ###绑定规则 — 默认绑定 
	* 独立函数调用，可以把这条规则看作是无法应用到其他规则的默认规则
	* 独立函数调用，如果使用非严格模式，this会绑定到全局对象(window)
	* 示例1：
	```
	function foo(){
		console.log(this.a) // 在非严格模式下，this绑定到了window上
	}
	var a = 2 ;
	foo()  // 2
	```
	* 独立函数调用，如果使用严格模式(strict mode),this 会绑定到undefined。
		* 虽然this的绑定规则取决于调用位置，但只有调用foo()运行在非strict mode下时，默认绑定才能绑定到全局对象，严格模式下调用foo()不会影响默认绑定规则
	* 示例2:
	```
	function foo(){
		"use strict"
		console.log(this.a) // 在非严格模式下执行，this绑定到了undefined上
	}
	var a = 2 ;
	foo()  // 直接报错，Cannot read property 'a' of undefined
	``` 
	* 示例3：
	```
	function foo(){	
		console.log(this.a) // 在非严格模式下执行
	}
	var a = 2 ;
	(function(){
		"use strict"  // 只在严格模式下调用，并不影响默认绑定规则，this绑定到了window对象上
		foo()    // 2
	})()
	``` 
	* 无论函数是在哪个作用域中被调用,只要是独立调用则就会按默认绑定规则被绑定到全局对象或者undefined上
* ###绑定规则 — 隐示绑定
	* 隐式绑定的规则是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含
	* 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象
	* 示例1：
	```
		function foo(){
			console.log(this.a)  //2
		};
		var obj={
			a:2,
			foo:foo
		}
		obj.foo();  //隐示调用，this绑定到了obj对象
	```
	* 对象属性引用链中只有最顶层或者说最后一层会影响调用位置
	* 示例2：
		```
		function foo(){
			console.log(this.a)  // 50
		};
		var obj1={
			a:50,
			foo:foo
		}
		var obj2={
			a:20,
			obj1:obj1
		}
		obj2.obj1.foo();  //隐示调用，this绑定到了离它最近的obj1对象
	```
	* ####隐示丢失
		* 以隐式绑定的形式传入，最终以独立调用的方式调用 --->产生了隐式丢失
		* 产生隐示丢失最多的两种情况，
			* 将函数通过隐式调用的形式赋值给一个变量
			* 将函数通过隐式调用的形式进行传参
		* 示例3： 
		```
		function foo(){
			console.log(this.a)// 在非严格模式下，this指向window
		};
		// 定义一个全局变量a
		var a = "hello,world"
		// 定义一个对象obj
		var obj ={
			a:2,
			foo:foo
		}
		var bar = obj.foo;
		bar();   // hello,world
		```
		解决方案 ： 
		```
		function foo() {
			console.log( this.a );
		}
		var a = "hello,world"; // a是全局对象的属性
		var obj = {
			a: 2,
			foo: foo
		};
		
		var test = obj.foo;
		test();
		var bar = foo.bind(obj); //硬绑定
		bar(); // "2"
		```
		* 示例4：
		```
		function foo() {
			console.log( this.a ); // 隐示丢失，this指向window
		}
		//参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值
		function doFoo(fn) {
			fn(); 
		}
		
		var a = "hello，world"; 
		var obj = {
			a: 2,
			foo: foo
		};
		
		doFoo( obj.foo );    // hello,world
		```
		解决方案：
		```
		function foo() {
			console.log( this.a );
		}
		function doFoo(fn) {
			// fn其实引用的是foo
			fn(); // <-- 调用位置！
		}
		
		var a = "hello,world"; // a是全局对象的属性
		var obj = {
			a: 2,
			foo: foo
		};
		
		doFoo(foo.bind(obj)); // "2"
		```
		* 如果把函数传入语言内置的函数而不是传入自己声明的函数，结果是一样的，没有区别
		* JavaScript环境中内置的 setTimeout() 函数实现和下面的伪代码类似：
		```
		function setTimeout(fn,delay) {
			// 等待delay毫秒
			fn(); // <-- 调用位置！
		}
		```
		*示例5：
		```
		function foo() {
			console.log( this.a );
		}
		
		var a = "hello,world"; 
		var obj = {
			a: 2,
			foo: foo
		};
		
		setTimeout( obj.foo, 1000 );  //在内置函数setTimeout中调用，隐示丢失，在非严格模式下this指向window
		```
		解决方案 ：
		```
		function foo() {
			console.log( this.a );
		}	
		var a = "oops, global"; // a是全局对象的属性
		var obj = {
			a: 2,
			foo: foo
		};	
		setTimeout( foo.bind(obj), 1000 ); // "2"
		```
		

* ###绑定规则 — 显示绑定
	* 我们不想在对象内部包含函数引用，而想在某个对象上强制调用函数
	* 通过call() 和apply() 方法可以实现显示绑定
		* 示例1：
		```
			function foo(a,b){
				console.log(this.a,a,b) // this指向call()和apply()方法的第一个参数
			}
			var obj={
				a:2
			}
			foo.call(obj,"a","b");  // 2 a b
			foo.apply(obj,["a","b"]) // 2 a b
		```
	* 硬绑定
		* 示例2：
		```
		function foo() {
			console.log( this.a );
		}
		
		var a =1;
		var obj = {
			a:2
		};
		var obj_test = {
			a:"test"
		};
		var bar = function() {
			console.log( this.a );
			foo.call( obj );
		};
		
		bar(); // 1 2
		setTimeout( bar, 1000 ); // 1 2
		bar.call( obj_test ); //test  2   硬绑定的bar不可能再修改它的this(指的是foo中的this)
		```
		* 分析上述代码，我们创建了函数 bar() ，并在它的内部手动调用了foo.call(obj) ，因此强制把 foo 的 this 绑定到了 obj 。无论之后如何调用函数 bar ，它总会手动在 obj 上调用 foo 。这种绑定是一种显式的强制绑定，因此我们称之为硬绑定。
		
		* 硬绑定的典型应用场景就是创建一个包裹函数，传入所有的参数并返回接收到的所有值
		* 示例3：
		```
		function foo(arg1,arg2) {
			console.log( this.a,arg1,arg2); //this指向obj
			return this.a + arg1;   
		}
		var obj = {
			a:2
		};
		var bar = function() {
			return foo.apply( obj, arguments);  
		};
		var b = bar(3,2); // 2 3 2
		console.log( b ); // 5
		```
		* 示例4 — bind()函数的实现
		* 简单的辅助绑定函数    bind函数的作用：返回一个新的函数，并且指定该新函数的this指向
		```
		function bind(fn, obj) {
			return function() {
				return fn.apply( obj, arguments );
			};
		}
		
		var obj = {
			a:2
		};
		var obj_test = {
			a:22
		};
		var bar = bind( foo, obj);   // 是一个函数function() {return fn.apply( obj, arguments );};
		var b = bar(3); // 2 3 undefined
		console.log( b ); // 5
		bar.call(obj_test,3);//2 3 undefined
		```
		* 示例5：
		```
		document.write("test");// 在页面内输出一个字符串test
		var altwrite = document.write;  // 将其赋给一个变量
		altwrite("hello");   // altwrite()函数改变了write的this的指向，让它指向global或window对象，
		document.write("hello");  // 报错
		```
		三种解决方案：
		```
		document.write("test");// 在页面内输出一个字符串test
		var altwrite = document.write;  // 将其赋给一个变量
		altwrite.bind(document)(" hello"); // bind()方法解决，使this指向document
		altwrite.call(document, " call");  //使用call()方法解决
		altwrite.apply(document, [" apply"]) // shiyong apply()方法解决
		```

* ###绑定规则 — new绑定
	* JavaScript中的构造函数只是一些使用 new 操作符时被调用的函数。
	* 它们并不会属于某个类，也不会实例化一个类。实际上，它们甚至都不能说是一种特	殊的函数类型，它们只是被 new 操作符调用的普通函数而已。
	* 使用 new 来调用函数，或者说发生构造函数调用时，对于我们的this来说。
	  这个新对象会绑定到函数调用的 this 。
		* 示例
		```
		function foo(a) {
			this.a = a;
		}
		var bar = new foo(2);
		console.log( bar.a ); // 2
		```
	* 使用 new 来调用 foo(..) 时，我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this 上。 new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定。	
* ###绑定规则的优先级 
	* new()绑定 --> 显示绑定 --> 隐示绑定 --> 默认绑定 	
* ### 绑定例外
	* ES6中的箭头函数
		* 示例1：
		```
		function foo() {
		  setTimeout(() => {
		    console.log('id:', this.id);   // id:42
		  }, 100);
		}
		var id = 21;
		
		foo.call({ id: 42 })
		```
	* 被忽略的this
		* 如果把 null 或者 undefined 作为 this 的绑定对象传入 call 、 apply 或者 bind ，这些值在调用时会被忽略，实际应用的是默认绑定规则
		* 示例2
		```
		function foo() {
			console.log( this.a );
		}
		var a = 2;
		foo.call( null ); // 2
		```
	* 柯里化
		* 给目标函数预绑定一些参数
		* 示例3：
		```
		unction foo(a,b) {
			console.log( "a:" + a + ", b:" + b );
		}
		// 把数组“展开”成参数
		foo.apply( null, [2, 3] ); // a:2, b:3
		
		// 使用 bind(..) 进行柯里化
		var bar = foo.bind( null, [2] );
		bar( 3 ); // a:2, b:3
		```
		* 示例4：
		```
		function foo(a,b) {
			this
			console.log( "a:" + a + ", b:" + b );
		}
		// 我们的DMZ空对象,“DMZ”（demilitarized zone，非军事区）
		var ø = Object.create( null );//{}
		// 把数组展开成参数
		foo.apply( ø, [2, 3] ); // a:2, b:3
		// 使用bind(..)进行柯里化
		var bar = foo.bind( ø, 2 );
		bar( 3 ); // a:2, b:3
		```