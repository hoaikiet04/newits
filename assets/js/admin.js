let userTable = null;

const customerTable = {
  columns: [
    { data: "id", title: "ID" },
    { data: "fullName", title: "Họ tên" },
    { data: "email", title: "Email" },
    { data: "phoneNumber", title: "Điện thoại" },
    {
      data: "balance",
      title: "Số dư",
      render: function (data, type, row) {
        return formatMoneyVn(data);
      },
    },
  ],
  language: {
    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
    zeroRecords: "Không tìm thấy kết quả",
    info: "Hiển thị _START_ đến _END_ của _TOTAL_ mục",
    infoEmpty: "Không có dữ liệu",
    infoFiltered: "(lọc từ tổng số _MAX_ mục)",
    search: "Tìm kiếm:",
    paginate: {
      first: "Đầu",
      last: "Cuối",
      next: "Sau",
      previous: "Trước",
    },
  },
  pageLength: 10,
  order: [[0, "desc"]],
  lengthMenu: [5, 10, 25, 50, 100],
};

const rentalTable = {
  columns: [
    { data: "fullName", title: "Họ tên" },
    { data: "email", title: "Email" },
    {
      data: "fee",
      title: "Phí dịch vụ",
      render: function (data, type, row) {
        return formatMoneyVn(data) + " đ";
      },
    },
    { data: "startTime", title: "Thời gian" },
    { data: "stationName", title: "Trạm" },
  ],
  language: {
    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
    zeroRecords: "Không tìm thấy kết quả",
    info: "Hiển thị _START_ đến _END_ của _TOTAL_ mục",
    infoEmpty: "Không có dữ liệu",
    infoFiltered: "(lọc từ tổng số _MAX_ mục)",
    search: "Tìm kiếm:",
    paginate: {
      first: "Đầu",
      last: "Cuối",
      next: "Sau",
      previous: "Trước",
    },
  },
  pageLength: 10,
  order: [[0, "desc"]],
  lengthMenu: [5, 10, 25, 50, 100],
};

const payTable = {
  columns: [
    { data: "fullName", title: "Họ tên" },
    { data: "email", title: "Email" },
    {
      data: "amount",
      title: "Số tiền đã nạp",
      render: function (data, type, row) {
        return formatMoneyVn(data) + " đ";
      },
    },
    { data: "topupTime", title: "Thời gian" },
    { data: "method", title: "method" },
  ],
  language: {
    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
    zeroRecords: "Không tìm thấy kết quả",
    info: "Hiển thị _START_ đến _END_ của _TOTAL_ mục",
    infoEmpty: "Không có dữ liệu",
    infoFiltered: "(lọc từ tổng số _MAX_ mục)",
    search: "Tìm kiếm:",
    paginate: {
      first: "Đầu",
      last: "Cuối",
      next: "Sau",
      previous: "Trước",
    },
  },
  pageLength: 10,
  order: [[0, "desc"]],
  lengthMenu: [5, 10, 25, 50, 100],
};

const stationTable = {
  columns: [
    { data: "id", title: "Id" },
    { data: "name", title: "Tên trạm" },
    { data: "location", title: "Vị trí" },
    { data: "capacity", title: "Sức chứa" },
    {
      data: "id",
      title: "Thao tác",
      render: function (data, type, row) {
        return `
                        <button
                          class="btn btn-sm btn-primary btn-action"
                          data-bs-toggle="modal"
                          data-bs-target="#editPackageModal"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
                          <i class="fas fa-trash"></i>
                        </button>
        `;
      },
    },
  ],
  language: {
    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
    zeroRecords: "Không tìm thấy kết quả",
    info: "Hiển thị _START_ đến _END_ của _TOTAL_ mục",
    infoEmpty: "Không có dữ liệu",
    infoFiltered: "(lọc từ tổng số _MAX_ mục)",
    search: "Tìm kiếm:",
    paginate: {
      first: "Đầu",
      last: "Cuối",
      next: "Sau",
      previous: "Trước",
    },
  },
  pageLength: 10,
  order: [[0, "desc"]],
  lengthMenu: [5, 10, 25, 50, 100],
};

// admin.js
$(document).ready(async function () {
  // Initialize DataTables
  loadTableCustomer();
  loadTableRental();
  loadTablePay();
  await loadTableStation();

  // Bắt sự kiện click vào dòng
  $("#packagesTable tbody").on("click", "tr", function () {
    const data = stationDataTable.row(this).data();
    console.log(data);
    userTable = { ...data };
  });

  loadReportCustomer();
  loadReportRental();
  loadReportPay();

  // Handle sidebar navigation
  $(".sidebar .nav-link").on("click", function (e) {
    e.preventDefault();

    // Update active states
    $(".sidebar .nav-link").removeClass("active");
    $(this).addClass("active");

    // Show corresponding section
    const targetSection = $(this).data("section");
    $(".section").removeClass("active");
    $(`#${targetSection}`).addClass("active");
  });

  // // Handle package deletion
  // $(".btn-danger").on("click", function () {
  //   if (confirm("Bạn chắn chắn muốn xóa gói này không?")) {
  //     // Add deletion logic here
  //     $(this).closest("tr").remove();
  //   }
  // });

  // Handle form submissions
  $("#addPackageForm").on("submit", function (e) {
    e.preventDefault();
    // Add form submission logic here
    $("#addPackageModal").modal("hide");
  });

  $("#editPackageForm").on("submit", function (e) {
    e.preventDefault();
    // Add form submission logic here
    $("#editPackageModal").modal("hide");
  });
});

//Load danh sách khách hàng
async function loadTableCustomer() {
  const [error, response] = await newITExecAPI({
    url: "api/admin/customer",
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

  $("#customersTable").DataTable({ ...customerTable, data: response?.data });
}

//Load danh sách khách hàng
async function loadTableRental() {
  const [error, response] = await newITExecAPI({
    url: "api/admin/rentals",
  });

  if (error) {
    return;
  }

  $("#rentalsTable").DataTable({ ...rentalTable, data: response?.data });
}

async function loadReportCustomer() {
  const [error, response] = await newITExecAPI({
    url: "api/admin/total-user",
  });

  if (error) {
    return;
  }

  $("#total-cus").text(formatMoneyVn(response?.data?.total || 0));
}

async function loadTablePay() {
  const [error, response] = await newITExecAPI({
    url: "api/admin/history",
  });

  if (error) {
    return;
  }

  $("#topupsTable").DataTable({ ...payTable, data: response?.data });
}

async function loadReportCustomer() {
  const [error, response] = await newITExecAPI({
    url: "api/admin/total-user",
  });

  if (error) {
    return;
  }

  $("#total-cus").text(formatMoneyVn(response?.data?.total || 0));
}

let stationDataTable; // đúng tên bảng đang dùng

// Load danh sách trạm
async function loadTableStation() {
  const [error, response] = await newITExecAPI({
    url: "api/admin/stations",
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
        "Đã xảy ra ngoại lệ, vui lòng thử lại sau."
    );
    return;
  }

  // Nếu đã init rồi thì destroy trước
  if ($.fn.DataTable.isDataTable("#packagesTable")) {
    $("#packagesTable").DataTable().destroy();
  }

  // Init DataTable và lưu lại instance
  stationDataTable = $("#packagesTable").DataTable({
    ...stationTable, // config columns/language
    data: response?.data,
  });
}

async function loadReportCustomer() {
  const [error, response] = await newITExecAPI({
    url: "api/admin/total-user",
  });

  if (error) {
    return;
  }

  $("#total-cus").text(formatMoneyVn(response?.data?.total || 0));
}

async function loadReportRental() {
  const [error, response] = await newITExecAPI({
    url: "api/admin/total-rental",
  });

  if (error) {
    return;
  }

  $("#total-order").text(formatMoneyVn(response?.data?.total || 0));
}

async function loadReportPay() {
  const [error, response] = await newITExecAPI({
    url: "api/admin/total-customer-pay",
  });

  if (error) {
    return;
  }

  $("#total-pay").text(formatMoneyVn(response?.data?.total || 0) + " đ");
}

$("#editPackageModal").on("shown.bs.modal", function () {
  $("#upStation").val(userTable?.name || "");
  $("#upLocation").val(userTable?.location || "");
  $("#upCapacity").val(userTable?.capacity || "");
});

// Sự kiện khi sửa mới trạm
$("#editPackageModal .btn-primary").on("click", async function () {
  const name = $("#upStation").val().trim();
  const location = $("#upLocation").val().trim();
  const capacity = $("#upCapacity").val().trim();

  if (!name) {
    alert("Vui lòng nhập tên trạm.");
    $("#addStation").focus();
    return;
  }

  if (!location) {
    alert("Vui lòng nhập vị trí trạm.");
    $("#addLocation").focus();
    return;
  }

  if (!capacity || isNaN(capacity) || parseInt(capacity) < 1) {
    alert("Vui lòng nhập sức chứa hợp lệ (tối thiểu là 1).");
    $("#addCapacity").focus();
    return;
  }

  const [error, response] = await newITExecAPI({
    method: "PUT",
    url: `api/station/${userTable?.id}`,
    data: {
      name,
      location,
      capacity: parseInt(capacity),
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
        "Đã xảy ra ngoại lệ, vui lòng thử lại sau."
    );
    return;
  }

  // Sau khi xử lý xong
  $("#editPackageModal").modal("hide"); // Đóng modal
  $("#editPackageForm")[0].reset(); // Reset form
  loadTableStation();
  alert("Cập nhật trạm thành công.");
});

$("#addPackageModal").on("hidden.bs.modal", function () {
  $("#addPackageForm")[0].reset();
});

// Sự kiện khi thêm mới trạm
$("#addPackageModal .btn-primary").on("click", async function () {
  const name = $("#addStation").val().trim();
  const location = $("#addLocation").val().trim();
  const capacity = $("#addCapacity").val().trim();

  if (!name) {
    alert("Vui lòng nhập tên trạm.");
    $("#addStation").focus();
    return;
  }

  if (!location) {
    alert("Vui lòng nhập vị trí trạm.");
    $("#addLocation").focus();
    return;
  }

  if (!capacity || isNaN(capacity) || parseInt(capacity) < 1) {
    alert("Vui lòng nhập sức chứa hợp lệ (tối thiểu là 1).");
    $("#addCapacity").focus();
    return;
  }

  const [error, response] = await newITExecAPI({
    method: "POST",
    url: `api/station`,
    data: {
      name,
      location,
      capacity: parseInt(capacity),
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
        "Đã xảy ra ngoại lệ, vui lòng thử lại sau."
    );
    return;
  }

  // Sau khi xử lý xong
  $("#addPackageModal").modal("hide"); // Đóng modal
  $("#addPackageForm")[0].reset(); // Reset form
  loadTableStation();
  alert("Thêm mới trạm thành công.");
});

$("#confirmDeleteBtn").on("click", async function () {
  // Gọi API xoá (ví dụ)
  const [error, response] = await newITExecAPI({
    url: `api/station/${userTable?.id}`,
    method: "DELETE",
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
        "Đã xảy ra ngoại lệ, vui lòng thử lại sau."
    );
    return;
  }

  $("#deleteConfirmModal").modal("hide");
  alert("Đã xoá thành công!");
  loadTableStation();
});
