const form = document.getElementById("write-form");

const handleSubmitForm = async (event) => {
  event.preventDefault();
  const body = new FormData(form);
  body.append("insertAt", new Date().getTime());
  console.log(`insertAt append`);
  try {
    const res = await fetch("/items", {
      method: "POST",
      body,
    });
    const result = await res.json();
    if (result === "200") window.location.pathname = "/";
  } catch (e) {
    console.error("이미지 업로드 실패했어요: " + e);
    console.log(e);
  }
};

form.addEventListener("submit", handleSubmitForm);
