let thetoken
document.addEventListener('DOMContentLoaded', () => {
  //  let baseurl = 'http://localhost:5000/node';
 let baseurl = 'https://GXTdev.online/node';
    /* -------------------------------------------------- DOM refs */
    const subtitle  = document.getElementById('subtitle');
    const methodStep = document.getElementById('methodStep');
    const emailStep  = document.getElementById('emailStep');
    const phoneStep  = document.getElementById('phoneStep');
    const verifyStep = document.getElementById('verifyStep');
    const pwdStep    = document.getElementById('pwdStep');
  
    const linkBtn      = document.getElementById('linkBtn');
    const otpBtn       = document.getElementById('otpBtn');
    const sendLinkBtn  = document.getElementById('sendLinkBtn');
    const sendOtpBtn   = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resetPwdBtn  = document.getElementById('resetPwdBtn');
    const backEmailBtn = document.getElementById('backToMethodFromEmail');
    const backPhoneBtn = document.getElementById('backToMethodFromPhone');
    const backVerifyBtn= document.getElementById('backToPhoneFromVerify');
    const backPwdBtn   = document.getElementById('backToVerifyFromPwd');
  
    /* -------------------------------------------------- helpers */
    function show(el){ el.classList.remove('hidden'); }
    function hide(el){ el.classList.add('hidden'); }
    function only(step){
      [methodStep,emailStep,phoneStep,verifyStep,pwdStep].forEach(s=>hide(s));
      show(step);
    }
    function setSubtitle(text){ subtitle.textContent = text; }
  
    function toggleBusy(btn, busy) {
      if (!btn) {
        console.error('Button element not found');
        return;
      }
      const loader = btn.querySelector('.btnloader');
      btn.disabled = busy;
      if (loader) {
        loader.classList.toggle('hidden', !busy);
      } else {
        console.error('Loader element not found within button');
      }
    }
async function postJSON(endpoint, payload, btn) {
  toggleBusy(btn, true);
  try {
    const url = `${baseurl}${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      body: payload
    });
    const data = await res.json().catch(() => ({ status: false, message: 'Bad response' }));
    if (!data.status) Swal.fire('Error', data.message || 'Request failed', 'error');
    return data;
  } catch (err) {
    console.error(err);
    Swal.fire('Network error', 'Please try again', 'error');
    return false;
  } finally {
    toggleBusy(btn, false);
  }
}
  
    /* -------------------------------------------------- step 0 */
    linkBtn.addEventListener('click', () => {
      only(emailStep);
      setSubtitle('Enter the e‑mail address for your account.');
      document.getElementById('emailInput').focus();
    });
    otpBtn.addEventListener('click', () => {
      only(phoneStep);
      setSubtitle('Enter the phone number linked to your account.');
      document.getElementById('phoneInput').focus();
    });
  
    /* -------------------------------------------------- Back buttons */
    backEmailBtn.addEventListener('click', () => {
      only(methodStep);
      setSubtitle('Pick how you’d like to reset your password.');
    });
    backPhoneBtn.addEventListener('click', () => {
      only(methodStep);
      setSubtitle('Pick how you’d like to reset your password.');
    });
    backVerifyBtn.addEventListener('click', () => {
      only(phoneStep);
      setSubtitle('Enter the phone number linked to your account.');
      document.getElementById('otpInput').value = '';
    });
    backPwdBtn.addEventListener('click', () => {
      only(verifyStep);
      setSubtitle('Enter the 6‑digit OTP we sent to your phone.');
      document.getElementById('pwd1Input').value = '';
      document.getElementById('pwd2Input').value = '';
    });
  
    /* -------------------------------------------------- step 1a: email */
    sendLinkBtn.addEventListener('click', async () => {
      const email = document.getElementById('emailInput').value.trim();
      const re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) return Swal.fire('Oops', 'Enter a valid e‑mail', 'error');
  
      const formData = new FormData();
      formData.append('email', email);
      const ok = await postJSON('/api/v1/auth/forgotpassword', formData, sendLinkBtn);
      if (ok) Swal.fire('Sent', 'Check your e‑mail for the link', 'success')
              .then(() => location = './login.html');
    });
    /* -------------------------------------------------- step 1b: send OTP */
    sendOtpBtn.addEventListener('click', async () => {
      const phone = document.getElementById('phoneInput').value.trim();
      const re    = /^\+?\d{10,15}$/;
      if (!re.test(phone)) return Swal.fire('Oops', 'Enter valid phone', 'error');
  
      const formData = new FormData();
      formData.append('phone', phone);
      const ok = await postJSON('/api/v1/auth/forgotpassword', formData, sendOtpBtn);
      console.log(ok)
      if (ok.status) {
        thetoken = ok.data.passwordResetToken;
      const otpOption = await nowGetAndVerifyOTP(ok.data.passwordResetToken);
      console.log('otpOption', otpOption)
      if (!otpOption) return; // Exit if no OTP option is selected
          only(pwdStep);
        //   only(verifyStep);
        setSubtitle('Enter the 6‑digit OTP we sent to your phone.');
        document.getElementById('otpInput').focus();
      }
    });
  
    /* -------------------------------------------------- step 2: verify OTP */
    // verifyOtpBtn.addEventListener('click', async () => {
    //   const otp   = document.getElementById('otpInput').value.trim();
    //   const phone = document.getElementById('phoneInput').value.trim();
  
    //   if (otp.length !== 6) return Swal.fire('Oops','Enter 6‑digit OTP','error');
  
    //   const ok = await postJSON('/api/v1/auth/verifyotp', { phone, otp }, verifyOtpBtn);
    //   if (ok) {
    //     only(pwdStep);
    //     setSubtitle('Create a new password for your account.');
    //     document.getElementById('pwd1Input').focus();
    //   }
    // });
  
    /* -------------------------------------------------- step 3: reset password */
    resetPwdBtn.addEventListener('click', async () => {
      const p1 = document.getElementById('pwd1Input').value;
      const p2 = document.getElementById('pwd2Input').value;
      const phone = document.getElementById('phoneInput').value.trim();
  
      if (!p1 || !p2)      return Swal.fire('Oops','Fill both fields','error');
      if (p1 !== p2)       return Swal.fire('Oops','Passwords don’t match','error');
      if (p1.length < 6)   return Swal.fire('Oops','Minimum 6 characters','error');
  
      const formData = new FormData();
      formData.append('passwordtoken', thetoken);
      formData.append('newpassword', p1);

      const ok = await postJSON('/api/v1/auth/resetpassword', formData, resetPwdBtn);
      if (ok.status) Swal.fire('Done','Password reset – log in now','success')
              .then(() => location = './login.html');
    });

async function nowGetAndVerifyOTP(token) {
    console.log('Step 1: Initialize delivery methods');
    const methods = [
        { value: 'email', image: 'images/email.png', label: 'Email', color: 'bg-white border border-indigo-100 text-indigo-700' },
        { value: 'phone', image: 'images/phone.png', label: 'Phone', color: 'bg-white border border-teal-100 text-teal-700' },
        { value: 'both', image: 'images/both.png', label: 'Both', color: 'bg-white border border-orange-100 text-amber-700' },
    ];

    console.log('Step 2: Generate HTML for delivery method cards');
    const cardsHtml = methods.map(m => `
        <div class="delivery-card group" data-value="${m.value}">
            <div class="card-inner ${m.color}">
                <img src="${m.image}" alt="${m.label}" class="w-12 h-12 mb-3 rounded-md shadow-sm">
                <span class="font-semibold text-sm">${m.label}</span>
            </div>
            <div class="selection-indicator">
                <svg class="flat-icon w-4 h-4 text-white">
                    <use href="#check"></use>
                </svg>
            </div>
        </div>
    `).join('');

    console.log('Step 3: Display Swal modal for delivery method selection');
    const { value: otpOption } = await Swal.fire({
        title: '<span class="text-slate-800 font-bold">Choose Delivery Method</span>',
        html: `
            <div class="text-center text-slate-600 mb-6 text-sm">
                How would you like to receive your verification code?
            </div>
            <div class="delivery-grid">${cardsHtml}</div>
            <style>
                .delivery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    margin: 1.5rem 0;
                }
                .delivery-card {
                    position: relative;
                    cursor: pointer;
                    height: 120px;
                }
                .card-inner {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 16px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 0.5rem;
                    transition: all 0.3s ease;
                }
                .delivery-card:hover .card-inner {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }
                .selection-indicator {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 26px;
                    height: 26px;
                    background: #4f46e5;
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 6px rgba(79,70,229,0.4);
                }
                .delivery-card.selected .selection-indicator {
                    opacity: 1;
                    transform: scale(1);
                }
                .delivery-card.selected .card-inner {
                    transform: translateY(-6px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    border-width: 2px;
                }
                .flat-icon {
                    fill: currentColor;
                    transition: all 0.2s ease;
                }
            </style>
        `,
        showCancelButton: true,
        confirmButtonText: 'Send Code',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        reverseButtons: true,
        allowOutsideClick: false,
        customClass: {
            popup: 'rounded-2xl border border-white/10 shadow-xl',
            title: 'text-xl mb-1',
            confirmButton: 'bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-300',
            cancelButton: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 px-6 py-2.5 rounded-xl font-medium'
        },
        didOpen: () => {
            console.log('Step 4: Modal opened, setting up event listeners for cards');
            const cards = Swal.getHtmlContainer().querySelectorAll('.delivery-card');
            Swal.getConfirmButton().disabled = true;

            cards.forEach(card => {
                card.addEventListener('click', () => {
                    cards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    Swal.getConfirmButton().disabled = false;
                    Swal.getPopup().dataset.selected = card.dataset.value;
                });
            });
        },
        preConfirm: () => {
            console.log('Step 5: Pre-confirmation check for selected delivery method');
            const sel = Swal.getPopup().dataset.selected;
            if (!sel) {
                Swal.showValidationMessage('Please select a delivery method');
                return false;
            }
            return sel;
        }
    });

    if (!otpOption) {
        console.log('Step 6: No delivery method selected, exiting');
        return false;
    }

    console.log('Step 7: Sending OTP via selected method');
    const url = new URL(baseurl+`/api/v1/auth/sendotpoffline`);
    url.searchParams.append('method', otpOption);
    url.searchParams.append('token', token);
    const response = await fetch(url, { method: 'GET' });
    const { status } = await response.json();
    if (!status) {
        console.log('Step 8: Failed to send OTP');
        return false;
    }

    console.log('Step 9: Displaying OTP input modal');
    const { value: otpResult } = await Swal.fire({
        title: '<div class="flex flex-col items-center"><svg class="flat-icon w-12 h-12 text-indigo-600 mb-2"><use href="#lock"></use></svg><span class="text-slate-800 font-bold">Enter Verification Code</span></div>',
        html: `
            <div class="text-center text-slate-600 mb-6">
                We sent a 6-digit code to your ${otpOption === 'email' ? 'email' : otpOption === 'phone' ? 'phone' : 'email and phone'}.
            </div>
            <div class="otp-container">
                ${Array.from({ length: 6 }, (_, i) => `
                    <input type="tel" 
                            inputmode="numeric" 
                            pattern="[0-9]*" 
                            maxlength="1" 
                            class="otp-digit" 
                            autocomplete="one-time-code"
                            data-index="${i}"
                            ${i === 0 ? 'autofocus' : ''}>
                `).join('')}
            </div>
            <div class="text-center mt-6">
                <button type="button" class="resend-button text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center">
                    <svg class="flat-icon w-4 h-4 mr-1"><use href="#reload"></use></svg>
                    Resend Code
                </button>
            </div>
            <style>
                .otp-container {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin: 0 auto;
                    max-width: 300px;
                }
                .otp-digit {
                    width: 40px;
                    height: 50px;
                    text-align: center;
                    font-size: 20px;
                    font-weight: 600;
                    color: #4f46e5;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    transition: all 0.2s ease;
                    caret-color: transparent;
                }
                .otp-digit:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
                    outline: none;
                }
                .otp-digit.filled {
                    background-color: #f5f3ff;
                    border-color: #c7d2fe;
                }
                .resend-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: color 0.2s;
                    display: inline-flex;
                    align-items: center;
                }
                .resend-button:hover svg {
                    transform: rotate(90deg);
                }
            </style>
        `,
        showCancelButton: true,
        confirmButtonText: 'Verify',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        focusConfirm: false,
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'bg-indigo-600 hover:bg-indigo-700 px-8 py-2.5 rounded-xl font-semibold text-white shadow-lg',
            cancelButton: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 px-8 py-2.5 rounded-xl font-medium'
        },
        didOpen: () => {
            console.log('Step 10: OTP input modal opened, setting up event listeners');
            const digits = Swal.getHtmlContainer().querySelectorAll('.otp-digit');
            const resendBtn = Swal.getHtmlContainer().querySelector('.resend-button');

            digits.forEach(digit => {
                digit.addEventListener('input', () => {
                    if (digit.value.length === 1) {
                        digit.classList.add('filled');
                        const nextIndex = parseInt(digit.dataset.index) + 1;
                        if (nextIndex < 6) digits[nextIndex].focus();
                    } else {
                        digit.classList.remove('filled');
                    }
                });

                digit.addEventListener('keydown', e => {
                    if (e.key === 'Backspace' && digit.value === '') {
                        const prevIndex = parseInt(digit.dataset.index) - 1;
                        if (prevIndex >= 0) digits[prevIndex].focus();
                    }
                });
            });

            resendBtn.addEventListener('click', async () => {
                console.log('Step 11: Resend button clicked');
                Swal.getConfirmButton().disabled = true;
                Swal.showLoading();
                const resendFormData = new FormData();
                resendFormData.append('method', otpOption);
                resendFormData.append('token', token);
                await postJSON(baseurl+`/api/v1/auth/sendotpoffline`, resendFormData, resendBtn);
                Swal.hideLoading();
                Swal.getConfirmButton().disabled = false;
                Swal.showValidationMessage('New code sent successfully');
                setTimeout(() => Swal.resetValidationMessage(), 2000);
                digits[0].focus();
            });
        },
        preConfirm: async () => {
            console.log('Step 12: Pre-confirmation check for OTP input');
            const digits = Swal.getHtmlContainer().querySelectorAll('.otp-digit');
            const otp = Array.from(digits).map(d => d.value).join('');

            if (otp.length !== 6) {
                Swal.showValidationMessage('Please enter all 6 digits');
                return false;
            }

            try {
                console.log('Step 13: Verifying OTP');
                const params = new FormData();
                params.append('otp', otp);
                params.append('token', token);
                const { status } = await postJSON(`/api/v1/auth/verifyotpoffline`, params, null);
                if (!status) throw new Error('Invalid OTP');
                return true;
            } catch (error) {
                console.log('Step 14: OTP verification failed', error);
                Swal.showValidationMessage(error.message || 'Invalid code. Please try again.');
                digits.forEach(d => {
                    d.value = '';
                    d.classList.remove('filled');
                });
                digits[0].focus();
                return false;
            }
        }
    });

    console.log('Step 15: OTP verification result', otpResult);
    return otpResult === true;
}
  });
 
