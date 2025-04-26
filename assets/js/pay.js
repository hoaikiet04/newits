$(document).ready(async function () {
  const user = await getUserInfor();

  if (!user || user?.role === 1) {
    window.location = "/index.html";
  }
  loadBalanceUser(user?.balance);
  loadHistoryPay();
  loadHistoryRental();

  // Handle form submission
  $("#topUpForm").on("submit", async function (e) {
    e.preventDefault();

    const amount = $("#amountInput").val();
    const paymentMethod = $('input[name="paymentMethod"]:checked').attr("id");

    if (!amount || amount < 10000) {
      alert("Vui lòng nhập số tiền tối thiểu 10.000đ");
      return;
    }

    const [error, response] = await newITExecAPI({
      method: "POST",
      url: "api/pay",
      data: {
        balance: amount,
      },
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
        error?.responseJSON?.message ||
          "Đã xảy ra ngoại lệ vui lòng thử lại sau."
      );
      return;
    }

    loadBalanceUser(response?.data?.newBalance);
    await loadHistoryPay();

    // 👉 Thay alert cũ bằng Swal.fire
    Swal.fire({
      title: "Nạp tiền thành công!",
      text: "Bạn có muốn tiếp tục thuê xe không?",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Tiếp tục thuê",
      cancelButtonText: "Ở lại trang nạp tiền",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "user.html";
      }
    });
  });
});

async function loadHistoryPay() {
  let html = "";

  const [error, response] = await newITExecAPI({
    url: "api/pay/history",
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

  const { data } = response;

  if (data?.length > 0) {
    $("#history").empty();

    data?.forEach((item) => {
      html += `
            <div style="display: flex; align-items: flex-start;">
            <div style="width: 33.33%;">
                <span class="text-primary">${item?.topupTime}</span>
            </div>
            <div style="width: 33.33%;">
                <span style="color: #333; font-weight: 600;">Đã nạp ${formatMoneyVn(
                  item?.amount
                )} đ</span>
            </div>
            <div style="width: 33.33%;">
                <img
                style="width: 100px; height: auto"
                src="https://cdn.brandfetch.io/id_T-oXJkN/w/820/h/184/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1743944081316"
                alt="..."
                />
            </div>
            </div>
            <hr>
        `;
    });

    $("#history").append(html);
  }
}

async function loadHistoryRental() {
  let html = "";

  const [error, response] = await newITExecAPI({
    url: "api/rentals",
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

  const { data } = response;

  if (data?.length > 0) {
    $("#history-bike").empty();

    data?.forEach((item) => {
      html += `
                <div style="display: flex; align-items: flex-start; width: 100%;">
                <div style="width: 33.33%; box-sizing: border-box; padding-right: 8px;">
                    <span class="text-primary">${item?.startTime}</span>
                </div>
                <div style="width: 33.33%; box-sizing: border-box; padding-right: 8px;">
                    <span style="color: #333; font-weight: 600;">
                    Đã thanh toán ${formatMoneyVn(item?.fee)} đ
                    </span>
                </div>
                <div style="width: 33.33%; box-sizing: border-box;">
                    <span class="text-primary">Trạm: ${item?.stationName}</span>
                </div>
                </div>
                <hr />
          `;
    });

    $("#history-bike").append(html);
  }
}

function loadBalanceUser(money) {
  const balance = formatMoneyVn(money || 0) + " đ";
  $("#main-account").text(balance);
}
