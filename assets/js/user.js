let user = {};

$(document).ready(async function () {
  user = await getUserInfor();

  if (!user || user?.role === 1) {
    window.location = "/index.html";
  }
  loadSelectStation();
  loadBalanceUser();

  $("#btn-pay-ticket").click(async function (e) {
    e.preventDefault();
    const selectedTicketType = $('input[name="tick"]:checked').attr("value");
    const fee = selectedTicketType == "true" ? 10000 : 150000;
    const startStationId = $("#projectSelect").val();

    if (!selectedTicketType) {
      alert("Vui lòng chọn loại vé");
      return;
    }

    const [error, response] = await newITExecAPI({
      method: "POST",
      url: "api/rentals",
      data: {
        fee,
        startStationId,
      },
    });

    if (error) {
      alert(
        error?.responseJSON?.message ||
          "Đã xảy ra ngoại lệ vui lòng thử lại sau."
      );
      return;
    }

    const balance = formatMoneyVn(response?.data?.remainingBalance || 0) + " đ";
    $("#mainBalance").text(balance);
    alert("Mua vé thành công.");
  });
});

async function loadSelectStation() {
  const [error, response] = await newITExecAPI({
    url: "api/station",
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

  const $select = $("#projectSelect");
  $select.empty();

  response?.data.forEach((item, index) => {
    const $option = $("<option>", {
      value: item.id,
      text: item.name,
    });

    if (index === 0) {
      $option.prop("selected", true);
    }

    $select.append($option);
  });
}

function loadBalanceUser() {
  const balance = formatMoneyVn(user.balance || 0) + " đ";
  $("#mainBalance").text(balance);
}
