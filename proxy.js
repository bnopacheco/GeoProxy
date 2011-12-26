$(document).ready(function() {    
	
	/*chrome.proxy.settings.get({}, function(config) {	
      $("#cur_proxy").append('<p>'+config.value.rules.singleProxy.host+':'+config.value.rules.singleProxy.port+'</p>');
	});*/
	
	if((localStorage.getItem('ip') != null) && (localStorage.getItem('port') != null))
		$('#cur_proxy').empty().append('<p>Proxy set - '+localStorage.getItem('ip')+':'+localStorage.getItem('port')+'</p>');
	else
		$('#cur_proxy').empty().append('<p>Proxy not used<p>');

	$('#search').click(function () {
	  searchProxy();
	});
	
	$('#clear').click(function() {
	  clearProxy();
	});		
	
	function searchProxy()
	{
	  var countryId = $('#country_id').val();
	  if(countryId == 'select') 
	  {
	    alert("Select a country");
		return;
	  }
	  
	  var proxies=new Array();
	  var i = 0;
	  $.get('http://www.xroxy.com/proxylist.php?port=&type=transparent&ssl=&country='+countryId+'&latency=&reliability=&sort=latency', function(res) { 
	    var first_set = $(res).find('.row0');
		var second_set = $(res).find('.row1');
		var first_len = first_set.length;
		var second_len = second_set.length;
		var total_len = first_len + second_len;

		if(first_len == 0)
		{
		  alert("No Proxy Found")
		  return;
		}
		else
		{		 
	      $(first_set).each(function() {
	        var ip = $.trim($(this).find('td:eq(1) a').text());
		    var port = $(this).find('td:eq(2) a').text();
		    proxies[i] = ip+':'+port;
		    i = i + 2;
	      });
		}
	   
	    i = 1;
	    if(second_len != 0)
	    {
	      $(second_set).each(function() {
	        var ip = $.trim($(this).find('td:eq(1) a').text());
		    var port = $(this).find('td:eq(2) a').text();
		    proxies[i] = ip+':'+port;
		    i = i + 2;	     
	      });
	    }
	   
	    $("#new_proxy").empty();
	   
	    for(i=0;i<total_len;i++)
		  $("#new_proxy").append('<a class="proxylist" href=#>'+proxies[i]+'</a></br>');
		 
	    $(".proxylist").on("click", function(){
	      setProxy($(this).text());
        }); 
	   
	  }); //end get
	} //end searchProxy()
	
	function setProxy(new_proxy)
	{
		var arr, ip, port;
		arr = new_proxy.split(':');
		ip = arr[0];
		port = parseInt(arr[1]);

		var config = {
		  mode: "fixed_servers",
		  rules: {
			singleProxy: {
			  host: ip,
			  port: port
			}
		  }
		};
		
	    chrome.proxy.settings.set(
		  {value: config, scope: 'regular'},
		  function() {});
		  
		localStorage.setItem('ip', ip); 
		localStorage.setItem('port', port); 
		
		$('#cur_proxy').empty().append('<p>Proxy set - '+localStorage.getItem('ip')+':'+localStorage.getItem('port')+'</p>');
	}
	
	function clearProxy()
	{
	  var config = {
	    mode: "direct"		  
	  };
		
	  chrome.proxy.settings.set(
	    {value: config, scope: 'regular'},
		function() {});
		
	  localStorage.removeItem('ip'); 
	  localStorage.removeItem('port'); 
		
	  $('#cur_proxy').empty().append('<p>Proxy not used<p>');
	}
	
	/*$.ajax({ 
	     type: "GET",   
         url: "http://vinayrv.appspot.com/geoproxy", 
         async: false,
         success : function(data)
         {
			var array = data.split(/[\n\s]/g);
			var i=0;
			while(i < array.length-3)
			{
				if((array[i]=="IN") || array[i]=="KR")
				{
					$("#new_proxy").append('<p>'+array[i]+'</p>');
					i++;
					continue;
				}
				else
				{
					$("#new_proxy").append('<a class="proxylist" href=#>'+array[i+1]+':'+array[i+3]+'</a></br>');
					i = i + 4;
				}	
			}
         }
	});	*/
		
 });
 
