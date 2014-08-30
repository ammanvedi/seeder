$(document).ready(function () {

	$('.ui.form')
	  .form({
	    fname: {
	      identifier  : 'fname',
	      rules: [
	        {
	          type   : 'empty',
	          prompt : 'Please enter your first name'
	        }
	      ]
	    },
	    lastName: {
	      identifier  : 'sname',
	      rules: [
	        {
	          type   : 'empty',
	          prompt : 'Please enter your last name'
	        }
	      ]
	    },
	    username: {
	      identifier : 'uname',
	      rules: [
	        {
	          type   : 'empty',
	          prompt : 'Please enter a username'
	        }
	      ]
	    },
	    password: {
	      identifier : 'pass',
	      rules: [
	        {
	          type   : 'empty',
	          prompt : 'Please enter a password'
	        },
	        {
	          type   : 'length[6]',
	          prompt : 'Your password must be at least 6 characters'
	        }
	      ]
	    },
	    terms: {
	      identifier : 'email',
	      rules: [
	        {
	          type   : 'email',
	          prompt : 'Please enter a valid email'
	        }
	      ]
	    }
	  }, { onSuccess: signupuser })
	;
	
	

	
	function signupuser(){
	
	     var formData = {
	          uname: getFieldValue('uname'),
	          fname: getFieldValue('fname'),
	          sname: getFieldValue('sname'),
	          email: getFieldValue('email'),
	          pass: getFieldValue('pass')
	      };
	      
	      console.log(formData);
	
	      $.ajax({ type: 'POST', url: '/signup', contentType: 'application/x-www-form-urlencoded' , data: formData, error: parseresponse, success: parsesuccess });
	
	
	}
	
	function parsesuccess(jqxhr, HTTPRes){
		window.location.replace("/login");
	}
	
	function parseresponse(jqxhr, HTTPResult){
	
	console.log('ERROR ' + HTTPResult);
	
	}
	
	
	//Get value from an input field
	   function getFieldValue(fieldId) { 
	      // 'get field' is part of Semantics form behavior API
	      return $('.ui.form').form('get field', fieldId).val();
	   }
	
	



});