function firstnamevalid() {
    value1 = false;
    if ($("#fname").val().match(/^[A-Za-z][A-Za-z ]*$/)) {
        value1 = true;
        document.getElementById("pfname").style.display = "none";
    }
    else {
        document.getElementById("pfname").style.display = "block";
        document.getElementById("pfname").innerText = "Enter a valid First Name";
        value1 = false;
        return;
    }
    if ($("#fname").val().length < 5) {

        value2 = false;
        document.getElementById("pfname").style.display = "block";
        document.getElementById("pfname").innerText = "Minimum Length of this field is 5";

    }
    else {
        value2 = true;
    }
}


function lastnamevalid() {
    value3 = false;
    if ($("#lname").val().match(/^[A-Za-z][A-Za-z ]*$/)) {
        value3 = true;
        document.getElementById("plname").style.display = "none";
    }
    else {
        document.getElementById("plname").style.display = "block";
        document.getElementById("plname").innerText = "Enter a valid last Name";
        value3 = false;
        return;
    }
if ($("#lname").val().length < 3) {

    value4 = false;
    document.getElementById("plname").style.display = "block";
    document.getElementById("plname").innerText = "Minimum Length of this field is 3";

}
else {
    value4 = true;
}
}

function mobvalid() {
    value5 = false;
    if ($("#mobile").val().match(/^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/)) {
        value5 = true;
        document.getElementById("pmob").style.display = "none";
    } else {
        document.getElementById("pmob").style.display = "block";
        document.getElementById("pmob").innerHTML = "Enter a valid number";
        value5 = false;
    }
}


function emailvalid() {
    value6 = false;
    if ($("#email").val().match(/^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/)) {
        value6 = true;
        document.getElementById("ename").style.display = "none";
    } else {
        document.getElementById("ename").style.display = "block";
        document.getElementById("ename").innerHTML = "Enter a valid email";
        value6 = false;
    }

}

function countryvalid() {
    value7 = false;
    if ($("#country").val().match(/^[A-Za-z][A-Za-z ]*$/)) {
        value7 = true;
        document.getElementById("pcountry").style.display = "none";
    }
    else {
        document.getElementById("pcountry").style.display = "block";
        document.getElementById("pcountry").innerText = "Enter a valid Country Name";
        value7 = false;
        return;
    }


}
function addressvalid() {
    value8 = false;
    if ($("#address").val().match(/^[a-zA-Z0-9\s,'-]*$/)) {
        value8 = true;
        document.getElementById("paddress").style.display = "none";
    }
    else {
        document.getElementById("paddress").style.display = "block";
        document.getElementById("paddress").innerText = "Enter a valid Address";
        value8 = false;
        return;
    }

}

// ----------------------------------------

function couponInput() {
    document.getElementById("pcoupon").style.display = "none";
}

function couponCheck(total,coupon) {
   $.ajax({
        url:`/applycoupon/${coupon}/${total}`,
        method:'POST',
        success:(response)=>{
            if (response.error) {
                document.getElementById("pcoupon").style.display = "block";
                document.getElementById("pcoupon").innerText = response.error;
            } else if (response.couponPrice) {
                $('#tot').val(response.couponPrice);
                $("#apply_btn").hide();
                $("#applied_btn").show();

                document.getElementById("totalShow").innerText =`${response.couponPrice}`;
                // document.getElementById("discountPrice").innerText =`Discount : $ ${response.discountPrice}`;
            } else {
                document.getElementById("pcoupon").style.display = "none";
            }
        }
   })
}