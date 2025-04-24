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

// admin.js
$(document).ready(function () {
  // Initialize DataTables
  loadTableCustomer();
  $("#rentalsTable").DataTable();
  $("#topupsTable").DataTable();
  $("#packagesTable").DataTable();

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

  // Handle package deletion
  $(".btn-danger").on("click", function () {
    if (confirm("Bạn chắn chắn muốn xóa gói này không?")) {
      // Add deletion logic here
      $(this).closest("tr").remove();
    }
  });

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
