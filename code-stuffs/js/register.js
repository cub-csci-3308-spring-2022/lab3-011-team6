function confirmPassword(){
	var password = document.getElementById("pword");
	var confirm = document.getElementById("conpword");
	if(password.value != confirm.value){
		confirm.setCustomValidity("Passwords do not match");
	}
	else{
		confirm.setCustomValidity("Passwords match!")
	}
	password.onchange = confirmPassword;
	confirm.onkeyup = confirmPassword;
}