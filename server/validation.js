var isRealString = function (str) {

	return typeof str === 'string' && str.trim().length>0
	// body...
}

module.exports ={isRealString} ;