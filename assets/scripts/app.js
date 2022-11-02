const templateElement = document.querySelector("template");
const listElement = document.querySelector(".posts");
const form = document.querySelector("#new-post form");
const fetchBtn = document.querySelector("#available-posts button");
const postList = document.querySelector("ul");

function sendHttpRequest(method, url, data) {
  /*const requests = new XMLHttpRequest();

    requests.open(method, url);

    requests.responseType = "json";

    requests.onload = function () {
      if (requests.status >= 200 && requests.status < 300) {
        resolve(requests.response);
      } else {
        reject(new Error("Something went wrong!"));
      }
    };

    requests.onerror = function () {
      reject(new Error("Failed to send request!"));
    };

    requests.send(JSON.stringify(data));*/
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then((errData) => {
          console.log(errData);
          throw new Error("Something went wrong - server side!");
        });
      }
    })
    .catch((error) => {
      console.log(error);
      throw new Error("Something went wrong!");
    });
}

async function fetchPosts() {
  try {
    const responseData = await sendHttpRequest(
      "GET",
      "https://jsonplaceholder.typicode.com/posts"
    );
    const listOfPosts = responseData;

    for (const post of listOfPosts) {
      const postEl = document.importNode(templateElement.content, true);
      postEl.querySelector("h2").textContent = post.title;
      postEl.querySelector("p").textContent = post.body;
      postEl.querySelector("li").id = post.id;
      listElement.append(postEl);
    }
  } catch (error) {
    alert(error.message);
  }
}

async function createPosts(title, content) {
  const userId = Math.random();
  const post = {
    id: userId,
    title: title,
    body: content,
  };

  sendHttpRequest("POST", "https://jsonplaceholder.typicode.com/posts", post);
}

fetchBtn.addEventListener("click", fetchPosts);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredTitle = event.currentTarget.querySelector("#title").value;
  const enteredContent = event.currentTarget.querySelector("#content").value;

  createPosts(enteredTitle, enteredContent);
});

postList.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const postId = event.target.closest("li").id;
    sendHttpRequest(
      "DELETE",
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  }
});
