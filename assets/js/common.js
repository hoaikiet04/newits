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

function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function formatMoneyVn(number) {
  if (!number) return 0;

  return number.toLocaleString("vi-VN");
}

async function getUserInfor() {
  const [error, response] = await newITExecAPI({
    url: "api/auth/profile",
  });

  if (error) {
    const { status } = error;

    if (status === 403) {
      alert("Bạn không có quyền thực hiện chức năng này.");
      removeCookie("token");
      window.location = "/index.html";
      return;
    }

    if (status === 401) {
      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
      window.location = "/index.html";
      return;
    }

    alert(
      error?.responseJSON?.message || "Đã xảy ra ngoại lệ vui lòng thử lại sau."
    );
    return;
  }

  return response?.data;
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
