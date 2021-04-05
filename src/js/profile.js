const edit_icons = Array.from(document.querySelectorAll(".edit-icon"));
///button qui envoi les données
const validate_buttons = Array.from(document.querySelectorAll('input.validate-tweet-edition-button'));
///les champ de saisie qui permet de modifier un tweet
const inputs_text = Array.from(document.querySelectorAll('input.text-field-edit'));
///correspond aux p qui affiche le tweet dans le block
const tweet_text_content = Array.from(document.querySelectorAll('.display-tweet-content'));
///les formulaires d'envoi des modifications des tweets
const forms = Array.from(document.querySelectorAll('form'));

edit_icons.forEach(icon => icon.addEventListener('click',(e)=>{
    validate_buttons[edit_icons.indexOf(e.target)].classList.add('edit-active');
    inputs_text[edit_icons.indexOf(e.target)].classList.add('text-edit-active');
    inputs_text[edit_icons.indexOf(e.target)].value = tweet_text_content[edit_icons.indexOf(e.target)].textContent;
}))



forms.forEach(form => form.addEventListener('submit', (e)=>{
    tweet_text_content.forEach((form) => form.style.backgroundColor ='red' )

     tweet_text_content[forms.indexOf(e.target)].textContent = inputs_text[forms.indexOf(e.target)].value;
    validate_buttons[forms.indexOf(e.target)].classList.remove('edit-active');
    console.log('coucou');
}))
console.log('no async')