/**
* PHP Email Form Validation - v3.0
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  // Select all forms with the '.php-email-form' class
  const forms = document.querySelectorAll('.php-email-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const action = form.getAttribute('action');
      const recaptchaKey = form.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(form, 'The form action property is not set!');
        return;
      }

      // Show loading message, hide error and success messages
      toggleDisplay(form, '.loading', true);
      toggleDisplay(form, '.error-message', false);
      toggleDisplay(form, '.sent-message', false);

      const formData = new FormData(form);

      if (recaptchaKey) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(() => {
            try {
              grecaptcha.execute(recaptchaKey, { action: 'php_email_form_submit' })
                .then((token) => {
                  formData.set('recaptcha-response', token);
                  submitForm(form, action, formData);
                });
            } catch (error) {
              displayError(form, error);
            }
          });
        } else {
          displayError(form, 'The reCAPTCHA JavaScript API URL is not loaded!');
        }
      } else {
        submitForm(form, action, formData);
      }
    });
  });

  // Function to handle form submission via fetch
  async function submitForm(form, action, formData) {
    try {
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      // Process response
      if (response.ok) {
        const data = await response.json();
        
        toggleDisplay(form, '.loading', false);

        if (data.status === 'success') {
          toggleDisplay(form, '.sent-message', true);
          form.reset();
        } else {
          throw new Error(data || `Form submission failed with no error message from: ${action}`);
        }
      } else {
        throw new Error(`${response.status} ${response.statusText} - ${response.url}`);
      }
    } catch (error) {
      displayError(form, error.message || 'An error occurred during form submission.');
    }
  }

  // Function to display error message
  function displayError(form, message) {
    toggleDisplay(form, '.loading', false);
    const errorMessage = form.querySelector('.error-message');
    errorMessage.innerHTML = message;
    errorMessage.classList.add('d-block');
  }

  // Utility function to toggle the display of elements
  function toggleDisplay(form, selector, show) {
    const element = form.querySelector(selector);
    if (element) {
      element.classList.toggle('d-block', show);
    }
  }

})();
