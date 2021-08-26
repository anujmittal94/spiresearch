const AUTCOUNT = 3

document.addEventListener('DOMContentLoaded', function() {
    let createBtn = document.querySelector('#createProject')
    createBtn.onclick = function () {
        if(document.querySelector('#createProjectForm').style.display == 'none') {
            document.querySelector('#createProjectForm').style.display = 'inline'
        }
        else {
            document.querySelector('#createProjectForm').style.display = 'none'
        }
    }
})
