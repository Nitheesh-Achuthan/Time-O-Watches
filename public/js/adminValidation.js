function namevalid() {
  
    if ($("#name").val().match(/^[A-Za-z][A-Za-z ]*$/)) {
        document.getElementById("pname").style.display = "none";
        console.log('jooooooooooooooooooooooooooooooooooooooooooooooo')
    }
    else {
        document.getElementById("pname").style.display = "block";
        document.getElementById("pname").innerText = "Enter a valid First Name";
        return;
    }
    if ($("#name").val().length < 5) {

        value2 = false;
        document.getElementById("pname").style.display = "block";
        document.getElementById("pname").innerText = "Minimum Length of this field is 3";

    }
    else {
        value2 = true;
    }
}