$(document).ready(function () {
  console.log("Slick Carousel is ready");
  $(".my_carousel").slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
});
