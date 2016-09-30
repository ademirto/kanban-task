
(function($) {
  //FIXME its ugly, check bug in bootstrap-material-design
  setTimeout(
    () => {
      console.log('inicialize material interface');
      $.material.init();
    },
    2000
  );
})(jQuery);
