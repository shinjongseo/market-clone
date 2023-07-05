const calcTime = (timestamp) => {
  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000;
  const time = new Date(curTime - timestamp);
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  if (hour > 0) return `${hour}시간 전`;
  else if (minute > 0) return `${minute}분 전`;
  else if (second > 0) return `${second}초 전`;
  else return "방금 전";
};

const renderData = (data) => {
  const main = document.querySelector("main");
  data = data.sort((a, b) => b.insertAt - a.insertAt);

  data.forEach(async (item) => {
    const itemList = document.createElement("div");
    itemList.classList.add("item-list");

    const itemListImg = document.createElement("div");
    itemListImg.classList.add("item-list__img");
    const img = document.createElement("img");
    const res = await fetch(`/images/${item.id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    img.src = url;
    itemListImg.appendChild(img);
    itemList.appendChild(itemListImg);

    const itemListInfo = document.createElement("div");
    itemListInfo.classList.add("item-list__info");

    const infoTitle = document.createElement("div");
    infoTitle.classList.add("item-list__info-title");
    infoTitle.innerText = item.title;
    itemListInfo.appendChild(infoTitle);

    const infoMeta = document.createElement("div");
    infoMeta.classList.add("item-list__info-meta");
    infoMeta.innerText = item.place + " " + calcTime(item.insertAt);
    itemListInfo.appendChild(infoMeta);

    const infoPrice = document.createElement("div");
    infoPrice.classList.add("item-list__info-price");
    infoPrice.innerText = item.price;
    itemListInfo.appendChild(infoPrice);

    itemList.appendChild(itemListInfo);
    main.appendChild(itemList);
  });
};

const fetchList = async () => {
  const res = await fetch("/items");
  const data = await res.json();
  renderData(data);
};

fetchList();
