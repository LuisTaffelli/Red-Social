const Sandbox = async function (code) {
	try{
		let response = ""
		const promisifiedresponse = new Promise((resolve, reject)=>{
			try{
				function Worker()
				{
					this.MaxIterations = 1000000;
					this.Enabled = true;    
					this.condition = true;
					this.iteration = 0;
					this.result = ''
					this.Loop = function()
					{
						if (this.condition 
							&& this.Enabled 
							&& this.iteration++ < this.MaxIterations)
						{
							this.result = eval(code)
							setTimeout(this.Loop.bind(this),0);
						}
					};  
					this.Stop = function()
					{
						response = this.result
						this.Enabled = false;
					};
				}
				var w = new Worker();
				setTimeout(w.Loop.bind(w), 0);
				setTimeout(w.Stop.bind(w), 3000);
				resolve(new Promise(resolve => setTimeout(resolve, 6000)).then(()=>{return response}))
			}catch(e){
				reject('wrong in the syntax, please check your code')
			}

		})
		return promisifiedresponse;
	}catch(e){
		return e
	}

}

module.exports = {
	Sandbox
}