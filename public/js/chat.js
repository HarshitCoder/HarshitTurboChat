var socket=io();

function autoscrolling(){

var messages = $('#messages');

var clientHeight =messages.prop('clientHeight');
var scrollHeight =messages.prop('scrollHeight');
var scrollTop =messages.prop('scrollTop');
var newmessage=messages.children('li:last-child');
var newmessageHeight = newmessage.innerHeight();
var lastMessageHeight = newmessage.prev().innerHeight();

if(scrollTop+clientHeight +newmessageHeight + lastMessageHeight >= scrollHeight)
{
messages.scrollTop(scrollHeight);
}
}
	socket.on('connect',()=>{
		console.log("server conected");
		var params = $.deparam(window.location.search);
		socket.emit('join',params,function(err){
			if(err)
			{

alert(err);
window.location.href='/';
			}else
			{
console.log("No error");
			}
		});
		
	});
	socket.on('updateUserList',function(userlist){
		console.log('userlist',userlist);

		var ol=$('<ol></ol>');

		userlist.forEach(function(user){

			ol.append($('<li></li>').text(user));
		});

		$('#users').html(ol);
	})
	// socket.emit('createMessage',
		// {from:'harshitfrom@harshit.com',
		// text:'Welcome to first node chat app'},
		// function (data){
		// 	console.log('got it',data);
		// });
	socket.on('newMessage',function(newMessage){
		console.log('newmessage',newMessage); 
		var dateFrom=moment(newMessage.createdAt).format('h:mm a');
		var template = $('#message-template').html();
        var html=Mustache.render(template,{dateFrom:dateFrom,from:newMessage.from,text:newMessage.text})
		// var li=$('<li></li>');
		// li.text(`${dateFrom} - ${newMessage.from}  ${newMessage.text}`)
		
		 $('#messages').append(html);
		 autoscrolling();
	});


socket.on('newLocationMessage',function(newMessage){
		// console.log('newmessage',newMessage); 
		
		// var li=$('<li></li>');
		// var a=$('<a target="_blank">My Current Location </a>');
		// a.attr('href',newMessage.url);
		var dateFormat=moment(newMessage.createdAt).format('h:mm a');
		var template=$('#message-sendlocationtemplate').html();
		var html=Mustache.render(template,{dateFrom:dateFormat,from:newMessage.from,url:newMessage.url})
		// li.text(`${dateFormat} - ${newMessage.from}    `);
		// li.append(a);
		
		$('#messages').append(html);
		autoscrolling();
	});

	socket.on('disconnect',()=>{
		console.log("server disconected");
	});

$('#message-form').on('submit',function(e){
		e.preventDefault();
        socket.emit('createMessage',
		{from:'User',
		text:$('[name=message]').val()},
		function (){
			$('[name=message]').val('');
		});
	});

var locationButton=$('#sendLocation');
locationButton.on('click',function(){

	if(!navigator.geolocation)
	{
		return alert("your browser is not compatible");

	}

locationButton.attr('disabled','disabled').text('Sending Location');
navigator.geolocation.getCurrentPosition(function(position){
	locationButton.removeAttr('disabled').text('Send Location');
     socket.emit('createLocationMessage',{
	latitude:position.coords.latitude,
	longitude:position.coords.longitude,
	createdAt:moment().valueOf()
})

},function(){
	locationButton.removeAttr('disabled').text('Send Location');
	return alert("Unable to fetch location");
})

})