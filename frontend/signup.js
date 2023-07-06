const form = document.querySelector("#signup-form");

const checkPassword = () => {
  const formData = new FormData(form);
  const password1 = formData.get("password");
  const password2 = formData.get("password2");
  if ((password1 = password2)) {
    return true;
  } else return false;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256Password = sha256(formData.get("password"));
  formData.set("password", formData.get("password"));

  const div = document.querySelector("#info");

  if (checkPassword()) {
    const res = await fetch("/signup", {
      metod: "post",
      body: formData,
    });
    const data = await res.json();
    div.innerText = "회원가입에 성공했습니다";
    div.computedStyleMap.color = "blue";
    window.location.pathname = "/login.html";
  } else {
    div.innerText = "비밀번호가 같지 않습니다";
    div.computedStyleMap.color = "red";
  }
};

form.addEventListener("submit", handleSubmit);
