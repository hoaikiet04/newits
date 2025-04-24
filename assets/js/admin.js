// admin.js
$(document).ready(function () {
  // Initialize DataTables
  $("#customersTable").DataTable();
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
