const express=require('express');
const http=require('http');
var app = express();
var server=http.createServer(app);
var {generatemessage}=require('./utils/message.js');
var {generatelocationmessage}=require('./utils/message.js');
var {Users}=require('./utils/users.js');
const path = require('path');
const publicPath=path.join(__dirname ,'../public');
var {isRealString} = require('./validation');
const socketIO =require('socket.io');
const port=process.env.PORT|| 3000;
app.use(express.static(publicPath));
var io=socketIO(server);
var users = new Users();
io.on('connection',(socket)=>{
	console.log("new user connected");
    
	socket.on('join',(params,callback)=>{

		console.log(params.name);
		console.log(params.room);
		if (!isRealString(params.name) || !isRealString(params.room))
		{
			return callback("Name and room name are required");
		}
		socket.join(params.room);
		users.removeUser(socket.id);
		var a =users.addUser(socket.id,params.name,params.room);
		console.log(a);
		io.to(params.room).emit('updateUserList',users.getUserList(params.room));
		socket.emit('newMessage',generatemessage('Admin','Welcome to node chat app from server'));
		socket.broadcast.to(params.room).emit('newMessage',generatemessage('Admin',` ${params.name} has Joined`));
        callback();
	})
	// socket.emit('newMessage',{from:'k@yfrom.com',text:'hey how are you?',createdAt:'1234'});
	socket.on('createMessage',(message,callback)=>
		{
			var user =users.getUser(socket.id);
if(user && isRealString(message.text))
{

		io.to(user.room).emit('newMessage',{from:user.name,text:message.text});
		callback();
}
callback('this is from server');
	});


socket.on('createLocationMessage',(coords)=>
		{

			var user =users.getUser(socket.id);
if(user)
{

		io.to(user.room).emit('newLocationMessage',generatelocationmessage(user.name,coords.latitude,coords.longitude,coords.createdAt));
		callback();
}


		
	});
	
	socket.on('disconnect',()=>{
		console.log("userRemoved");
		var userRemoved = users.removeUser(socket.id);
		console.log(userRemoved+"jj");
		if(userRemoved)
		{
			io.to(userRemoved.room).emit('updateUserList',users.getUserList(userRemoved.room));
			console.log("test");
			io.to(userRemoved.room).emit('newMessage',generatemessage('Admin',`${userRemoved.name} has left room. `));
		}

	});



	});


server.listen(port,()=>{
	console.log("server running");
});   