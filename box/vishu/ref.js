<div class="form-outline mb-3">
                            <input type="password" id="confirmPassword" class="form-control form-control-lg"
                                placeholder="Repeat password" name="confirmPassword" onkeyup="validateConfirmPassword()"/>
                            {{!-- <label class="form-label" for="form3Example4">Password</label> --}}
                            <p id="confirmPassworderr" class="text-danger"></p>
                        </div>


                        <div class="text-center text-lg-start mt-4 pt-2">
                            <button type="submit" class="btn  btn-md" onclick="return validation()"
                                style="padding-left: 2.5rem; padding-right: 2.5rem; background-color: #2f49d1; color: white;">Signup</button>
                          
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </section>




<script>
    var errorName = document.getElementById('nameerr')
    var errorEmail = document.getElementById('emailerr')
    var errorPassword = document.getElementById('passworderr')
    var errorCPassword = document.getElementById('confirmPassworderr')
    var errormobileNumber = document.getElementById('numbererr')
   
    function validateName() {
        const name = document.getElementById('name').value
        
        if (name == "") {
            errorName.innerHTML = 'Enter your Name'
            return false
        }
        if (!name.match(/^[a-zA-Z]*$/)) {
            errorName.innerHTML = 'Alphabets are only allowed'
            return false
        }
        errorName.innerHTML = null
        return true

    }
    function validateEmail() {
        const name = document.getElementById('email').value
        if (name == "") {
            errorEmail.innerHTML = "Enter you email address"
            return false


        }
        if (!name.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)) {
            errorEmail.innerHTML = 'Enter a proper email adress'
            return false
        }

        errorEmail.innerHTML = null
        return true
    }

    function validatePassword() {
        const name = document.getElementById('password').value
        if (name == "") {
            errorPassword.innerHTML = "Enter a password"
            return false
        }
        if (name.length < 2) {
            errorPassword.innerHTML = "Password should be  three characters"
            return false
        }
        errorPassword.innerHTML = null
        return true
    }
    function validateConfirmPassword() {
        const name = document.getElementById('confirmPassword').value
        const cpassword = document.getElementById('password').value

        if (name == "") {
            errorCPassword.innerHTML = "Enter password"
            return false
        }
        if(name!==cpassword){
              errorCPassword.innerHTML = "Password does not match"
              return false
        }
        
        errorCPassword.innerHTML = null
        return true
    }
      function validateMobile(){
      const name = document.getElementById('mobileNumber').value
      if(name =="" || name == null){
        errormobileNumber.innerHTML = "Enter a mobile number"
        return false
      }
      if(name.length <10 || name.length >10){
        errormobileNumber.innerHTML = "Enter a Valid Mobile number"
        return false
      } 
      
      errormobileNumber.innerHTML = null
      return true
    }


    function validation() {
        if (!validateName() || !validateEmail() || !validatePassword() || !validateConfirmPassword() || !validateMobile ()) {
            return false
        }
        return true
    }
</script>