const signUp = async (event) => {
    event.preventDefault()
    
  const userName = document.querySelector("#userName").value.trim().toLowerCase();
  const email = document.querySelector("#suEmail").value.trim();
  const password = document.querySelector("#suPassword").value.trim();
  const password2 = document.querySelector("#suPassword2").value.trim();

  switch(false){
    case(password === password2):
        console.log('Passwords Don\'nt match')
        break;
    case validPW(password):
        console.log('Invalid Password must contain A-Z a-z 1 !')
        break;
    case validEM(email):
        console.log('Invalid Email Address')
        break;
    case validUN(userName): 
        console.log('Username must be at least 4 characters long and alphanumeric')
        break;
    default: 
    const response = await fetch("/api/users/signup", {
        method: "POST",
        body: JSON.stringify({ userName, email, password }),
        headers: { "Content-Type": "application/json" },
      });
  }
}
document.querySelector(".signup-form").addEventListener("submit", signUp);

const validUN = (UN) => {
  return /^[a-zA-Z0-9]{4,}$/.test(UN);
};

const validEM = (EM) => {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(EM);
};

const validPW = (PW) => {
  return /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,64})/.test(PW);
};
