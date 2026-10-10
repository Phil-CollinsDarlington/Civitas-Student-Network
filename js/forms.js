/* =============================================================
   CSN — FORMS.JS

   Every form on the site uses this same script:
   - Student Membership
   - Volunteer
   - Campus Representative
   - Partner With CSN
   - Contact

   NETLIFY FORMS
   -------------------------------------------------------------
   These forms are processed by Netlify Forms.

   This script handles:
   1. Client-side validation
   2. Accessible error messages
   3. Honeypot spam protection
   4. AJAX submission to Netlify
   5. Redirecting the visitor to the CSN thank-you page
      after a successful submission

   IMPORTANT:
   The HTML forms already contain:

       action="thank-you.html"

   Because the forms and thank-you.html are all inside
   the /pages/ folder, this path is correct.

   Example:

       pages/
       ├── join.html
       ├── partners.html
       ├── contact.html
       └── thank-you.html

============================================================= */


function initForms() {

  /* =========================================================
     FIND ALL CSN FORMS
     
     Every CSN form should have:
     
         data-usn-form
     
     Example:
     
         <form
             name="join-usn-student"
             data-usn-form
             data-netlify="true"
         >
  ========================================================= */

  const forms = document.querySelectorAll("form[data-usn-form]");


  forms.forEach((form) => {

    /* Find the success message inside this form.
       It is no longer our main success mechanism because
       successful submissions will redirect to thank-you.html.
       
       We keep this variable because it is useful as a fallback.
    */
    const successBox = form.querySelector(".form-success");


    /* =========================================================
       FORM SUBMISSION
    ========================================================= */

    form.addEventListener("submit", async (event) => {

      /* -------------------------------------------------------
         STEP 1 — VALIDATE THE FORM
      ------------------------------------------------------- */

      const isValid = validateForm(form);


      /* -------------------------------------------------------
         STEP 2 — CHECK THE HONEYPOT
         
         The honeypot is a hidden field used to catch simple
         bots.

         If a bot fills it in, we pretend the submission worked.
         We do NOT reveal that the bot was detected.
      ------------------------------------------------------- */

      const honeypot = form.querySelector('input[name="bot-field"]');

      const isBot =
        honeypot &&
        honeypot.value.trim() !== "";


      /* -------------------------------------------------------
         STOP INVALID SUBMISSIONS
      ------------------------------------------------------- */

      if (!isValid) {

        event.preventDefault();

        const firstInvalid = form.querySelector(
          '[data-invalid="true"] input, ' +
          '[data-invalid="true"] textarea, ' +
          '[data-invalid="true"] select'
        );

        if (firstInvalid) {
          firstInvalid.focus();
        }

        return;
      }


      /* -------------------------------------------------------
         IF FETCH IS NOT AVAILABLE
         
         Let the browser submit the form normally.

         This is important because the website should still
         work without JavaScript.
      ------------------------------------------------------- */

      if (!window.fetch) {
        return;
      }


      /* -------------------------------------------------------
         PREVENT THE NORMAL SUBMISSION
         
         We will submit the form ourselves using fetch().
      ------------------------------------------------------- */

      event.preventDefault();


      /* -------------------------------------------------------
         HONEYPOT BOT
         
         If this is a bot, don't actually send the data.
         Just pretend everything worked.
      ------------------------------------------------------- */

      if (isBot) {

        showSuccess(form, successBox);

        form.reset();

        return;
      }


      /* -------------------------------------------------------
         PREPARE FORM DATA
      ------------------------------------------------------- */

      const formData = new FormData(form);


      /* Find the submit button so we can temporarily change
         its text while the submission is happening.
      */

      const submitBtn = form.querySelector(
        'button[type="submit"]'
      );


      if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.dataset.originalText =
          submitBtn.textContent;

        submitBtn.textContent = "Sending…";
      }


      /* =======================================================
         SEND THE FORM TO NETLIFY
      ======================================================= */

      try {

        await fetch("/", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          },

          body:
            new URLSearchParams(formData).toString()
        });


        /* =====================================================
           SUCCESS!

           Netlify has received the submission.

           Instead of simply showing the small success message,
           send the visitor to the CSN thank-you page.

           Because the forms are inside /pages/ and
           thank-you.html is also inside /pages/, this works:

               pages/join.html
                         ↓
               pages/thank-you.html

        ===================================================== */

        window.location.href =
          form.getAttribute("action") || "thank-you.html";


      } catch (err) {

        /* =====================================================
           NETWORK ERROR

           If fetch fails, fall back to the normal HTML form
           submission.

           The browser will use:

               action="thank-you.html"

           which means the visitor still reaches the
           thank-you page if Netlify accepts the submission.
        ===================================================== */

        form.submit();

        return;


      } finally {

        /* -----------------------------------------------------
           RESTORE THE SUBMIT BUTTON
        ----------------------------------------------------- */

        if (submitBtn) {

          submitBtn.disabled = false;

          submitBtn.textContent =
            submitBtn.dataset.originalText || "Submit";
        }
      }

    });


    /* =========================================================
       LIVE FIELD VALIDATION

       When a visitor leaves a field, validate it immediately.
    ========================================================= */

    form
      .querySelectorAll("input, select, textarea")
      .forEach((input) => {

        input.addEventListener("blur", () => {
          validateField(input);
        });

      });

  });
}



/* =============================================================
   SHOW SUCCESS MESSAGE
   -------------------------------------------------------------
   This is mainly kept as a fallback.

   Normal successful submissions now redirect to:
       thank-you.html
============================================================= */

function showSuccess(form, successBox) {

  if (!successBox) {
    return;
  }

  successBox.classList.add("is-visible");

  successBox.setAttribute(
    "role",
    "status"
  );

  successBox.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}



/* =============================================================
   VALIDATE THE ENTIRE FORM
============================================================= */

function validateForm(form) {

  let formIsValid = true;


  const fields = form.querySelectorAll(
    "input[required], " +
    "select[required], " +
    "textarea[required], " +
    "input[type='email']"
  );


  fields.forEach((field) => {

    if (!validateField(field)) {
      formIsValid = false;
    }

  });


  return formIsValid;
}



/* =============================================================
   VALIDATE ONE FIELD
============================================================= */

function validateField(field) {

  const wrapper = field.closest(".field");


  /* If this isn't inside a .field wrapper,
     don't interfere with it.
  */

  if (!wrapper) {
    return true;
  }


  let valid = true;

  let message = "This field is required.";


  /* ---------------------------------------------------------
     REQUIRED FIELD
  --------------------------------------------------------- */

  if (
    field.hasAttribute("required") &&
    !field.value.trim()
  ) {

    valid = false;

  }


  /* ---------------------------------------------------------
     EMAIL FIELD
  --------------------------------------------------------- */

  else if (
    field.type === "email" &&
    field.value.trim()
  ) {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(
        field.value.trim()
      )
    ) {

      valid = false;

      message =
        "Enter a valid email address.";
    }
  }


  /* ---------------------------------------------------------
     REQUIRED CHECKBOX
  --------------------------------------------------------- */

  else if (
    field.type === "checkbox" &&
    field.hasAttribute("required") &&
    !field.checked
  ) {

    valid = false;

  }


  /* ---------------------------------------------------------
     ACCESSIBILITY
  --------------------------------------------------------- */

  wrapper.setAttribute(
    "data-invalid",
    (!valid).toString()
  );


  field.setAttribute(
    "aria-invalid",
    (!valid).toString()
  );


  const errorEl =
    wrapper.querySelector(".field-error");


  if (errorEl) {

    errorEl.textContent = message;


    if (!errorEl.id) {

      errorEl.id =
        `${field.name || field.id}-error`;
    }


    field.setAttribute(
      "aria-describedby",
      errorEl.id
    );
  }


  return valid;
}



/* =============================================================
   START THE FORM SYSTEM
============================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initForms
);