const API_URL = "https://localhost:7035/";

const configAPI = {
  method: "get",
  url: "",
  data: {},
};

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function setCookie(name, value, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

async function newITExecAPI(configs = configAPI) {
  if (!configs || !configs.url) {
    throw new Error('Missing "configs" or "configs.url"!');
  }

  const token = getCookie("token");

  return new Promise((resolve) => {
    $.ajax({
      method: configs.method ? configs.method.toUpperCase() : "GET",
      url: API_URL + configs.url,
      data:
        configs.method?.toUpperCase() === "GET"
          ? configs.data
          : JSON.stringify(configs.data),
      contentType: "application/json",
      dataType: "json",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      success: function (data, textStatus, jqXHR) {
        resolve([null, data]);
      },
      error: function (jqXHR) {
        resolve([jqXHR, null]);
      },
    });
  });
}
