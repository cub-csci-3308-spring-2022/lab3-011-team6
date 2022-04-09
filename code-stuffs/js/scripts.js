function confirmPassword(){
	var password = document.getElementById("pword");
	var confirm = document.getElementById("conpword");
	var condition = password.value == confirm.value;
	if(condition){
		console.log("Passwords Match!");
		var but = document.getElementById("button");
		but.disabled = false;
	}
	else{
		var label = document.getElementById("buttonlabel");
		label.style.color = "red";
		label.innerHTML = "Passwords do not match!";
		console.log("Passwords do not match!");
	}
	password.onchange = confirmPassword;
	confirm.onkeyup = confirmPassword;
}
function myAlert(message){
	alert(message);
}