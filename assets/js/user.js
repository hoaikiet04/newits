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

    if (!selectedTicketType) {
      alert("Vui lòng chọn loại vé");
      return;
    }

    const fee = selectedTicketType == "true" ? 10000 : 150000;
    const startStationId = $("#projectSelect").val();

    let mainBalance = $("#mainBalance").text().replace(/[^\d]/g, "");
    mainBalance = parseInt(mainBalance);

    if (mainBalance < fee) {
      if (confirm("Số dư không đủ để thanh toán. Bạn có muốn nạp tiền?")) {
        window.location.href = "pay.html";
      }
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

    // 👉 Sử dụng SweetAlert
    Swal.fire({
      title: "Mua vé thành công!",
      text: "Bạn sẽ được chuyển đến trang thanh toán.",
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "pay.html";
      }
    });
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
