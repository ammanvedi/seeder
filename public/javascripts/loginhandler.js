$(document).ready(function () {

		$('.ui.form')
		  .form({
		    uname: {
		      identifier  : 'uname',
		      rules: [
		        {
		          type   : 'empty',
		          prompt : 'Please enter your Username'
		        }
		      ]
		    },
		    password: {
		      identifier : 'pass',
		      rules: [
		        {
		          type   : 'empty',
		          prompt : 'Please enter a password'
		        }
		      ]
		    }
		  }, { onSuccess: AttemptLogin })
		;
		
		function AttemptLogin(){
		
		     var formData = {
		          uname: getFieldValue('uname'),
		          pass: getFieldValue('pass'),
		      };
		      
		      console.log(formData);
		
		      $.ajax({ type: 'POST', url: '/login', contentType: 'application/x-www-form-urlencoded' , data: formData, error: parseresponse, success: parsesuccess });
				
		}

		function parsesuccess(jqxhr, HTTPRes){
			console.log('SUCCESSFUL LOGIN');
			window.location.replace("/");
		}
		
		function parseresponse(jqxhr, HTTPResult){
		
		console.log('FAILED LOGIN');
		
		
		}
		
		
//Get value from an input field
   function getFieldValue(fieldId) { 
      // 'get field' is part of Semantics form behavior API
      return $('.ui.form').form('get field', fieldId).val();
   }



});