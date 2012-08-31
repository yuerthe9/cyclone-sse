(function($){
    $.fn.extend({
        sse: function(options) {
            var defaults = {
                sse_server: null,
                channels: [],
                debug: false
            }

            var options = $.extend(defaults, options);

            return this.each(function(){
                var self = $(this);
			    if($.eventsource) {
			        var sse_server = self.attr('data-sse-server') || options.sse_server;
			        if (!sse_server) {
			        	console.log('no sse server specified')
			        	return false;
			        }
			        var channel_raw = self.attr('data-sse-channels');
			        if (channel_raw.length) {
			        	var channel_list = channel_raw.split(',')
			        } else {
			        	var channel_list = options.channels;
			        }
			        var url = sse_server;
			        if (channel_list.length) {
			        	var channels =  $.param({'channels': channel_list});
			        	url = url + '?' + channels;
			        }
			        if (channel_list.length === 0 && options.debug === true) {
			        	console.log('no channels specified, you will listen to default channel');
			        }
			        console.log(url);

			        $.eventsource({
			            label: 'sys-sse',
			            url: url,
			            dataType: 'json',
			            open: function() {
			            	if (options.debug === true) {
			            		console.log('sse connection opened');
			            	}
			                self.trigger('sse.open');
			            },
			            message: function(msg) {
			            	if (options.debug === true) {
			            		console.log(msg);	
			            	}
			            	if (msg) {
			                	var event = 'sse.';
								var type = msg[0];
								var data = msg[1];
			                	event += type;
			                	console.log(event);
			                	self.trigger(event, data);
			               }
			            },
			            error: function(msg) {
			            	if (options.debug === true) {
			            		console.log('sse connection error:');
			            		console.log(msg);
			            	}
			                self.trigger('sse.error', msg);
			            }
			        });	
			    }
            });
        }
    })
})
(jQuery) 