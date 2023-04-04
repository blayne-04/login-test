const signUp = async() => {
    const userName = document.querySelector('#userName').value.trim().toLowerCase()
    const email = document.querySelector('#suEmail').value.trim()
    const password =  document.querySelector('suPassword').value.trim()

    const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {'Content-Type': 'application/json'}
    })
}