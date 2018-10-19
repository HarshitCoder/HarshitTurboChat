
var moment=require('moment');
var generatemessage=(from,text)=>{

	return {
		from,
		text,
		createdAt:moment().valueOf()
	};
};
var generatelocationmessage=(from,lat,long,createdAt)=>{

	return {
		from,
		url:`https://www.google.com/maps?q=${lat},${long}`,
	    createdAt
	}
}
module.exports={generatemessage,generatelocationmessage}