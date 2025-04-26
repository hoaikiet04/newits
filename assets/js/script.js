$(document).ready(function () {
  // Click đăng ký
  $(".register-now").click(function (e) {
    e.preventDefault();

    const user = getUserInfor();

    if (!user) {
      $("#loginModal").modal("show");
    } else {
      window.location = "/user.html";
    }
  });

  // Hero Slider functionality
  const heroSlider = {
    currentSlide: 0,
    slides: $(".hero-slide"),
    dots: $(".dot"),
    totalSlides: $(".hero-slide").length,

    init: function () {
      this.bindEvents();
      this.startAutoSlide();
    },

    bindEvents: function () {
      // Click on slide to change
      $(".hero-slide").on("click", (e) => {
        const clickedSlide = $(e.currentTarget);
        this.currentSlide = parseInt(clickedSlide.data("slide"));
        this.changeSlide();
      });

      // Click on dots to change slide
      $(".dot").on("click", (e) => {
        const clickedDot = $(e.currentTarget);
        this.currentSlide = parseInt(clickedDot.data("slide"));
        this.changeSlide();
      });
    },

    changeSlide: function () {
      // Remove active class from all slides and dots
      this.slides.removeClass("active");
      this.dots.removeClass("active");

      // Add active class to current slide and dot
      $(`.hero-slide[data-slide="${this.currentSlide}"]`).addClass("active");
      $(`.dot[data-slide="${this.currentSlide}"]`).addClass("active");
    },

    nextSlide: function () {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
      this.changeSlide();
    },

    startAutoSlide: function () {
      setInterval(() => {
        this.nextSlide();
      }, 5000); // Change slide every 5 seconds
    },
  };

  // Initialize hero slider
  heroSlider.init();

  // Process Steps functionality
  const processSteps = {
    init: function () {
      this.bindEvents();
    },

    bindEvents: function () {
      // Click on step to change
      $(".process-step").on("click", (e) => {
        const clickedStep = $(e.currentTarget);
        const stepNumber = clickedStep.data("step");
        this.changeStep(stepNumber);
      });
    },

    changeStep: function (stepNumber) {
      // Remove active class from all steps
      $(".process-step").removeClass("active");

      // Add active class to current step and all previous steps
      $(".process-step").each(function () {
        const step = $(this);
        const stepNum = parseInt(step.data("step"));

        if (stepNum <= stepNumber) {
          step.addClass("active");
        }
      });

      // Change image with fade effect
      $(".process-image").removeClass("active");
      $(`.process-image[data-step="${stepNumber}"]`).addClass("active");
    },
  };

  // Initialize process steps
  processSteps.init();

  // Smooth scroll for navigation links
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    var target = $(this.hash);
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 70, // Offset for fixed navbar
        },
        800
      );
    }
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Add animation to hero content
  $(".hero-content").hide().fadeIn(1500);

  // Animate feature cards on scroll
  $(window).scroll(function () {
    $(".feature-card").each(function () {
      var cardTop = $(this).offset().top;
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();

      if (scrollTop + windowHeight > cardTop) {
        $(this).addClass("animate__animated animate__fadeInUp");
      }
    });
  });

  // Animate pricing cards on scroll
  $(window).scroll(function () {
    $(".pricing-card").each(function () {
      var cardTop = $(this).offset().top;
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();

      if (scrollTop + windowHeight > cardTop) {
        $(this).addClass("animate__animated animate__fadeInUp");
      }
    });
  });

  // Mobile menu toggle
  $(".navbar-toggler").on("click", function () {
    $(".navbar-collapse").toggleClass("show");
  });

  // Close mobile menu when clicking outside
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".navbar").length) {
      $(".navbar-collapse").removeClass("show");
    }
  });

  // Add active class to current nav item
  var sections = $("section");
  var navItems = $(".navbar-nav .nav-link");

  $(window).scroll(function () {
    var current = "";

    sections.each(function () {
      var sectionTop = $(this).offset().top;
      var sectionHeight = $(this).height();

      if ($(window).scrollTop() >= sectionTop - 100) {
        current = $(this).attr("id");
      }
    });

    navItems.removeClass("active");
    $(".navbar-nav .nav-link[href='#" + current + "']").addClass("active");
  });

  // Bike Pricing Toggle
  // Show standard bike pricing by default
  $("#standardBikePricing").addClass("active");

  // Handle toggle button changes
  $(".bike-type-toggle").on("change", function () {
    const selectedType = $(this).val();

    // Hide all containers
    $(".bike-pricing-container").removeClass("active");

    // Show the one selected
    if (selectedType === "standard") {
      $("#standardBikePricing").addClass("active");
    } else if (selectedType === "electric") {
      $("#electricBikePricing").addClass("active");
    }
  });

  //--------------------------------------ĐĂNG NHẬP ---------------------------------
  $("#login").click(async function () {
    const email = $("#username").val().trim();
    const password = $("#password").val().trim();

    if (email === "" || password === "") {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    // Xử lý đăng nhập ở đây, ví dụ gọi AJAX...
    const [error, response] = await newITExecAPI({
      method: "POST",
      url: "api/auth/login",
      data: {
        email,
        password,
      },
    });

    if (error) {
      alert(
        error?.responseJSON?.message ||
          "Đã xảy ra ngoại lệ vui lòng thử lại sau."
      );
      return;
    }

    setCookie("token", response?.data?.token, 7);
    window.localStorage.setItem("user", JSON.stringify(response?.data));
    $("#loginModal").modal("hide");

    if (response?.data?.role === 0) {
      window.location = "/user.html";
    } else {
      window.location = "/admin.html";
    }

    alert("Đăng nhập thành công.");
  });

  //--------------------------------------ĐĂNG KÝ ---------------------------------
  $("#register").on("click", async function () {
    const data = {
      fullName: $("#fullName").val().trim(),
      email: $("#newEmail").val().trim(),
      phoneNumber: $("#phoneNumber").val().trim(),
      password: $("#newPassword").val(),
    };

    if (
      !data?.email ||
      !data?.fullName ||
      !data?.phoneNumber ||
      !data?.password
    ) {
      alert("Vui lòng nhập đầy đủ các trường đánh dấu sao (*).");
      return;
    }

    if (data?.password?.length < 6) {
      alert("Mật khẩu phải từ 6 ký tự trở lên.");
      return;
    }

    // Xử lý đăng nhập ở đây, ví dụ gọi AJAX...
    const [error, response] = await newITExecAPI({
      method: "POST",
      url: "api/auth/register",
      data,
    });

    if (error) {
      alert(
        error?.responseJSON?.message ||
          "Đã xảy ra ngoại lệ vui lòng thử lại sau."
      );
      return;
    }

    alert("Đăng ký tài khoản thành công.");
    $("#switchToLogin").click();
  });

  $("#switchToRegister").click(function (e) {
    e.preventDefault();
    $("#loginModal").modal("hide");
    $("#registerModal").modal("show");
  });
  // chuyển đổi giữa đăng ký và đăng nhập
  $("#switchToLogin").click(function (e) {
    e.preventDefault();
    $("#registerModal").modal("hide");
    $("#loginModal").modal("show");
  });

  // USER PAGE

  $("#ticketForm").submit(function (e) {
    e.preventDefault(); // chặn form submit mặc định

    // Giả sử giá vé là 10000đ
    const ticketPrice = 10000;

    // Lấy số dư tài khoản chính
    let mainBalance = $("#mainBalance").text().replace(/[^\d]/g, "");
    mainBalance = parseInt(mainBalance);

    if (mainBalance >= ticketPrice) {
      alert("Thanh toán thành công!");
      // ở đây bạn có thể gửi dữ liệu đến server bằng AJAX nếu cần
    } else {
      // Nếu không đủ tiền, hiện thông báo với lựa chọn chuyển đến trang nạp tiền
      if (confirm("Thanh toán không thành công. Bạn có muốn nạp tiền?")) {
        window.location.href = "pay.html";
      }
    }
  });

  // Handle quick amount buttons
  $(".quick-amount-btn").on("click", function () {
    // Remove active class from all buttons
    $(".quick-amount-btn").removeClass("active");

    // Add active class to clicked button
    $(this).addClass("active");

    // Set the amount in the input field
    const amount = $(this).data("amount");
    $("#amountInput").val(amount);
  });
});
