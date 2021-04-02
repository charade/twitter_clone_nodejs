const edit_icons = Array.from(document.querySelectorAll(".edit-icon"));
const validate_buttons = Array.from(document.querySelectorAll('input.validate-tweet-edition-button'));

edit_icons.forEach(icon => icon.addEventListener('click',(e)=>{

    validate_buttons[edit_icons.indexOf(e.target)].classList.add('edit-active');

}))