function fnamevalid() {
    value1 = false;
    if ($("#fname").val().match(/^[A-Za-z][A-Za-z ]*$/)) {
        value1 = true;
        document.getElementById("pname").style.display = "none";
    }
    else {
        document.getElementById("pname").style.display = "block";
        document.getElementById("pname").innerText = "Enter a valid first Name";
        value1 = false;
        return;
    }
    if ($("#fname").val().length < 5) {

        value2 = false;
        document.getElementById("pname").style.display = "block";
        document.getElementById("pname").innerText = "Minimum Length of this field is 5";

    }
    else {
        value2 = true;
    }
}


function lnamevalid() {
    value3 = false;
    if ($("#lname").val().match(/^[A-Za-z][A-Za-z ]*$/)) {
        value3 = true;
        document.getElementById("lnam").style.display = "none";
    }
    else {
        document.getElementById("lnam").style.display = "block";
        document.getElementById("lnam").innerText = "Enter a valid last Name";
        value3 = false;
        return;
    }
if ($("#lname").val().length < 3) {

    value4 = false;
    document.getElementById("lnam").style.display = "block";
    document.getElementById("lnam").innerText = "Minimum Length of this field is 3";

}
else {
    value4 = true;
}
}


function emailvalid() {
    value5 = false;
    if ($("#email").val().match(/^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/)) {
        value5 = true;
        document.getElementById("ename").style.display = "none";
    } else {
        document.getElementById("ename").style.display = "block";
        document.getElementById("ename").innerHTML = "Enter a valid email";
        value5 = false;
    }

}

function mobvalid() {
    value6 = false;
    if ($("#mobile").val().match(/^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/)) {
        value6 = true;
        document.getElementById("pmob").style.display = "none";
    } else {
        document.getElementById("pmob").style.display = "block";
        document.getElementById("pmob").innerHTML = "Enter a valid number";
        value6 = false;
    }
}

function passwordvalid() {
    value7 = false;
    if($("#password").val().match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
        value7 = true;
        document.getElementById("pPswd").style.display = "none";
     } else {
        document.getElementById("pPswd").style.display = "block";
        document.getElementById("pPswd").innerHTML = "Your Password must be Minimum six characters, at least one uppercase letter, one lowercase letter and one number";
        value7 = false;
     }
}



// function pswdvalid() {
//     $(document).ready(function () {
//         $('input[type=password]').keyup(function () {
//             // set password variable
//             var password = $(this).val();

//             //validate the length
//             if (password.length < 8) {
//                 $('#length').removeClass('valid').addClass('invalid');
//             } else {
//                 $('#length').removeClass('invalid').addClass('valid');
//             }

//             //validate letter
//             if (password.match(/[A-z]/)) {
//                 $('#letter').removeClass('invalid').addClass('valid');
//             } else {
//                 $('#letter').removeClass('valid').addClass('invalid');
//             }

//             //validate capital letter
//             if (password.match(/[A-Z]/)) {
//                 $('#capital').removeClass('invalid').addClass('valid');
//             } else {
//                 $('#capital').removeClass('valid').addClass('invalid');
//             }

//             //validate number
//             if (password.match(/\d/)) {
//                 $('#number').removeClass('invalid').addClass('valid');
//             } else {
//                 $('#number').removeClass('valid').addClass('invalid');
//             }

//         }).focus(function () {
//             $('#pswd_info').show();
//         }).blur(function () {
//             $('#pswd_info').hide();
//         });
//     })
// }
