document.getElementById("btn_login").addEventListener("click", function(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if(username === "admin" && password === "admin123"){
        window.location.assign("./homepage.html")
    }
    else{
        alert("Invalid username or password");
        return;
    }
})