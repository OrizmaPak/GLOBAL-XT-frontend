var THEMEMASCOT = {};
(function($) {
  "use strict";

  /* ---------------------------------------------------------------------- */
  /* -------------------------- Declare Variables ------------------------- */
  /* ---------------------------------------------------------------------- */
  var $document = $(document);
  var $document_body = $(document.body);
  var $window = $(window);
  var $html = $('html');
  var $body = $('body');
  var $wrapper = $('#wrapper');
  var $header = $('#header');
  var $header_navbar_scrolltofixed = $('body.tm-header-sticky');
  var $sections = $('.elementor-section.elementor-top-section');
  var windowHeight = $window.height();
  var windowWidth = $window.width();
  var $wpAdminBar = $('#wpadminbar');

  var $gallery_isotope = $(".isotope-layout");


  THEMEMASCOT.isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (THEMEMASCOT.isMobile.Android() || THEMEMASCOT.isMobile.BlackBerry() || THEMEMASCOT.isMobile.iOS() || THEMEMASCOT.isMobile.Opera() || THEMEMASCOT.isMobile.Windows());
    }
  };


  function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function admin_bar_height() {
    var admin_bar_height = 0;
    if( $body.hasClass('admin-bar') ) {
      admin_bar_height = $('#wpadminbar').height();
    }
    return admin_bar_height;
  }

  function tmProgressBarCounter(pBar, pPercent){
    var percent = parseFloat(pPercent);
    if(pBar.length) {
      pBar.each(function() {
        var current_item = $(this);
        current_item.css('opacity', '1');
        current_item.countTo({
          from: 0,
          to: percent,
          speed: 2000,
          refreshInterval: 50
        });
      });
    }
  }

  function tmMasonryItemsHeightResizer(size, container){
    if(container.hasClass('masonry-tiles')) {
      var padding = parseInt(container.find('.isotope-item:not(.isotope-item-sizer)').css('padding-left')),
        masonry_default = container.find('.tm-masonry-default'),
        masonry_large_height = container.find('.tm-masonry-large-height'),
        masonry_large_wide = container.find('.tm-masonry-large-wide'),
        masonry_large_width_height = container.find('.tm-masonry-large-width-height');
      if ($window.width() > 680) {
        masonry_default.css('height', size - 2 * padding);
        masonry_large_height.css('height', Math.round(2 * size) - 2 * padding);
        masonry_large_width_height.css('height', Math.round(2 * size) - 2 * padding);
        masonry_large_wide.css('height', size - 2 * padding);
      } else {
        masonry_default.css('height', size);
        masonry_large_height.css('height', size);
        masonry_large_width_height.css('height', size);
        masonry_large_wide.css('height', Math.round(size / 2));
      }
    }
  }

  THEMEMASCOT.isRTL = {
    check: function() {
      if( $( "html" ).attr("dir") === "rtl" ) {
        return true;
      } else {
        return false;
      }
    }
  };

  THEMEMASCOT.isLTR = {
    check: function() {
      if( $( "html" ).attr("dir") !== "rtl" ) {
        return true;
      } else {
        return false;
      }
    }
  };

  THEMEMASCOT.urlParameter = {
    get: function(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
        }
      }
    }
  };


  THEMEMASCOT.hot = {
    init: function() {
      THEMEMASCOT.hot.TM_Mouse_Follow_Show_Floating_Info();
    },

    /* ---------------------------------------------------------------------- */
    /* -------------------------- On Mouse Over Show Info ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_Mouse_Follow_Show_Floating_Info: function() {
      //from marceau
      var $has_mouse_follow_floating_info = $( '.tm-has-mouse-follow-floating-info' );

      if( $has_mouse_follow_floating_info.length > 0 ) {
        $document_body.append( '<div class="tm-mouse-follow-floating-info-holder"><div class="mouse-follow-floating-info-inner"><div class="floating-subtitle"></div><div class="floating-title"></div></div></div>' );

        var $floating_info_holder   = $( '.tm-mouse-follow-floating-info-holder' ),
        $floating_subtitle = $floating_info_holder.find( '.floating-subtitle' ),
        $floating_title    = $floating_info_holder.find( '.floating-title' );

        $has_mouse_follow_floating_info.each(
          function () {
            $has_mouse_follow_floating_info.find( '.tm-floating-info-item' ).each(
              function () {
                var $thisItem = $( this );

                //info element position
                $thisItem.on(
                  'mousemove',
                  function ( e ) {
                    if ( e.clientX + 20 + $floating_info_holder.width() > windowWidth ) {
                      $floating_info_holder.addClass( 'floating-info-right' );
                    } else {
                      $floating_info_holder.removeClass( 'floating-info-right' );
                    }

                    $floating_info_holder.css(
                      {
                        top: e.clientY + 20,
                        left: e.clientX + 20,
                      }
                    );
                  }
                );

                //show/hide info element
                $thisItem.on(
                  'mouseenter',
                  function () {
                    var $this_item_subtitle    = $( this ).find( '.floating-subtitle' ),
                      $this_item_title = $( this ).find( '.floating-title' );

                    if ( $this_item_title.length ) {
                      $floating_title.html( $this_item_title.clone() );
                    }

                    if ( $this_item_subtitle.length ) {
                      $floating_subtitle.html( $this_item_subtitle.html() );
                    }

                    if ( ! $floating_info_holder.hasClass( 'floating-info-active' ) ) {
                      $floating_info_holder.addClass( 'floating-info-active' );
                    }
                  }
                ).on(
                  'mouseleave',
                  function () {
                    if ( $floating_info_holder.hasClass( 'floating-info-active' ) ) {
                      $floating_info_holder.removeClass( 'floating-info-active' );
                    }
                  }
                );
              }
            );
          }
        );
      }
    },



  };

  THEMEMASCOT.initialize = {

    init: function() {
      THEMEMASCOT.initialize.TM_appearSlideAnimation();
      THEMEMASCOT.initialize.TM_Pricing_Switcher();
      THEMEMASCOT.initialize.TM_vertical_bg_img_list();
      THEMEMASCOT.initialize.TM_stretchBG_move();
      THEMEMASCOT.initialize.TM_bg_four_vertical_lines();
      THEMEMASCOT.initialize.TM_niceSelect();
      THEMEMASCOT.initialize.TM_parallaxScrollInit();
      THEMEMASCOT.initialize.TM_bootstrapNavTab();
      THEMEMASCOT.initialize.TM_tiltParallaxAnimation();
      THEMEMASCOT.initialize.TM_appearVariousItems();
      THEMEMASCOT.initialize.TM_paroller();
      THEMEMASCOT.initialize.TM_textillate();
      THEMEMASCOT.initialize.TM_parallaxBgInit();

      THEMEMASCOT.initialize.TM_yith_wcwl();
      THEMEMASCOT.initialize.TM_dataTables();
      THEMEMASCOT.initialize.TM_mediaElementPlayer();
      THEMEMASCOT.initialize.TM_toggleNavSearchIcon();
      THEMEMASCOT.initialize.TM_fixedFooter();
      THEMEMASCOT.initialize.TM_sliderRange();
      THEMEMASCOT.initialize.TM_platformDetect();
      THEMEMASCOT.initialize.TM_customDataAttributes();
      THEMEMASCOT.initialize.TM_resizeFullscreen();
      THEMEMASCOT.initialize.TM_prettyPhoto_lightbox();
      THEMEMASCOT.initialize.TM_magnificPopup_lightbox();
      THEMEMASCOT.initialize.TM_LearnPress_Accordion();
      THEMEMASCOT.initialize.TM_equalHeightDivs();
      THEMEMASCOT.initialize.TM_wow();
      THEMEMASCOT.initialize.TM_MobileNavToggle();
    },



    /* ---------------------------------------------------------------------- */
    /* ---------------------------- Mobile Nav Toggle  ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_MobileNavToggle: function() {
      $("#tm-nav-mobile").on('click', function () {
          $(this).toggleClass('active');
          $(this).children('.tm-nav-mobile-button').toggleClass('active');
          $('body').toggleClass('body-overflow');
          $('.tm-header-menu').toggleClass('active');
      });

      $document_body.on('click', '.onepage-nav a', function(e) {
        if (typeof Lenis !== "undefined") {
          $html.addClass("tm-html-enable-localscroll");
        }
        $('.tm-header-menu').toggleClass('active');
        if (typeof Lenis !== "undefined") {
          $html.removeClass("tm-html-enable-localscroll");
        }
      });

      $(".tm-menu-close, .tm-header-menu-backdrop, #tm-header-mobile .tm-menu-primary a.is-one-page").on('click', function () {
          $(this).parents('.tm-header-main').find('.tm-header-menu').removeClass('active');
          $('#tm-nav-mobile').removeClass('active');
          $('#tm-nav-mobile').children('.tm-nav-mobile-button').toggleClass('active');
          $('body').toggleClass('body-overflow');
      });
    },



    /* ---------------------------------------------------------------------- */
    /* ---------------------------- Wow initialize  ------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_wow: function() {
      var wow = new WOW({
        mobile: false // trigger animations on mobile devices (default is true)
      });
      wow.init();
    },


    /* ---------------------------------------------------------------------- */
    /* ------------------------ appear.js various items --------------------- */
    /* ---------------------------------------------------------------------- */
    //already used in section title
    TM_appearSlideAnimation: function() {
      var itemHolder = '.tm-onappear-slide-animation';
      var $itemHolder = $(itemHolder);
      if( $itemHolder.length > 0 ) {
        $itemHolder.appear();
        $document_body.on('appear', itemHolder, function() {
          var current_item = $(this);
          current_item.addClass('tm-item-appeared');
        });
      }
    },



    /* ---------------------------------------------------------------------- */
    /* -------------------------- TM_Pricing_Switcher ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_Pricing_Switcher: function() {
      var pricing_smart_switcher = $('.tm-pricing-smart-switcher');
      if( pricing_smart_switcher.length > 0 ) {
        pricing_smart_switcher.find("[data-pricing-trigger]").on("click", function (e) {
          var $self = $(e.target);
          $self.toggleClass("secondary-active");
          var pricing_tables = $self.parents(".elementor-section").find(".tm-sc-pricing-table");

          if( $self.hasClass( 'secondary-active' ) ) {
            pricing_tables.addClass('show-secondary-price');
            var pricing_btn = pricing_tables.find('.btn');
            var secondary_btn_url = pricing_btn.data("secondary-link");
            pricing_btn.attr("href", secondary_btn_url);
          } else {
            pricing_tables.removeClass('show-secondary-price');
            var pricing_btn = pricing_tables.find('.btn');
            var normal_btn_url = pricing_btn.data("normal-link");
            pricing_btn.attr("href", normal_btn_url);
          }
        });
      }
    },



    /* ---------------------------------------------------------------------- */
    /* -------------------------- vertical-bg-img-list ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_vertical_bg_img_list: function() {
      //Start execute javascript for background list
      jQuery(".vertical-bg-img-list").each(function() {
        var $this = jQuery(this);
        $this.children('.each-vertical-column').hover(function () {
          $this.find('.each-vertical-column').removeClass('hover');
          $this.find('.bg-img').removeClass('hover');
          jQuery(this).addClass('hover').next('.bg-img').addClass('hover');
          jQuery(this)
              .mouseleave(function () {
                  jQuery(this).removeClass('hover');
              });
        });
      });

      jQuery(".vertical-bg-img-list .each-vertical-column").each(function() {
        var $this = jQuery(this);
        //on hover title transition
        var content_top = $(this).find('.content-top'),
            content_bottom = $(this).find('.content-bottom');
        if (windowWidth > 1024){
            var content_bottom_height = content_bottom.outerHeight(!0);
            content_top.css({ transform: "translateY(" + content_bottom_height + "px)" }),
            $(this)
                .mouseenter(function () {
                    content_top.css({ transform: "translateY(0px)" });
                })
                .mouseleave(function () {
                    content_top.css({ transform: "translateY(" + content_bottom_height + "px)" });
                });
        }
        else{
            content_top.css("transform","");
            $(this).unbind('mouseenter mouseleave');
        }
      });
    },



    /* ---------------------------------------------------------------------- */
    /* -------------------------- paroller.js Parallax ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_stretchBG_move: function() {
      var $tm_stretched_bg = $('.tm-stretched-bg');
      if( $tm_stretched_bg.length > 0 ) {
        $tm_stretched_bg.each(function(){
          var this_item = $(this);
          var target_id = '.'+this_item.data('col-id');
          $(this_item).prependTo(target_id);
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------------- niceSelect  ---------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_bg_four_vertical_lines: function() {
      var $elementor_section = $('.elementor-section.tm-enable-four-vertical-line');
      if( $elementor_section.length > 0 ) {
        $elementor_section.children().append('<div class="tm-four-vertical-line"><div class="line line-1"></div><div class="line line-2"></div><div class="line line-3"></div><div class="line line-4"></div></div>');
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------------- niceSelect  ---------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_niceSelect: function() {
      if ( ! $body.hasClass( 'woocommerce-account' ) ) {
        var $select = $('select');
        if( $select.length > 0 ) {
          $select.niceSelect();
        }
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------------- parallax  ----------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_parallaxScrollInit: function() {
      var $parallaxHolder = $('.tm-smooth-parallax-scroll');
      if( $parallaxHolder.length > 0 ) {
        ParallaxScroll.init();
      }
    },


    /* ---------------------------------------------------------------------- */
    /* -------------------------- TbootstrapNavTab  ------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_bootstrapNavTab: function() {
      var $nav_tabs = $('ul.nav-tabs');
      $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        e.target // newly activated tab
        e.relatedTarget // previous active tab
        var $new = $(e.target);
        var $pre = $(e.relatedTarget);
        $new.parent().addClass('active');
        $pre.parent().removeClass('active');
      })
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------------- tilt  ----------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_tiltParallaxAnimation: function() {
      var $tilt_hover_effect = $('.tilt-hover-effect');
      if( $tilt_hover_effect.length > 0 ){
        $tilt_hover_effect.tilt({
        })
      }
    },



    /* ---------------------------------------------------------------------- */
    /* ------------------------ appear.js various items --------------------- */
    /* ---------------------------------------------------------------------- */
    TM_appearVariousItems: function() {
      var itemHolder = '.tm-item-appear-box, .tm-item-appear-clip-path, .tm-appear-block-holder';
      var $itemHolder = $(itemHolder);
      if( $itemHolder.length > 0 ) {
        $itemHolder.each(function(){
          var this_item = $(this);
          this_item.appear();
          var randomNum = getRandomValue(10, 400);
          $document_body.on('appear', itemHolder, function() {
            setTimeout(function () {
              this_item.addClass('tm-item-appeared');
            }, randomNum);
          });
        });
      }


      //animate items on appear
      if ( ! $body.hasClass( 'tm-enable-element-animation-effect' ) ) {
        return;
      }
      var animate_items = '.tm-animation';
      var $animate_items = $(animate_items);
      if( $animate_items.length > 0 ) {
        $animate_items.appear();
        $document_body.on('appear', animate_items, function() {
          var current_item = $(this);
          current_item.addClass('animate');
        });
      }
    },



    /* ---------------------------------------------------------------------- */
    /* -------------------------- paroller.js Parallax ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_paroller: function() {
      var $tm_paroller_object = $('.tm-paroller-object');
      //initialize paroller.js and set options for elements with .paroller class
      if( $tm_paroller_object.length > 0 ) {
        $tm_paroller_object.each(function(){
          var this_item = $(this);
          this_item.paroller();
        });
      }
    },



    /* ---------------------------------------------------------------------- */
    /* ------------------- textillate.js CSS3 text animations --------------- */
    /* ---------------------------------------------------------------------- */
    TM_textillate: function() {
      var $tm_textillate_animation = $('.tm-textillate-animation');
      if( $tm_textillate_animation.length > 0 ) {
        $tm_textillate_animation.appear();
        var randomNum = getRandomValue(10, 400);
        $document_body.on('appear', '.tm-textillate-animation', function() {
          var current_item = $(this);
          setTimeout(function () {
            if (!current_item.hasClass('appeared')) {
              current_item.textillate();
              current_item.addClass('appeared');
            }
          }, randomNum);
        });
      }
    },



    /* ---------------------------------------------------------------------- */
    /* -------------------------- Background Parallax ----------------------- */
    /* ---------------------------------------------------------------------- */
    TM_parallaxBgInit: function() {
      if (!THEMEMASCOT.isMobile.any() && $window.width() >= 800 ) {
        $('.parallax').each(function() {
          var data_parallax_ratio = ( $(this).data("parallax-ratio") === undefined ) ? '0.5': $(this).data("parallax-ratio");
          $(this).parallax("50%", data_parallax_ratio);
        });
      } else {
        $('.parallax').addClass("mobile-parallax");
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------------- Lazy Load  ----------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_lazyImageLoad: function() {
      var $lazy_load_image = $('.lazy-load-image');

      if( $lazy_load_image.length > 0 ){
        $lazy_load_image.Lazy({
          scrollDirection: 'vertical',
          effect: 'fadeIn',
          visibleOnly: true,
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------- YITH WCWL wishlist  -------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_yith_wcwl: function() {
      $('.yith-wcwl-add-to-wishlist').each(function(){
        var $this = $(this);
        var $yithWcwlAddButton            = $this.find('.yith-wcwl-add-button');
        var $yithWcwlWishlistaddedbrowse  = $this.find('.yith-wcwl-wishlistaddedbrowse');
        var $yithWcwlWishlistexistsbrowse = $this.find('.yith-wcwl-wishlistexistsbrowse');

        var $yithWcwlAddButtonLink = $yithWcwlAddButton.find('a');
        $yithWcwlAddButtonLink.attr('title',$yithWcwlAddButtonLink.text().trim());

        $yithWcwlWishlistaddedbrowse.find('a').attr('title',$yithWcwlWishlistaddedbrowse.find('.feedback').text().trim());
        $yithWcwlWishlistexistsbrowse.find('a').attr('title',$yithWcwlWishlistexistsbrowse.find('.feedback').text().trim());

        $this.find('a').on('click',function(){
          var $self = $(this);
          $self.toggleClass('active');
          setTimeout(function(){
            $self.toggleClass('active');
          },1000);
        });
      });
    },


    /* ---------------------------------------------------------------------- */
    /* ------------------------ Data Table  --------------------- */
    /* ---------------------------------------------------------------------- */
    TM_dataTables: function() {
      var $data_table = $('table.data-table');

      if( $data_table.length > 0 ){
        $($data_table).DataTable( {
          "paging":   false,
          "info":     false,
          "searching":false
        } );
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ------------------------ media-element  --------------------- */
    /* ---------------------------------------------------------------------- */
    TM_mediaElementPlayer: function() {
      $('.media-element-audio-player, .video-player-wrapper .video').mediaelementplayer();
    },


    /* ---------------------------------------------------------------------- */
    /* ------------------------ portfolio-sticky-sidebar  ------------------- */
    /* ---------------------------------------------------------------------- */
    TM_stickySidebar: function() {
      var $portfolio_sticky_side_text = $(".portfolio-sticky-side-text");
      if( $portfolio_sticky_side_text.length > 0 ) {
        var width = $window.width();
        var stickySidebar = new StickySidebar('.portfolio-details-parent', {
          containerSelector: '.portfolio-sticky-side-text ',
          innerWrapperSelector: '.portfolio-details-inner',
          topSpacing: 150,
          bottomSpacing: 20,
          minWidth: 767
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ---------------------------- stick_in_parent  ------------------------ */
    /* ---------------------------------------------------------------------- */
    TM_stickInParent: function() {
      var widget_sticky_sidebar = $('.tm-widget-sticky-sidebar-in-parent');
      if ( widget_sticky_sidebar.length && windowWidth > 768 ) {
        widget_sticky_sidebar.each(function(){
          var widget = $(this),
            sidebar = widget.closest('.tm-sidebar-area'),
            parents = $('.tm-blog-sidebar-row');
          sidebar.stick_in_parent({
            parent: parents,
            sticky_class : 'tm-sticky-sidebar',
            offset_top : 50,
            bottoming : true,
            inner_scrolling : true
          });
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ---------------------------- stick_in_parent  ------------------------ */
    /* ---------------------------------------------------------------------- */
    TM_stickInParentShop: function() {
      var widget_sticky_sidebar = $('.tm-shop-single-text-sticky-in-parent');
      if ( widget_sticky_sidebar.length && windowWidth > 768 ) {
        widget_sticky_sidebar.each(function(){
          var widget = $(this),
            sidebar = widget.closest('.tm-shop-single-sidebar-area'),
            parents = $('.product-details');
          sidebar.stick_in_parent({
            parent: parents,
            sticky_class : 'tm-sticky-sidebar',
            offset_top : 50,
            bottoming : true,
            inner_scrolling : true
          });
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------ Toggle Nav Search Icon  --------------------- */
    /* ---------------------------------------------------------------------- */
    TM_toggleNavSearchIcon: function() {

      $document_body.on('click', '.top-nav-search-btn', function(e) {
        e.preventDefault();
        $html.addClass('html-search-block-active');
        var target_id = $(this).data('target');
        $( "#" + target_id ).addClass('active').stop(true,true).fadeIn(100).find('input[type=text]').focus();
        return false;
      });
      $document_body.on('click', '.close-search-btn', function(e) {
        e.preventDefault();
        $html.removeClass('html-search-block-active');
        var target_id = $(this).data('target');
        $( "#" + target_id ).removeClass('active').stop(true,true).fadeOut(100);
        return false;
      });
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------------ Fixed Footer  ------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_fixedFooter: function() {
      var $fixed_footer = $('.fixed-footer');
      var $boxed_layout = $('body.tm-boxed-layout');
      var margin_bottom = $fixed_footer.height();

      if( $fixed_footer.length > 0 ){
        if( $window.width() >= 1200 ) {
        } else {
          margin_bottom = 0;
        }

        if( $boxed_layout.length > 0 ) {
          var boxed_layout_padding_bottom = $boxed_layout.css('padding-bottom');
          $fixed_footer.css('bottom', boxed_layout_padding_bottom );
        }
        $('body.has-fixed-footer .main-content').css('margin-bottom', margin_bottom);
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- slider range  -------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_sliderRange: function() {
      var $slider_range = $(".slider-range");
      if( $slider_range.length > 0 ) {
        $slider_range.each(function(){
          var id = $(this).attr('id');
          var target_id = $(this).data('target');
          $( "#" + target_id ).slider({
            range: "max",
            min: 2001,
            max: 2016,
            value: 2010,
            slide: function( event, ui ) {
            $( "#" + id ).val( ui.value );
            }
          });
          $( "#" + id ).val( $( "#" + target_id ).slider( "value" ) );
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------------ Preloader  ---------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_preLoaderClickDisable: function() {
      var $preloader = $('#preloader');
      $preloader.children('#disable-preloader').on('click', function(e) {
        $preloader.fadeOut();
        return false;
      });
    },

    TM_preLoaderOnLoad: function() {
      var $preloader = $('#preloader');
      $preloader.find("#spinner").fadeOut('slow');
      if( $preloader.length > 0 ) {
        $('#preloader').fadeOut('slow');
        $('#preloader .layer .overlay2').animate({
          'left': '100%'
        }, {
          step: function (now, fx) {
            $(this).css({"transform": "translate3d(0px, 0px, 0px)"});
          },
          duration: 800,
          easing: 'linear',
          queue: false,
          complete: function () {
            $preloader.fadeOut('slow');
          }
        }, 'linear');
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ------------------------------- Platform detect  --------------------- */
    /* ---------------------------------------------------------------------- */
    TM_platformDetect: function() {
      if (THEMEMASCOT.isMobile.any()) {
        $html.addClass("mobile");
      } else {
        $html.addClass("no-mobile");
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------------ Hash Forwarding  ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_hashForwarding: function() {
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------- Background image, color ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_customDataAttributes: function() {
      $('[data-tm-bg-color]').each(function() {
        $(this).css("cssText", "background-color: " + $(this).data("tm-bg-color") + " !important;");
      });
      $('[data-tm-bg-img]').each(function() {
        $(this).css('background-image', 'url(' + $(this).data("tm-bg-img") + ')');
      });
      $('[data-tm-text-color]').each(function() {
        $(this).css('color', $(this).data("tm-text-color"));
      });
      $('[data-tm-font-size]').each(function() {
        $(this).css('font-size', $(this).data("tm-font-size"));
      });
      $('[data-tm-opacity]').each(function() {
        $(this).css('opacity', $(this).data("tm-opacity"));
      });
      $('[data-tm-height]').each(function() {
        $(this).css('height', $(this).data("tm-height"));
      });
      $('[data-tm-width]').each(function() {
        $(this).css('width', $(this).data("tm-width"));
      });
      $('[data-tm-border]').each(function() {
        $(this).css('border', $(this).data("tm-border"));
      });
      $('[data-tm-z-index]').each(function() {
        $(this).css('z-index', $(this).data("tm-z-index"));
      });



      $('[data-tm-padding]').each(function() {
        $(this).css('padding', $(this).data("tm-padding"));
      });
      $('[data-tm-padding-top]').each(function() {
        $(this).css('padding-top', $(this).data("tm-padding-top"));
      });
      $('[data-tm-padding-right]').each(function() {
        $(this).css('padding-right', $(this).data("tm-padding-right"));
      });
      $('[data-tm-padding-bottom]').each(function() {
        $(this).css('padding-bottom', $(this).data("tm-padding-bottom"));
      });
      $('[data-tm-padding-left]').each(function() {
        $(this).css('padding-left', $(this).data("tm-padding-left"));
      });

      $('[data-tm-margin]').each(function() {
        $(this).css('margin', $(this).data("tm-margin"));
      });
      $('[data-tm-margin-top]').each(function() {
        $(this).css('margin-top', $(this).data("tm-margin-top"));
      });
      $('[data-tm-margin-right]').each(function() {
        $(this).css('margin-right', $(this).data("tm-margin-right"));
      });
      $('[data-tm-margin-bottom]').each(function() {
        $(this).css('margin-bottom', $(this).data("tm-margin-bottom"));
      });
      $('[data-tm-margin-left]').each(function() {
        $(this).css('margin-left', $(this).data("tm-margin-left"));
      });

      $('[data-tm-top]').each(function() {
        $(this).css('top', $(this).data("tm-top"));
      });
      $('[data-tm-right]').each(function() {
        $(this).css('right', $(this).data("tm-right"));
      });
      $('[data-tm-bottom]').each(function() {
        $(this).css('bottom', $(this).data("tm-bottom"));
      });
      $('[data-tm-left]').each(function() {
        $(this).css('left', $(this).data("tm-left"));
      });
    },

    /* ---------------------------------------------------------------------- */
    /* --------------------------- Home Resize Fullscreen ------------------- */
    /* ---------------------------------------------------------------------- */
    TM_resizeFullscreen: function() {
      var $fullscreen = $('.section-fullscreen');
      if ( $window.width() >= 991 ) {
        var windowHeight = $window.height();
        $fullscreen.height( windowHeight );
      } else {
        $fullscreen.css('height', 'auto');
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- Magnific Popup ------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_magnificPopup_lightbox: function() {

      var $image_popup_lightbox = $('.image-popup-lightbox');
      if( $image_popup_lightbox.length > 0 ) {
        $image_popup_lightbox.magnificPopup({
          type: 'image',
          closeOnContentClick: true,
          closeBtnInside: false,
          fixedContentPos: true,
          mainClass: 'mfp-no-margins mfp-fade', // class to remove default margin from left and right side
          image: {
            verticalFit: true
          }
        });
      }

      var $image_popup_vertical_fit = $('.image-popup-vertical-fit');
      if( $image_popup_vertical_fit.length > 0 ) {
        $image_popup_vertical_fit.magnificPopup({
          type: 'image',
          closeOnContentClick: true,
          mainClass: 'mfp-img-mobile',
          image: {
            verticalFit: true
          }
        });
      }

      var $image_popup_fit_width = $('.image-popup-fit-width');
      if( $image_popup_fit_width.length > 0 ) {
        $image_popup_fit_width.magnificPopup({
          type: 'image',
          closeOnContentClick: true,
          image: {
            verticalFit: false
          }
        });
      }

      var $image_popup_no_margins = $('.image-popup-no-margins');
      if( $image_popup_no_margins.length > 0 ) {
        $image_popup_no_margins.magnificPopup({
          type: 'image',
          closeOnContentClick: true,
          closeBtnInside: false,
          fixedContentPos: true,
          mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
          image: {
            verticalFit: true
          },
          zoom: {
            enabled: true,
            duration: 300 // don't foget to change the duration also in CSS
          }
        });
      }

      var $popup_gallery = $('.popup-gallery');
      if( $popup_gallery.length > 0 ) {
        $popup_gallery.magnificPopup({
          delegate: 'a',
          type: 'image',
          tLoading: 'Loading image #%curr%...',
          mainClass: 'mfp-img-mobile',
          gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
          },
          image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: function(item) {
              return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
            }
          }
        });
      }

      var $zoom_gallery = $('.zoom-gallery');
      if( $zoom_gallery.length > 0 ) {
        $zoom_gallery.magnificPopup({
          delegate: 'a',
          type: 'image',
          closeOnContentClick: false,
          closeBtnInside: false,
          mainClass: 'mfp-with-zoom mfp-img-mobile',
          image: {
            verticalFit: true,
            titleSrc: function(item) {
              return item.el.attr('title') + ' &middot; <a class="image-source-link" href="'+item.el.attr('data-source')+'" target="_blank">image source</a>';
            }
          },
          gallery: {
            enabled: true
          },
          zoom: {
            enabled: true,
            duration: 300, // don't foget to change the duration also in CSS
            opener: function(element) {
              return element.find('img');
            }
          }

        });
      }

      var $popup_yt_vimeo_gmap = $('.popup-youtube, .popup-vimeo, .popup-gmaps');
      if( $popup_yt_vimeo_gmap.length > 0 ) {
        $popup_yt_vimeo_gmap.magnificPopup({
          type: 'iframe',
          mainClass: 'mfp-fade',
          removalDelay: 160,
          preloader: false,

          fixedContentPos: false
        });
      }

      var $popup_with_zoom_anim = $('.popup-with-zoom-anim');
      if( $popup_with_zoom_anim.length > 0 ) {
        $popup_with_zoom_anim.magnificPopup({
          type: 'inline',

          fixedContentPos: false,
          fixedBgPos: true,

          overflowY: 'auto',

          closeBtnInside: true,
          preloader: false,

          midClick: true,
          removalDelay: 300,
          mainClass: 'my-mfp-zoom-in'
        });
      }

      var $popup_with_move_anim = $('.popup-with-move-anim');
      if( $popup_with_move_anim.length > 0 ) {
        $popup_with_move_anim.magnificPopup({
          type: 'inline',

          fixedContentPos: false,
          fixedBgPos: true,

          overflowY: 'auto',

          closeBtnInside: true,
          preloader: false,

          midClick: true,
          removalDelay: 300,
          mainClass: 'my-mfp-slide-bottom'
        });
      }

      var $ajaxload_popup = $('.ajaxload-popup');
      if( $ajaxload_popup.length > 0 ) {
        $ajaxload_popup.magnificPopup({
          type: 'ajax',
          alignTop: true,
          overflowY: 'scroll', // as we know that popup content is tall we set scroll overflow by default to avoid jump
          callbacks: {
          parseAjax: function(mfpResponse) {
            THEMEMASCOT.initialize.TM_sliderRange();
            THEMEMASCOT.initialize.TM_ddslick();
          }
          }
        });
      }

      var $form_ajax_load = $('.form-ajax-load');
      if( $form_ajax_load.length > 0 ) {
        $form_ajax_load.magnificPopup({
          type: 'ajax'
        });
      }

      var $popup_with_form = $('.popup-with-form');
      if( $popup_with_form.length > 0 ) {
        $popup_with_form.magnificPopup({
          type: 'inline',
          preloader: false,
          focus: '#name',

          mainClass: 'mfp-no-margins mfp-fade',
          closeBtnInside: false,
          fixedContentPos: true,

          // When elemened is focused, some mobile browsers in some cases zoom in
          // It looks not nice, so we disable it:
          callbacks: {
            beforeOpen: function() {
            if($window.width() < 700) {
              this.st.focus = false;
            } else {
              this.st.focus = '#name';
            }
            }
          }
        });
      }

      var $mfpLightboxAjax = $('[data-lightbox="ajax"]');
      if( $mfpLightboxAjax.length > 0 ) {
        $mfpLightboxAjax.magnificPopup({
          type: 'ajax',
          closeBtnInside: false,
          callbacks: {
            ajaxContentAdded: function(mfpResponse) {
            },
            open: function() {
            },
            close: function() {
            }
          }
        });
      }

      //lightbox image
      var $mfpLightboxImage = $('[data-lightbox="image"]');
      if( $mfpLightboxImage.length > 0 ) {
        $mfpLightboxImage.magnificPopup({
          type: 'image',
          closeOnContentClick: true,
          closeBtnInside: false,
          fixedContentPos: true,
          mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
          image: {
            verticalFit: true
          }
        });
      }

      //lightbox gallery
      var $mfpLightboxGallery = $('[data-lightbox="gallery"]');
      if( $mfpLightboxGallery.length > 0 ) {
        $mfpLightboxGallery.each(function() {
          var element = $(this);
          element.magnificPopup({
            delegate: 'a[data-lightbox="isotope-item"]',
            type: 'image',
            closeOnContentClick: true,
            closeBtnInside: false,
            fixedContentPos: true,
            mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
            image: {
              verticalFit: true
            },
            gallery: {
              enabled: true,
              navigateByImgClick: true,
              preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            },
            zoom: {
              enabled: true,
              duration: 300, // don't foget to change the duration also in CSS
              opener: function(element) {
              return element.find('img');
              }
            }

          });
        });
      }

      //lightbox iframe
      var $mfpLightboxIframe = $('[data-lightbox="iframe"]');
      if( $mfpLightboxIframe.length > 0 ) {
        $mfpLightboxIframe.magnificPopup({
          type: 'iframe',
          mainClass: 'mfp-fade',
          removalDelay: 160,
          preloader: true,
          fixedContentPos: false,
          callbacks: {
            open: function() {
              // Will fire when this exact popup is opened
              $html.addClass('html-magnific-popup-active');
            },
            close: function() {
              // Will fire when popup is closed
              $html.removeClass('html-magnific-popup-active');
            }
          }
        });
      }

      //lightbox inline
      var $mfpLightboxInline = $('[data-lightbox="inline"]');
      if( $mfpLightboxInline.length > 0 ) {
        $mfpLightboxInline.magnificPopup({
          type: 'inline',
          mainClass: 'mfp-no-margins mfp-zoom-in',
          closeBtnInside: false,
          fixedContentPos: true
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- lightbox popup ------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_prettyPhoto_lightbox: function() {
      //prettyPhoto lightbox
      var $pretty_photo_lightbox = $("a[data-rel^='prettyPhoto']");
      if( $pretty_photo_lightbox.length > 0 ) {
        $pretty_photo_lightbox.prettyPhoto({
          hook: 'data-rel',
          animation_speed:'normal',
          theme:'dark_square',
          slideshow:3000,
          autoplay_slideshow: false,
          social_tools: false
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- Fit Vids ------------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_fitVids: function() {
      $body.fitVids();
    },

    TM_LearnPress_Accordion: function() {
      try {
        $('.js-call-accordion').each(function(){
          var wraper = $(this);

          if($(wraper).hasClass('active-accordion')) {
            $(wraper).find('.section-content').show();
          }
          else {
            $(wraper).find('.section-content').hide();
          }

          $(wraper).find('.js-toggle-accordion').on('click', function(){
            $(wraper).toggleClass('active-accordion');
            $(wraper).find('.section-content').slideToggle();
          });
        });

      } catch(er) {}
    },


    /* ---------------------------------------------------------------------- */
    /* ---------------------------- equalHeights ---------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_equalHeightDivs: function() {
      var $equal_height = $('[data-tm-equal-height-col]');
      if( $equal_height.length > 0 ) {
        $equal_height.each(function () {
          var $this = $(this);
          var target_div = ( $this.data("tm-equal-height-col") === undefined ) ? ".elementor-section .elementor-widget-wrap": $this.data("tm-equal-height-col");
          var responsive = $this.data("tm-equal-height-responsive") ;
          if ( $window.width() >= 1025 ) {
            $this.find(target_div).matchHeight();
          } else if ( $window.width() >= 768 && $window.width() <= 1024 ) {
            if ($this.hasClass('tm-eqh-disable-on-tablet')) {
              $this.children(target_div).css('height', 'auto');
              $this.find(target_div).matchHeight({ remove: true });
            }else {
              $this.find(target_div).matchHeight();
            }
          } else if ( $window.width() < 768 ) {
            if ($this.hasClass('tm-eqh-disable-on-mobile')) {
              $this.children(target_div).css('height', 'auto');
              $this.find(target_div).matchHeight({ remove: true });
            }else {
              $this.find(target_div).matchHeight();
            }
          }
        });
      }
    }

  };


  THEMEMASCOT.header = {

    init: function() {

      var t = setTimeout(function() {
        THEMEMASCOT.header.TM_wpadminbarInMobile();
        THEMEMASCOT.header.TM_verticalNavHeaderPadding();
        THEMEMASCOT.header.TM_Memuzord_Megamenu();
        THEMEMASCOT.header.TM_Memuzord_Megamenu();
        THEMEMASCOT.header.TM_TopNav_Dropdown_Position();
        THEMEMASCOT.header.TM_fullscreenMenu();
        THEMEMASCOT.header.TM_sidePanelReveal();
        THEMEMASCOT.header.TM_scroolToTopOnClick();
        THEMEMASCOT.header.TM_navbar_scrolltofixed_hide();
        THEMEMASCOT.header.TM_scrollToFixed();
        THEMEMASCOT.header.TM_HeaderTopElementorSticky();
        THEMEMASCOT.header.TM_topnavAnimate();
        THEMEMASCOT.header.TM_scrolltoTarget();
        THEMEMASCOT.header.TM_navLocalScorll();
        THEMEMASCOT.header.TM_menuCollapseOnClick();
        THEMEMASCOT.header.TM_homeParallaxFadeEffect();
        THEMEMASCOT.header.TM_topsearch_toggle();
      }, 0);

    },


    /* ---------------------------------------------------------------------- */
    /* ------------------------- HTML Margin Top ---------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_wpadminbarInMobile: function() {
      if( $window.width() < 600 ) {
        $('#wpadminbar').attr('style', 'position: fixed');
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ------------------------- menufullpage ---------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_fullscreenMenu: function() {
      var $menufullpage = $('.menu-full-page .fullpage-nav-toggle');
      if( $menufullpage.length > 0 ) {
        $menufullpage.menufullpage();
      }

      //add fade animation delay
      var menu_li = $('#fullpage-nav #main-nav > li');
      menu_li.each(function(i) {
        $(this).css({
          '-webkit-animation-delay': (i + 1) * 64 + 'ms',
          '-moz-animation-delay': (i + 1) * 64 + 'ms',
          'animation-delay': (i + 1) * 64 + 'ms'
        });
      });

      var menufullpage_sidebar = $('#fullpage-nav .menufullpage-nav-sidebar');
      if (menufullpage_sidebar.length) {
        menufullpage_sidebar.children().css({
          '-webkit-animation-delay': (menu_li.length + 1) * 64 + 'ms',
          '-moz-animation-delay': (menu_li.length + 1) * 64 + 'ms',
          'animation-delay': (menu_li.length + 1) * 64 + 'ms'
        });
      }

      //dropdown
      var menuItemWithChild =  $('#fullpage-nav #main-nav li.menu-item.menu-item-has-children > a');
      menuItemWithChild.find('.indicator').children('i').removeClass('fa fa-angle-down').addClass('arrow_right');
      //open sub menus on click
      menuItemWithChild.on('tap click', function(e) {
        e.preventDefault();
        var this_item = $(this),
          this_item_parent = this_item.parent(),
          this_item_parent_siblings_has_dropdown = this_item_parent.siblings('.menu-item-has-children');

        if (this_item_parent.hasClass('menu-item-has-children')) {
          var submenu = this_item_parent.find('> ul.dropdown, > .megamenu');

          if (submenu.is(':visible')) {
            submenu.slideUp(450, 'easeInOutQuint');
            this_item_parent.removeClass('open-sub-menu');
          } else {
            this_item_parent.addClass('open-sub-menu');

            if(this_item_parent_siblings_has_dropdown.length === 0) {
              submenu.slideDown(400, 'easeInOutQuint');
            } else {
              this_item_parent.siblings().removeClass('open-sub-menu').find('.dropdown, .megamenu').slideUp(400, 'easeInOutQuint', function() {
                submenu.slideDown(400, 'easeInOutQuint');
              });
            }
          }
        }

        return false;
      });
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------- Side Push Panel ---------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_sidePanelReveal: function() {
        /*e.preventDefault();
        var target_id = $(this).data('target');
        $( "#" + target_id ).addClass('active').stop(true,true).fadeIn(100).find('input[type=text]').focus();*/


      if( $('.side-panel-trigger').length > 0 ) {
        $body.addClass("has-side-panel side-panel-right");
      }
      $('.side-panel-trigger').on('click', function(e) {
        $body.toggleClass("side-panel-open");
        if ( THEMEMASCOT.isMobile.any() ) {
          $body.toggleClass("overflow-hidden");
        }
        return false;
      });

      $('.has-side-panel .side-panel-body-overlay').on('click', function(e) {
        $body.toggleClass("side-panel-open");
        return false;
      });

      if( $wpAdminBar.length > 0 ) {
        var wpAdminBar_height = $wpAdminBar.height();
        $('.side-panel-container').css('top', wpAdminBar_height);
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------------- scroll-to-top  ------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_scroolToTop: function() {
      if ($window.scrollTop() > 600) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    },

    TM_scroolToTopOnClick: function() {
      $document_body.on('click', '.scroll-to-top', function(e) {
        if (typeof Lenis !== "undefined") {
          $html.addClass("tm-html-enable-localscroll");
        }
        $('html, body').animate({
          scrollTop: 0
        }, 0);
        if (typeof Lenis !== "undefined") {
          $html.removeClass("tm-html-enable-localscroll");
        }
        return false;
      });
    },


    /* ---------------------------------------------------------------------------- */
    /* --------------------------- One Page Nav close on click -------------------- */
    /* ---------------------------------------------------------------------------- */
    TM_menuCollapseOnClick: function() {
      $document.on('click', '.onepage-nav a', function(e) {
        if (/#/.test(this.href)) {
          if($(this).find('.indicator').length == 0) {
            $('.showhide').trigger('click');
          }
        }
      });
    },

    /* ---------------------------------------------------------------------- */
    /* ----------- Active Menu Item on Reaching Different Sections ---------- */
    /* ---------------------------------------------------------------------- */
    TM_activateMenuItemOnReach: function() {
      var $onepage_nav = $('.onepage-nav');
      if( $onepage_nav.length > 0 ) {
        var cur_pos = $window.scrollTop() + 2;
        var nav_height = $onepage_nav.outerHeight();
        $sections.each(function() {
          var top = $(this).offset().top - nav_height - 80,
            bottom = top + $(this).outerHeight();

          if (cur_pos >= top && cur_pos <= bottom) {
            $onepage_nav.find('a').parent().removeClass('current').removeClass('active');
            $sections.removeClass('current').removeClass('active');

            $onepage_nav.find('a[href="#' + $(this).attr('id') + '"]').parent().addClass('current').addClass('active');
          }

          if (cur_pos <= nav_height && cur_pos >= 0) {
            $onepage_nav.find('a').parent().removeClass('current').removeClass('active');
            $onepage_nav.find('a[href="#header"]').parent().addClass('current').addClass('active');
          }
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------- on click scrool to target with smoothness -------- */
    /* ---------------------------------------------------------------------- */
    TM_scrolltoTarget: function() {
      //jQuery for page scrolling feature - requires jQuery Easing plugin
      $('.smooth-scroll-to-target, .fullscreen-onepage-nav a').on('click', function(e) {
        e.preventDefault();

        var $anchor = $(this);

        var $hearder_top = $('.header .header-nav');
        var hearder_top_offset = 0;
        if ($hearder_top[0]){
          hearder_top_offset = $hearder_top.outerHeight(true);
        } else {
          hearder_top_offset = 0;
        }

        // if adminbar exist
        var wpAdminBar_height = 0;
        if( $wpAdminBar.length ) {
          wpAdminBar_height = $wpAdminBar.height();
        }

        //for vertical nav, offset 0
        if ($body.hasClass("tm-vertical-nav")){
          hearder_top_offset = 0;
        }

        var top = $($anchor.attr('href')).offset().top - hearder_top_offset - wpAdminBar_height;
        $('html, body').stop().animate({
          scrollTop: top
        }, 0, 'easeInSine');

      });
    },

    /* ---------------------------------------------------------------------- */
    /* -------------------------- Scroll navigation ------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_navLocalScorll: function () {
      if (typeof Lenis !== "undefined") {

        //Lenis scroll
        let lenis;
        lenis = new Lenis({
          duration: 1.,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          smooth: true,
          smoothTouch: false,
        });
        const scrollFn = (time) => {
            lenis.raf(time);
            requestAnimationFrame(scrollFn);
        };
        requestAnimationFrame(scrollFn);
        $document_body.on('click', 'a[href^="#"]', function(e) {
            const target = $(this.getAttribute('href'));
            if (target.length) {
                lenis.scrollTo(target[0], {
                    duration: 1.2,
                });
            }
        });

      } else if ($body.hasClass("tm-enable-localscroll")) {
        //if lenis not inclued then localScroll will work
        $html.addClass("tm-html-enable-localscroll");
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------- Hide Navbar on Scroll Down  ------------------ */
    /* ---------------------------------------------------------------------- */
    TM_navbar_scrolltofixed_hide: function() {
      if( $header_navbar_scrolltofixed.hasClass("tm-header-sticky-always") ) {
        //always visible on scroll
        var $header_height = $header.height();
        var currentScrollPos = $window.scrollTop();
        if ($header_height+100 > currentScrollPos) {
          $(".header-nav-sticky.tm-sticky-menu").css('top', "-100%")
        } else {
          $(".header-nav-sticky.tm-sticky-menu").css('top', admin_bar_height());
        }
      } else {
        //hide on scrool
        var $navbar_scrolltofixed = $header_navbar_scrolltofixed.find('.header-nav-sticky');
        if( $navbar_scrolltofixed.length > 0 ){
          var prevScrollpos  = $window.scrollTop();
          var $header_height = $header.height();
          var $navbar_height = $navbar_scrolltofixed.height();
          $window.on( 'scroll', function() {
            var currentScrollPos = $window.scrollTop();
            if ($header_height+100 > currentScrollPos) {
              $navbar_scrolltofixed.css('top', "-100%")
            } else if (prevScrollpos > currentScrollPos) {
              $navbar_scrolltofixed.css('top', admin_bar_height())
            } else {
              if( $document.scrollTop() > $header_height ) {
                $navbar_scrolltofixed.css('top', '-' + ( $navbar_height + admin_bar_height()) + 'px');
              } else {
              }
            }
            prevScrollpos = currentScrollPos;
          });
        }
      }
    },

    /* ---------------------------------------------------------------------------- */
    /* ------------------------------- scroll to fixed ---------------------------- */
    /* ---------------------------------------------------------------------------- */
    TM_scrollToFixed: function() {
      if( ! $body.hasClass("elementor-editor-active") ) {
        $(window).on("scroll", function() {
          if( $('.header-nav').length > 0 ) {
            var $scrolltofixed = $(".header-nav-sticky"),
                  container_width = $header.width();
            if( $(window).scrollTop() > ($header.find('.header-nav').offset().top+$header.find('.header-nav').outerHeight() + 20) ) {
              $scrolltofixed.addClass("tm-sticky-menu");

              //for box layout header sticky fixing
              if ($body.hasClass("tm-boxed-layout")) {
                $scrolltofixed.css('min-width', container_width);
              }
              THEMEMASCOT.header.TM_navbar_scrolltofixed_hide();
            } else {
              $scrolltofixed.removeClass("tm-sticky-menu")
            }
          }
        });
      }
      $('.scrolltofixed').scrollToFixed({
        marginTop: $header.find('.header-nav').outerHeight(true) + 10,
        limit: function() {
          var limit = $('#footer').offset().top - $(this).outerHeight(true);
          return limit;
        }
      });
      $('.sidebar-scrolltofixed').scrollToFixed({
        marginTop: $header.find('.header-nav').outerHeight() + 20,
        limit: function() {
          var limit = $('#footer').offset().top - $('#sidebar').outerHeight() - 20;
          return limit;
        }
      });
    },

    /* ---------------------------------------------------------------------------- */
    /* ------------------------------- Header Elementor Sticky ---------------------------- */
    /* ---------------------------------------------------------------------------- */
    TM_HeaderTopElementorSticky: function() {
      if( ! $body.hasClass("elementor-editor-active") ) {
        var $header_top_default = $('#elementor-header-top');
        var $header_top_sticky = $('#elementor-header-top-sticky');
        var $header_top_mobile_sticky = $('#elementor-header-top-mobile');
        var $header_top_mobile_sticky_height = $header_top_mobile_sticky.height();
        var $header_height = $header.height();

        if ($window.width() < 1024) {
          $header.css('height', $header_top_mobile_sticky_height);
          if ($body.hasClass("tm-header-sticky-mobile")) {
            //$header_top_mobile_sticky.css('top', admin_bar_height() + 'px');
          }
        } else {
          $header.css('height', 'auto');
        }


        $window.on("scroll", function() {
          if ($header_top_sticky.length > 0) {
            if ($body.hasClass("tm-header-sticky-always")) {
              if( $(window).scrollTop() > ($header_top_default.offset().top+$header_top_default.outerHeight() + 20) ) {
                $header_top_default.removeClass('visible');
                $header_top_sticky.addClass('visible');
                //admin bar top:
                if( $body.hasClass('admin-bar') ) {
                  $header_top_sticky.css('padding-top', admin_bar_height() + 'px');
                }
              } else {
                $header_top_default.addClass('visible');
                $header_top_sticky.removeClass('visible');
                $header_top_sticky.css('padding-top', '0');
              }
            } else if ($body.hasClass("tm-header-sticky")) {
              var prevScrollpos  = $window.scrollTop();
              $window.on( 'scroll', function() {
                var currentScrollPos = $window.scrollTop();
                if ($header_height+100 > currentScrollPos) {
                  $header_top_default.addClass('visible');
                  $header_top_sticky.removeClass('visible');
                  $header_top_sticky.css('padding-top', admin_bar_height() + 'px');
                } else if (prevScrollpos > currentScrollPos) {
                  $header_top_default.removeClass('visible');
                  $header_top_sticky.addClass('visible');
                  $header_top_sticky.css('padding-top', admin_bar_height() + 'px');
                } else {
                  if( $document.scrollTop() > $header_height ) {
                    $header_top_default.addClass('visible');
                    $header_top_sticky.removeClass('visible');
                  } else {
                  }
                }
                prevScrollpos = currentScrollPos;
              });
            }
          }


          //for header mobile sticky
          if ($window.width() < 1024 && $header_top_mobile_sticky.length > 0) {
            if ($body.hasClass("tm-header-sticky-mobile-always")) {
              if( $(window).scrollTop() > ($header_top_default.offset().top+$header_top_default.outerHeight()) ) {
                $header_top_mobile_sticky.addClass('visible');
                if( $body.hasClass('admin-bar') ) {
                  $header_top_mobile_sticky.css('transform', 'translateY(' + admin_bar_height() + 'px)');
                  $header_top_mobile_sticky.find('.tm-header-menu').css('top', '0');
                } else {
                  $header_top_mobile_sticky.css('transform', 'translateY(0)');
                }
              } else {
                $body.find('#wrapper').css('padding-top', 0);
                $header_top_mobile_sticky.removeClass('visible');
                if( $body.hasClass('admin-bar') ) {
                  $header_top_mobile_sticky.css('transform', 'translateY(' + admin_bar_height() + 'px)');
                } else {
                  $header_top_mobile_sticky.css('transform', 'translateY(0)');
                }
              }
            } else if ($body.hasClass("tm-header-sticky-mobile")) {
              var prevScrollposMobile = $window.scrollTop();
              if( $body.hasClass('admin-bar') ) {
                $header_top_mobile_sticky.css('transform', 'translateY(' + admin_bar_height() + 'px)');
                $header_top_mobile_sticky.find('.tm-header-menu').css('top', '0');
              }
              $window.on( 'scroll', function() {
                var currentScrollPosMobile = $window.scrollTop();
                if ($header_height >= currentScrollPosMobile) {
                  if( $body.hasClass('admin-bar') ) {
                    $header_top_mobile_sticky.css('transform', 'translateY(' + admin_bar_height() + 'px)');
                  } else {
                    $header_top_mobile_sticky.css('transform', 'translateY(0)');
                  }
                  $header_top_mobile_sticky.removeClass('visible');
                } else if (prevScrollposMobile > currentScrollPosMobile) {
                  $header_top_mobile_sticky.addClass('visible');
                  $header_top_mobile_sticky.removeClass('scrolling-down');
                  //admin bar top:
                  if( $body.hasClass('admin-bar') ) {
                    $header_top_mobile_sticky.css('transform', 'translateY(' + admin_bar_height() + 'px)');
                  } else {
                    $header_top_mobile_sticky.css('transform', 'translateY(0)');
                  }
                } else {
                  if( $document.scrollTop() > $header_height ) {
                    $header_top_mobile_sticky.removeClass('visible');
                    $header_top_mobile_sticky.addClass('scrolling-down');
                    $header_top_mobile_sticky.css('transform', 'translateY(-100%)');
                  } else {
                  }
                }
                prevScrollposMobile = currentScrollPosMobile;
              });
            }
          }
        });
      }
    },

    /* ---------------------------------------------------------------------------- */
    /* ------------------------------- Vertical Nav ------------------------------- */
    /* ---------------------------------------------------------------------------- */
    TM_verticalNavHeaderPadding: function() {
      if( $body.hasClass("tm-vertical-nav") ) {
        var $header_nav_wrapper = $('#header .header-nav-wrapper');
        var $header_nav_wrapper_menuzordmenu  = $('#header .header-nav-wrapper .menuzord-menu');
        if ( $header_nav_wrapper.css("position") === "fixed" && $window.width() <= 1024 ) {

          var header_nav_wrapper_menuzordmenu_height = 0;
          if( $($header_nav_wrapper_menuzordmenu).is(":visible") ) {
            header_nav_wrapper_menuzordmenu_height = $header_nav_wrapper_menuzordmenu.height();
          }

          $body.css('padding-top', $header_nav_wrapper.height() - header_nav_wrapper_menuzordmenu_height - admin_bar_height() );

        } else {
          $body.css('padding-top', 0);
        }
      }
    },

    /* ----------------------------------------------------------------------------- */
    /* --------------------------- Menuzord - Responsive Megamenu ------------------ */
    /* ----------------------------------------------------------------------------- */
    TM_menuzord: function() {

      var $menuzord_side_panel = $("#menuzord-side-panel");
      if( $menuzord_side_panel.length > 0 ) {
        $menuzord_side_panel.menuzord({
          align: "right",
          effect: "slide",
          animation: "none",
          indicatorFirstLevel: "",
          indicatorSecondLevel: "<i class='fa fa-angle-right'></i>"
        });
      }

      var $menuzord_vertical_nav = $("#menuzord-verticalnav");
      if( $menuzord_vertical_nav.length > 0 ) {
        $menuzord_vertical_nav.menuzord({
          align: "right",
          effect: "slide",
          animation: "none",
          indicatorFirstLevel: "<i class='fa fa-angle-down'></i>",
          indicatorSecondLevel: "<i class='fa fa-angle-right'></i>"
        });
      }

      //Main Top Primary Nav
      var $menuzord_top_main_nav = $(".menuzord-primary-nav");
      $menuzord_top_main_nav.each( function(i) {
        var $this = $(this);
        var $menuzord_top_main_nav_menuzord_menu = $this.find('.menuzord-menu');
        if( $this.length > 0 && $menuzord_top_main_nav_menuzord_menu.length ) {
          var effect = ( $this.data("effect") === undefined ) ? "slide": $this.data("effect");
          var animation = ( $this.data("animation") === undefined ) ? "none": $this.data("animation");
          $this.menuzord({
            effect: effect,
            animation: animation,
            indicatorFirstLevel: "<i class='fa fa-angle-down'></i>",
            indicatorSecondLevel: "<i class='fa fa-angle-right'></i>"
          });
        }
      });


      //Main Top Primary Nav
      var $menuzord_top_main_nav = $("#top-primary-nav");
      var $menuzord_top_main_nav_menuzord_menu = $menuzord_top_main_nav.find('.menuzord-menu');


      //Clone Top Primary Nav
      var $menuzord_top_main_nav_clone = $("#top-primary-nav-clone");
      var $menuzord_top_main_nav_clone_menuzord_menu = $menuzord_top_main_nav_clone.find('.menuzord-menu');

      //If click on Top Primary Nav Show Hide => it will show clone mobile nav
      $menuzord_top_main_nav.on('click', '.showhide', function(e) {
        $body.toggleClass("menuzord-menu-open");
        $menuzord_top_main_nav_clone.find('.showhide').trigger('click');
      });





      //Main Top Primary Nav
      var $menuzord_top_main_nav_sticky = $("#top-primary-nav-sticky");
      var $menuzord_top_main_nav_sticky_menuzord_menu = $menuzord_top_main_nav_sticky.find('.menuzord-menu');


      //Clone Top Primary Nav
      var $menuzord_top_main_nav_sticky_clone = $("#top-primary-nav-sticky-clone");
      var $menuzord_top_main_nav_sticky_clone_menuzord_menu = $menuzord_top_main_nav_sticky_clone.find('.menuzord-menu');

      //If click on Top Primary Nav Show Hide => it will show clone mobile nav
      $menuzord_top_main_nav_sticky.on('click', '.showhide', function(e) {
        $body.toggleClass("menuzord-menu-open");
        $menuzord_top_main_nav_sticky_clone.find('.showhide').trigger('click');
      });

    },


    /* ----------------------------------------------------------------------------- */
    /* ------------------------- Menuzord -  Megamenu Dynamic Left ----------------- */
    /* ----------------------------------------------------------------------------- */
    TM_Memuzord_Megamenu: function() {
      if ( $window.width() > 1000 ) {
        $('.menuzord-menu').children('.menu-item').find('.megamenu').each(function () {
          var $item = $(this);
          if( $item.length > 0 ) {

            var megamenu_width = $item.outerWidth();
            $item.css('left', 0);
            $item.css('right', 'auto');

            if( $item.closest('.container').length ) {
              var $container = $item.closest('.container');
            } else if( $item.closest('.container-fluid').length ) {
              var $container = $item.closest('.container-fluid');
            } else if( $item.closest('.elementor-container').length ) {
              var $container = $item.closest('.elementor-container');
            } else {
              var $container = $item.closest('.header-nav-container');
            }

            var $menuzord_primary_nav = $item.closest('.menuzord-primary-nav');

            var container_width = $container.width(),
              container_padding_left = parseInt($container.css('padding-left')),
              container_padding_right = parseInt($container.css('padding-right')),
              parent_width = $item.closest('.menuzord-menu').outerWidth();

            var megamenu_width = $item.outerWidth();
            var right = 0;

            var left;
            if (megamenu_width > parent_width) {
              left = -(megamenu_width - parent_width) * 0.5;
            } else {
              left = 0;
            }

            var container_offset = $container.offset();
            var megamenu_parent_offset = $item.closest('.menu-item').offset();
            var menuzord_primary_nav_offset = $menuzord_primary_nav.offset();

            left = (container_offset.left + container_padding_left - megamenu_parent_offset.left);


            if( $item.hasClass('megamenu-three-quarter-width') ) {
              left += (container_width * 0.25 * 0.5)
              if($window.width() > 1440) {
                container_width = container_width * 0.75;
              } else if($window.width() > 1000) {
                container_width = container_width * 0.90;
              }
              //left = $item.css('left');
            } else if( $item.hasClass('megamenu-half-width') ) {
              if($window.width() > 1440) {
                container_width = container_width * 0.5;
              } else if($window.width() > 1000) {
                container_width = container_width * 0.70;
              }

            } else if( $item.hasClass('megamenu-quarter-width') ) {
              if($window.width() > 1440) {
                container_width = container_width * 0.25;
              } else if($window.width() > 1000) {
                container_width = container_width * 0.50;
              }
              //right = megamenu_parent_offset+$item.closest('.menu-item').outerWidth();
            }

            if( $item.hasClass('megamenu-fullwidth') ) {
              //do nothing
            } else if( $item.hasClass('megamenu-position-left') ) {
              left = 0;
            } else if( $item.hasClass('megamenu-position-center') ) {
              parent_width = $item.closest('.menu-item-has-children').outerWidth();
              left = - (megamenu_width) * 0.5;
            } else if( $item.hasClass('megamenu-position-right') ) {
              left = 'auto';
              right = 0;
            }

            $item.css('width', container_width);
            $item.css('left', left);
            $item.css('right', right);
          }
        });
      }
    },


    TM_Memuzord_Megamenu22222222222: function() {
      if ( $window.width() > 1024 ) {
        $('.menuzord-menu').children('.menu-item').find('.megamenu').each(function () {
          var $item = $(this);
          if( $item.length > 0 ) {

            $item.css('left', 0);
            $item.css('right', 'auto');

            if( $item.closest('.container').length ) {
              var $container = $item.closest('.container');
            } else if( $item.closest('.container-fluid').length ) {
              var $container = $item.closest('.container-fluid');
            } else if( $item.closest('.elementor-container').length ) {
              var $container = $item.closest('.elementor-container');
            } else {
              var $container = $item.closest('.header-nav-container');
            }

            var container_width = $container.width(),
              container_padding_left = parseInt($container.css('padding-left')),
              container_padding_right = parseInt($container.css('padding-right')),
              parent_width = $item.closest('.menuzord-menu').outerWidth();

            var megamenu_width = $item.outerWidth();

            var left;
            if (megamenu_width > parent_width) {
              left = -(megamenu_width - parent_width) * 0.5;
            } else {
              left = 0;
            }

            var container_offset = $container.offset();
            var megamenu_offset = $item.offset();

            left = -(megamenu_offset.left - container_offset.left - container_padding_left);

            if( $item.hasClass('megamenu-three-quarter-width') ) {
              container_width = container_width * 0.75;
              left = $item.css('left');
            } else if( $item.hasClass('megamenu-half-width') ) {
              container_width = container_width * 0.5;
            } else if( $item.hasClass('megamenu-quarter-width') ) {
              container_width = container_width * 0.25;
              left = $item.css('left');
            }

            if( $item.hasClass('megamenu-fullwidth') ) {
              //do nothing
            } else if( $item.hasClass('megamenu-position-left') ) {
              left = 0;
            } else if( $item.hasClass('megamenu-position-center') ) {
              parent_width = $item.closest('.menu-item-has-children').outerWidth();
              left = - (megamenu_width - parent_width) * 0.5;
              $item.css('right', 'auto');
            } else if( $item.hasClass('megamenu-position-right') ) {
              left = 'auto';
              $item.css('right', 0);
            }


            $item.css('width', container_width);
            $item.css('left', left);
          }
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* -------------------------- Top Nav Dropdown Position ----------------- */
    /* ---------------------------------------------------------------------- */
    TM_TopNav_Dropdown_Position: function() {
      if ( $window.width() > 1024 ) {
        var $top_primary_nav = $('.menuzord-primary-nav');
        var menuItems = $top_primary_nav.find(".menuzord-menu > .menu-item.menu-item-has-children");
        menuItems.each( function(i) {
          var $this = $(this);

          var $container;
          if( $top_primary_nav.closest('.container').length ) {
            var $container = $top_primary_nav.closest('.container');
          } else if( $top_primary_nav.closest('.container-fluid').length ) {
            var $container = $top_primary_nav.closest('.container-fluid');
          } else if( $top_primary_nav.closest('.elementor-container').length ) {
            var $container = $top_primary_nav.closest('.elementor-container');
          } else {
            var $container = $top_primary_nav.closest('.header-nav-container');
          }
          var browserWidth = $container.width();


          var menuzord_menu_pos_left = $top_primary_nav.find(".menuzord-menu").offset().left - $container.offset().left;
          var menuItemPosition = menuzord_menu_pos_left + $this.position().left;
          var dropdownMenuWidth = $this.find('.dropdown').width();
          var boxedLayoutWidth = $header.width();



          var menuItemFromLeft = 0;
          if ($body.hasClass("tm-boxed-layout")) {
            menuItemFromLeft = boxedLayoutWidth  - (menuItemPosition - (browserWidth - boxedLayoutWidth )/2);
          } else {
            menuItemFromLeft = browserWidth - menuItemPosition;
          }

          var dropDownMenuFromLeft; //has to stay undefined beacuse 'dropDownMenuFromLeft < dropdownMenuWidth' condition will be true
          if($this.find('li.menu-item-has-children').length > 0){
            dropDownMenuFromLeft = menuItemFromLeft - dropdownMenuWidth;
          }

          if(menuItemFromLeft < dropdownMenuWidth || dropDownMenuFromLeft < dropdownMenuWidth){
            $(this).find('.dropdown').addClass('dropdown-right-zero');
            $this.find('li.menu-item-has-children').find('.dropdown').addClass('dropdown-left');
          }

        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* --------------------------- Waypoint Top Nav Sticky ------------------ */
    /* ---------------------------------------------------------------------- */
    TM_topnavAnimate: function() {
      if ($window.scrollTop() > (50)) {
        $(".navbar-sticky-animated").removeClass("animated-active");
      } else {
        $(".navbar-sticky-animated").addClass("animated-active");
      }

      if ($window.scrollTop() > (50)) {
        $(".navbar-sticky-animated .header-nav-wrapper .container, .navbar-sticky-animated .header-nav-wrapper .container-fluid").removeClass("add-padding");
      } else {
        $(".navbar-sticky-animated .header-nav-wrapper .container, .navbar-sticky-animated .header-nav-wrapper .container-fluid").addClass("add-padding");
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ---------------- home section on scroll parallax & fade -------------- */
    /* ---------------------------------------------------------------------- */
    TM_homeParallaxFadeEffect: function() {
      if ($window.width() > 1024) {
        var scrolled = $window.scrollTop();
        $('.content-fade-effect .home-content .home-text').css('padding-top', (scrolled * 0.0610) + '%').css('opacity', 1 - (scrolled * 0.00120));
      }
    },

    /* ---------------------------------------------------------------------- */
    /* --------------------------- Top search toggle  ----------------------- */
    /* ---------------------------------------------------------------------- */
    TM_topsearch_toggle: function() {
      $document_body.on('click', '#top-search-toggle', function(e) {
        e.preventDefault();
        $('.search-form-wrapper.toggle').toggleClass('active');
        return false;
      });
    }

  };

  THEMEMASCOT.widget = {

    init: function() {

      var t = setTimeout(function() {
        THEMEMASCOT.widget.TM_shop_floating_cart();
        THEMEMASCOT.widget.TM_shopClickEvents();
        THEMEMASCOT.widget.TM_masonryIsotope();
        THEMEMASCOT.widget.TM_pieChart();
        THEMEMASCOT.widget.TM_progressBar();
        THEMEMASCOT.widget.TM_SVGAnimation();
        THEMEMASCOT.widget.TM_funfact();
        THEMEMASCOT.widget.TM_instagramFeed();
        THEMEMASCOT.widget.TM_jflickrfeed();
        THEMEMASCOT.widget.TM_accordion_toggles();
        THEMEMASCOT.widget.TM_tooltip();
        THEMEMASCOT.widget.TM_countDownTimer();
      }, 0);

    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------------ Shop Plus Minus ----------------------- */
    /* ---------------------------------------------------------------------- */
    TM_shop_floating_cart: function() {
      $('.tm-floating-woocart-wrapper .woocart-close').click(function (e) {
        e.preventDefault();
        $(this).parents('.tm-floating-woocart-wrapper').removeClass('open');
      });

      $('.tm-floating-woocart-wrapper .floating-woocart-overlay').click(function (e) {
        e.preventDefault();
        $(this).parent().toggleClass('open');
      });
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------------ Shop Plus Minus ----------------------- */
    /* ---------------------------------------------------------------------- */
    TM_shopClickEvents: function() {
      $document_body.on('click', '.quantity .plus', function(e) {
        var currentVal = parseInt($(this).parent().children(".qty").val(), 10);
        if (isNaN(currentVal)) {
          $(this).parent().children(".qty").val(1);
        }
        if (!isNaN(currentVal)) {
          $(this).parent().children(".qty").val(currentVal + 1);
        }
        $('.shop_table.cart').find('button[name="update_cart"]').removeAttr("disabled");
        return false;
      });

      $document_body.on('click', '.quantity .minus', function(e) {
        var currentVal = parseInt($(this).parent().children(".qty").val(), 10);
        if (!isNaN(currentVal) && currentVal > 0) {
          $(this).parent().children(".qty").val(currentVal - 1);
        }
        $('.shop_table.cart').find('button[name="update_cart"]').removeAttr("disabled");
        return false;
      });
    },

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- Masonry Isotope ------------------------ */
    /* ---------------------------------------------------------------------- */
    TM_masonryIsotope: function() {
      //isotope firsttime loading
      if( $gallery_isotope.length > 0 ) {
        $gallery_isotope.each(function () {
          var $each_istope = $(this);
          $each_istope.imagesLoaded(function(){
            if ($each_istope.hasClass("masonry")){
              var isotope_inner = $each_istope.children('.isotope-layout-inner'),
              size = $each_istope.find('.isotope-item-sizer').width();
              tmMasonryItemsHeightResizer(size, $each_istope);

              isotope_inner.isotope({
                isOriginLeft: THEMEMASCOT.isLTR.check(),
                itemSelector: '.isotope-item',
                layoutMode: "masonry",
                masonry: {
                  columnWidth: '.isotope-item-sizer'
                },
                getSortData : {
                  name : function ( itemElem ) {
                    return $( itemElem ).find('.title').text();
                  },
                  date : '[data-date]',
                },
                filter: "*"
              });
            } else{
              var isotope_inner = $each_istope.children('.isotope-layout-inner');
              isotope_inner.isotope({
                isOriginLeft: THEMEMASCOT.isLTR.check(),
                itemSelector: '.isotope-item',
                layoutMode: "fitRows",
                getSortData : {
                  name : function ( itemElem ) {
                    return $( itemElem ).find('.title').text();
                  },
                  date : '[data-date]',
                },
                filter: "*"
              });
            }
          });

          //search for isotope with single item and add a class to remove left right padding.
          var count = $each_istope.find('.isotope-item:not(.isotope-item-sizer)').length;
          if( count == 1 ) {
            $each_istope.addClass('isotope-layout-single-item');
          }
        });
      }

      //isotope filter
      $('.isotope-layout-filter').on('click', 'a', function(e) {
        var $this = $(this);
        var $this_parent = $this.parent('div');
        $this.addClass('active').siblings().removeClass('active');

        var fselector = $this.data('filter');
        var linkwith = $this_parent.data('link-with');
        if ( $('#'+linkwith).hasClass("masonry") ){
          var $this = $('#'+linkwith);
          var isotope_inner = $this.children('.isotope-layout-inner'),
          size = $this.find('.isotope-item-sizer').width();
          tmMasonryItemsHeightResizer(size, $this);
          isotope_inner.isotope({
            isOriginLeft: THEMEMASCOT.isLTR.check(),
            itemSelector: '.isotope-item',
            layoutMode: "masonry",
            masonry: {
              columnWidth: '.isotope-item-sizer'
            },
            filter: fselector
          });
        } else {
          var $this = $('#'+linkwith);
          var isotope_inner = $this.children('.isotope-layout-inner');
          isotope_inner.isotope({
            isOriginLeft: THEMEMASCOT.isLTR.check(),
            itemSelector: '.isotope-item',
            layoutMode: "fitRows",
            filter: fselector
          });
        }
        return false;
      });

      //isotope sorter
      $('.isotope-layout-sorter').on('click', 'a', function(e) {
        var $this = $(this);
        var $this_parent = $this.parent('div');
        $this.addClass('active').siblings().removeClass('active');

        var sortby = $this.data('sortby');
        var linkwith = $this_parent.data('link-with');
        if( sortby === "shuffle" ) {
          $('#'+linkwith).isotope('shuffle');
        } else {
          $('#'+linkwith).isotope({
            isOriginLeft: THEMEMASCOT.isLTR.check(),
            sortBy: sortby
          });
        }
        return false;
      });

    },


    TM_isotopeGridRearrange: function() {
      if ($gallery_isotope.hasClass("masonry")){
        $gallery_isotope.isotope({
          isOriginLeft: THEMEMASCOT.isLTR.check(),
          itemSelector: '.isotope-item',
          layoutMode: "masonry"
        });
      } else{
        $gallery_isotope.isotope({
          isOriginLeft: THEMEMASCOT.isLTR.check(),
          itemSelector: '.isotope-item',
          layoutMode: "fitRows"
        });
      }
    },

    TM_isotopeGridShuffle: function() {
      $gallery_isotope.isotope('shuffle');
    },

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- CountDown ------------------------------ */
    /* ---------------------------------------------------------------------- */
    TM_finalCountdown: function() {
    },
    TM_countDownTimer: function() {
      //Modern Circular
      var $timer_modern_circular = $('.final-countdown-modern-circular .countdown');
      if( $timer_modern_circular.length > 0 ) {
        $timer_modern_circular.each(function() {
          var $this = $(this);

          var borderwidth = $this.data('borderwidth');
          var bordercolor_second = $this.data('bordercolor-second');
          var bordercolor_minutes = $this.data('bordercolor-minutes');
          var bordercolor_hours = $this.data('bordercolor-hours');
          var bordercolor_days = $this.data('bordercolor-days');

          var defaults = {
            start: undefined,
            end: undefined,
            now: undefined,
            selectors: {
              value_seconds: '.clock-seconds .val',
              canvas_seconds: 'canvas-seconds',

              value_minutes: '.clock-minutes .val',
              canvas_minutes: 'canvas-minutes',

              value_hours: '.clock-hours .val',
              canvas_hours: 'canvas-hours',

              value_days: '.clock-days .val',
              canvas_days: 'canvas-days'
            },
            seconds: {
              borderColor: bordercolor_second,
              borderWidth: borderwidth
            },
            minutes: {
              borderColor: bordercolor_minutes,
              borderWidth: borderwidth
            },
            hours: {
              borderColor: bordercolor_hours,
              borderWidth: borderwidth
            },
            days: {
              borderColor: bordercolor_days,
              borderWidth: borderwidth
            }
          };
          $this.final_countdown(defaults);
        });
      }


      //Basic coupon site
      var $timer_smart_style = $('.final-countdown-smart-style .countdown-timer');
      if( $timer_smart_style.length > 0 ) {
        $timer_smart_style.each(function() {
          var $this = $(this);
          var future_date = $this.data('future-date');
          var showtime = $this.data('showtime');


          var word_hr = $this.data('word-hr');
          var word_min = $this.data('word-min');
          var word_sec = $this.data('word-sec');
          var word_days = $this.data('word-days');

          var str =   '<div class="counter">' +
                  '<span class="value">%D</span>' +
                  '<span class="label">' + word_days + '</span>' +
                '</div>' +
                '<div class="counter">' +
                  '<span class="value">%H</span>' +
                  '<span class="label">' + word_hr + '</span>' +
                '</div>' +
                '<div class="counter">' +
                  '<span class="value">%M</span>' +
                  '<span class="label">' + word_min + '</span>' +
                '</div>' +
                '<div class="counter">' +
                  '<span class="value">%S</span>' +
                  '<span class="label">' + word_sec + '</span>' +
                '</div>';

          $this.countdown(future_date, function(event) {
            var $this = $(this).html(event.strftime(str));
          });
        });
      }


      //Advanced coupon site
      var $timer_advanced_coupon = $('.final-countdown-advanced-coupon .countdown-container');
      if( $timer_advanced_coupon.length > 0 ) {
        $timer_advanced_coupon.each(function() {
          var $this = $(this);
          var future_date = $this.data('future-date');
          var showtime = $this.data('showtime');
          var word_weeks = $this.data('word-weeks');
          var word_days = $this.data('word-days');

          $this.countdown( future_date )
          .on('update.countdown', function(event) {
            if( showtime ) {
            var format = '%H:%M:%S';
            } else {
            var format = '';
            }
            if(event.offset.totalDays > 0) {
            format = '<span>%-d</span> '+word_days+' ' + format;
            }
            if(event.offset.weeks > 0) {
            format = '<span>%-w</span> '+word_weeks+' ' + format;
            }
            $(this).html(event.strftime(format));
          })
          .on('finish.countdown', function(event) {
            $(this).html('This offer has expired!')
            .parent().addClass('disabled');

          });
        });
      }


      //Basic coupon site
      var $timer_basic_coupon = $('.final-countdown-basic-coupon .countdown-container');
      if( $timer_basic_coupon.length > 0 ) {
        $timer_basic_coupon.each(function() {
          var $this = $(this);
          var future_date = $this.data('future-date');
          var showtime = $this.data('showtime');
          var word_days = $this.data('word-days');

          $this.countdown(future_date, function(event) {
            if( showtime ) {
            var hour_format = ' %H:%M:%S';
            } else {
            var hour_format = '';
            }
            $(this).html(event.strftime('<span>%D</span> '+word_days+''+hour_format));
          });
        });
      }


      //Days Offsets
      var $timer_days_offset = $('.final-countdown-days-offsets .countdown-container');
      if( $timer_days_offset.length > 0 ) {
        $timer_days_offset.each(function() {
          var $this = $(this);
          var future_date = $this.data('future-date');
          var showtime = $this.data('showtime');

          var word_hr = $this.data('word-hr');
          var word_min = $this.data('word-min');
          var word_sec = $this.data('word-sec');
          var word_days = $this.data('word-days');

          $this.countdown(future_date, function(event) {
            if( showtime ) {
            var hour_format = ' <span>%H</span> '+word_hr+' '
            + '<span>%M</span> '+word_min+' '
            + '<span>%S</span> '+word_sec+'';
            } else {
            var hour_format = '';
            }
            var $this = $(this).html(event.strftime(''
            + '<span>%D</span> '+word_days+'' + hour_format));
          });
        });
      }


      // Sum of total hours remaining
      var $timer_sum_hours_remaining = $('.final-countdown-sum-hours-remaining .countdown-container');
      if( $timer_sum_hours_remaining.length > 0 ) {
        $timer_sum_hours_remaining.each(function() {
          var $this = $(this);
          var future_date = $this.data('future-date');

          var word_hr = $this.data('word-hr');
          var word_min = $this.data('word-min');
          var word_sec = $this.data('word-sec');

          $this.countdown(future_date, function(event) {
            var totalHours = event.offset.totalDays * 24 + event.offset.hours;
            var hour_format = ' <span> ' + totalHours + '</span> '+word_hr+' '
            + '<span>%M</span> '+word_min+' '
            + '<span>%S</span> '+word_sec+'';
            $(this).html(event.strftime(hour_format));
          });
        });
      }


      //  Legacy style
      var $timer_legacy_style = $('.final-countdown-legacy-style .countdown-container');
      if( $timer_legacy_style.length > 0 ) {
        $timer_legacy_style.each(function() {
          var $this = $(this);
          var future_date = $this.data('future-date');
          var showtime = $this.data('showtime');

          var word_hr = $this.data('word-hr');
          var word_min = $this.data('word-min');
          var word_sec = $this.data('word-sec');
          var word_weeks = $this.data('word-weeks');
          var word_days = $this.data('word-days');

          $this.countdown(future_date, function(event) {
            if( showtime ) {
            var hour_format = ' <span>%H</span> '+word_hr+' '
            + '<span>%M</span> '+word_min+' '
            + '<span>%S</span> '+word_sec+'';
            } else {
            var hour_format = '';
            }
            var $this = $(this).html(event.strftime(''
            + '<span>%w</span> '+word_weeks+' '
            + '<span>%d</span> '+word_days+'' + hour_format));
          });
        });
      }


      //   Months offsets
      var $timer_months_offsets = $('.final-countdown-months-offsets .countdown-container');
      if( $timer_months_offsets.length > 0 ) {
        $timer_months_offsets.each(function() {
          var $this = $(this);
          var future_date = $this.data('future-date');
          var showtime = $this.data('showtime');

          var word_hr = $this.data('word-hr');
          var word_min = $this.data('word-min');
          var word_sec = $this.data('word-sec');
          var word_month = $this.data('word-month');
          var word_days = $this.data('word-days');

          $this.countdown(future_date, function(event) {
            if( showtime ) {
            var hour_format = ' <span>%H</span> '+word_hr+' '
            + '<span>%M</span> '+word_min+' '
            + '<span>%S</span> '+word_sec+'';
            } else {
            var hour_format = '';
            }
            var $this = $(this).html(event.strftime(''
            + '<span>%m</span> '+word_month+' '
            + '<span>%n</span> '+word_days+'' + hour_format));
          });
        });
      }


      //   Weeks offsets
      var $timer_weeks_offsets = $('.final-countdown-weeks-offsets .countdown-container');
      if( $timer_weeks_offsets.length > 0 ) {
        $timer_weeks_offsets.each(function() {
          var $this = $(this);
          var future_date = $this.data('future-date');
          var showtime = $this.data('showtime');

          var word_hr = $this.data('word-hr');
          var word_min = $this.data('word-min');
          var word_sec = $this.data('word-sec');
          var word_weeks = $this.data('word-weeks');
          var word_days = $this.data('word-days');

          $this.countdown(future_date, function(event) {
            if( showtime ) {
            var hour_format = ' <span>%H</span> '+word_hr+' '
            + '<span>%M</span> '+word_min+' '
            + '<span>%S</span> '+word_sec+'';
            } else {
            var hour_format = '';
            }
            var $this = $(this).html(event.strftime(''
            + '<span>%w</span> '+word_weeks+' '
            + '<span>%d</span> '+word_days+'' + hour_format));
          });
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------- pie chart / circle skill bar ----------------- */
    /* ---------------------------------------------------------------------- */
    TM_pieChart: function() {
      var piechart = '.tm-sc-pie-chart .pie-chart';
      var $piechart = $(piechart);
      if( $piechart.length > 0 ) {
        $piechart.appear();
        var randomNum = getRandomValue(10, 400);
        $document_body.on('appear', piechart, function() {
          var current_item = $(this);
          setTimeout(function () {
            if (!current_item.hasClass('appeared')) {
              current_item.easyPieChart({
                onStep: function(from, to, percent) {
                  $(this.el).find('.percent').text(Math.round(percent));
                }
              });
              current_item.addClass('appeared');
            }
          }, randomNum);
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------- progress bar / horizontal skill bar -------------- */
    /* ---------------------------------------------------------------------- */
    TM_progressBar: function() {
      var $progress_bar = $('.tm-sc-progress-bar');
      if( $progress_bar.length > 0 ) {
        $progress_bar.appear();
        $document_body.on('appear', '.tm-sc-progress-bar', function() {
          var current_item = $(this);
          if (!current_item.hasClass('appeared')) {
            var percentage = current_item.data('percent');
            var bar_height = current_item.data('bar-height');
            var percent = current_item.find('.percent');
            var bar_holder = current_item.find('.progress-holder');
            var bar = current_item.find('.progress-content');

            if (current_item.hasClass('progress-bar-default')) {
              tmProgressBarCounter(bar.find('span.value'), percentage);
            } else {
              tmProgressBarCounter(percent.find('span.value'), percentage);
            }

            bar.css('width', '0%').animate({'width': percentage + '%'}, 2000);

            if (current_item.hasClass('progress-bar-floating-percent')) {
              if( THEMEMASCOT.isRTL.check() ) {
                percent.css('right', '0%').animate({'right': percentage + '%'}, 2000);
              } else {
                percent.css('left', '0%').animate({'left': percentage + '%'}, 2000);
              }
            }

            if ( bar_height != '' ) {
              bar_holder.css('height', bar_height);
              bar.css('height', bar_height);
            }


            var barcolor = current_item.data('barcolor');
            bar.css('background-color', barcolor);
            current_item.addClass('appeared');
          }

        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ---------------------------- SVG Animation  -------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_SVGAnimation: function() {
      var $svg_animation = $('.tm-iconbox-icontype-svg-image');
      if( $svg_animation.length > 0 ) {
        $svg_animation.appear();
        $document_body.on('appear', '.tm-iconbox-icontype-svg-image', function() {
          var current_item = $(this);
          if (!current_item.hasClass('appeared')) {


            var type = current_item.data('svg-animation-type'),
              duration = current_item.data('svg-animation-duration'),
              durationDelay = '',
              reverse = '',
              strokeWidth = '',
              strokeColor = '',
              selector = '',
              customStyle = '',
              style = '';

            if (typeof current_item.data('svg-animation-duration-delay') !== 'undefined') {
              durationDelay = current_item.data('svg-animation-duration-delay');
            }

            if (typeof current_item.data('svg-reverse-animation') !== 'undefined') {
              reverse = current_item.data('svg-reverse-animation');
            }

            if (typeof current_item.data('svg-stroke-width') !== 'undefined') {
              strokeWidth = current_item.data('svg-stroke-width');
            }

            if (typeof current_item.data('svg-stroke-color') !== 'undefined') {
              strokeColor = current_item.data('svg-stroke-color');
            }

            var _vivus = new Vivus(current_item.find('.tm-vivus-svg-animation').attr('id'), {
              type: type,
              duration: duration,
              delay: durationDelay,
              reverseStack: reverse,
            });

            current_item.on({
                mouseenter: function () {
                   //stuff to do on mouse enter
                  _vivus.reset().play();
                },
                mouseleave: function () {
                  //stuff to do on mouse leave
                }
            });

            if (strokeWidth > 0 || strokeColor.length) {
              selector = '#' + current_item.find('.tm-vivus-svg-animation').attr('id') + ' path';
              if (strokeWidth ) {
                customStyle += 'stroke-width:' + strokeWidth + ';';
              }

              if (strokeColor.length) {
                customStyle += 'stroke:' + strokeColor + ';';
              }
            }

            if (customStyle.length) {
              style = '<style type="text/css">' + selector + '{' + customStyle + '}</style>';
            }

            if (style.length) {
              $('head').append(style);
            }

            current_item.addClass('appeared');
          }
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------ Funfact Number Counter ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_funfact: function() {
      var $animate_number = $('.animate-number');
      if( $animate_number.length > 0 ) {
        $animate_number.appear();
        var randomNum = getRandomValue(10, 400);
        $document_body.on('appear', '.animate-number', function() {
          var current_item = $(this);
          $animate_number.each(function() {
            setTimeout(function () {
              if (!current_item.hasClass('appeared')) {
                current_item.animateNumbers(current_item.attr("data-value"), true, parseInt(current_item.attr("data-animation-duration"), 10)).addClass('appeared');
              }
            }, randomNum);
          });
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- Instagram Feed ---------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_instagramFeed: function() {
      var $instagram_feed_grid = $('.instagram-feed-grid');
      if( $instagram_feed_grid.length > 0 ) {
        $instagram_feed_grid.each(function() {
          var current_div = $(this);
          var instagramFeed = new Instafeed({
            target: current_div.attr('id'),
            get: 'user',
            userId: current_div.data('userid'),
            accessToken: current_div.data('accesstoken'),
            resolution: current_div.data('resolution'),
            limit: current_div.data('limit'),
            template: '<div class="item"><figure><img src="{{image}}" /><a href="{{link}}" class="link-out" target="_blank"><i class="fa fa-link"></i></a></figure></div>',
            after: function() {
            }
          });
          instagramFeed.run();
        });
      }

      var $instagram_feed_carousel = $('.instagram-feed-carousel');
      if( $instagram_feed_carousel.length > 0 ) {
        $instagram_feed_carousel.each(function() {
          var current_div = $(this);
          var instagramFeed = new Instafeed({
            target: current_div.attr('id'),
            get: 'user',
            userId: current_div.data('userid'),
            accessToken: current_div.data('accesstoken'),
            resolution: current_div.data('resolution'),
            limit: current_div.data('limit'),
            template: '<div class="item img-fullwidth"><figure><img width="250" src="{{image}}" /><a href="{{link}}" class="link-out" target="_blank"><i class="fa fa-link"></i></a></figure></div>',
            after: function() {
              current_div.addClass("owl-carousel owl-theme").owlCarousel({
                autoplay: true,
                autoplayTimeout: 4000,
                loop: true,
                margin: 30,
                dots: false,
                nav: true,
                navText: [
                  '<i class="fas fa-arrow-left"></i>',
                  '<i class="fas fa-arrow-right"></i>'
                ],
                responsive: {
                  0: {
                    items: 1
                  },
                  768: {
                    items: 1
                  },
                  1000: {
                    items: 1
                  }
                }
              });
            }
          });
          instagramFeed.run();
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ---------------------------- Flickr Feed ----------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_jflickrfeed: function() {
      var $jflickrfeed = $(".flickr-widget .flickr-feed, .jflickrfeed");
      if( $jflickrfeed.length > 0 ) {
        $jflickrfeed.each(function() {
          var current_div = $(this);
          current_div.jflickrfeed({
            limit: 9,
            qstrings: {
              id: current_div.data('userid')
            },
            itemTemplate: '<a href="{{link}}" title="{{title}}" target="_blank"><img src="{{image_m}}" alt="{{title}}">  </a>'
          });
        });
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------- accordion & toggles ------------------------ */
    /* ---------------------------------------------------------------------- */
    TM_accordion_toggles: function() {
      var $panel_group_collapse = $('.tm-accordion');
      $panel_group_collapse.on("show.bs.collapse", function(e) {
        var $parent = e.target.parentNode;
        $($parent).siblings().removeClass("active");
        $($parent).addClass("active");
      });
      $panel_group_collapse.on("hide.bs.collapse", function(e) {
        var $parent = e.target.parentNode;
        $($parent).removeClass("active");
      });
    },

    /* ---------------------------------------------------------------------- */
    /* ------------------------------- tooltip  ----------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_tooltip: function() {
      var $tooltip = $('[data-bs-toggle="tooltip"]');
      if( $tooltip.length > 0 ) {
      }
    },

    /* ---------------------------------------------------------------------- */
    /* ---------------------------- Twitter Feed  --------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_twittie: function() {
      var $twitter_feed_list = $('.twitter-feed-list');
      if( $twitter_feed_list.length > 0 ) {
        var count = ( $twitter_feed_list.data("count") === undefined ) ? 4: $twitter_feed_list.data("count");
        var username = ( $twitter_feed_list.data("username") === undefined ) ? 'Envato': $twitter_feed_list.data("username");
        var ajaxurl = ( $twitter_feed_list.data("ajaxurl") === undefined ) ? '': $twitter_feed_list.data("ajaxurl");
        $twitter_feed_list.twittie({
          username: username,
          count: count,
          dateFormat: '%b. %d, %Y',
          template: '{{tweet}} <div class="date">{{date}}</div>',
          loadingText: 'Loading!',
          action: 'mascot_twitter_tweetie_api_action',
          apiPath: ajaxurl
        });
      }

      var $twitter_feed_carousel = $('.twitter-feed-carousel');
      if( $twitter_feed_carousel.length > 0 ) {
        var count = ( $twitter_feed_carousel.data("count") === undefined ) ? 4: $twitter_feed_carousel.data("count");
        var username = ( $twitter_feed_carousel.data("username") === undefined ) ? 'Envato': $twitter_feed_carousel.data("username");
        var ajaxurl = ( $twitter_feed_carousel.data("ajaxurl") === undefined ) ? '': $twitter_feed_carousel.data("ajaxurl");
        $twitter_feed_carousel.twittie({
          username: username,
          count: count,
          dateFormat: '%b. %d, %Y',
          template: '{{tweet}} <div class="date">{{date}}</div>',
          loadingText: 'Loading!',
          action: 'mascot_twitter_tweetie_api_action',
          apiPath: ajaxurl
        }, function() {
          var data_dots = ( $twitter_feed_carousel.data("dots") === undefined ) ? false: $twitter_feed_carousel.data("dots");
          var data_nav = ( $twitter_feed_carousel.data("nav")=== undefined ) ? false: $twitter_feed_carousel.data("nav");
          var data_duration = ( $twitter_feed_carousel.data("duration") === undefined ) ? 4000: $twitter_feed_carousel.data("duration");
          var animate_out = ( $twitter_feed_carousel.data("animateout")=== undefined ) ? '': $twitter_feed_carousel.data("animateout");
          var animate_in = ( $twitter_feed_carousel.data("animatein")=== undefined ) ? '': $twitter_feed_carousel.data("animatein");

          $twitter_feed_carousel.find('ul').addClass('owl-carousel').owlCarousel({
            autoplay: true,
            autoplayTimeout: data_duration,
            loop: true,
            items: 1,
            margin: 30,
            smartSpeed:450,
            dots: data_dots,
            nav: data_nav,
            center: true,
            animateOut: animate_out,
            animateIn: animate_in,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ],
          });
        });
      }
    }
  };

  THEMEMASCOT.slider = {

    init: function() {

      var t = setTimeout(function() {
        THEMEMASCOT.slider.TM_swiperFullscreenSlider();
        THEMEMASCOT.slider.TM_MultiScrollSlider();
        THEMEMASCOT.slider.TM_FullPageSlider();
        THEMEMASCOT.slider.TM_PagePilingSlider();
        THEMEMASCOT.slider.TM_slick();
        THEMEMASCOT.slider.TM_maximageSlider();
        THEMEMASCOT.slider.TM_bxslider();
        THEMEMASCOT.slider.TM_beforeAfterSlider();
      }, 0);

    },


    /* ---------------------------------------------------------------------- */
    /* -------------------------- Swiper Slider  ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_swiperFullscreenSlider: function() {
      var $swiper_gallery = $('.tm-sc-portfolio-swiper-gallery');
      if ( $swiper_gallery.length > 0 ) {
        var swiperAnimation = new SwiperAnimation();
        var galleryThumbs = new Swiper('.tm-sc-portfolio-swiper-gallery .swiper-gallery-thumb', {
          spaceBetween: 10,
          slidesPerView: 4,
          freeMode: true,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
        });
        var galleryTop = new Swiper('.tm-sc-portfolio-swiper-gallery .swiper-gallery-top', {
          spaceBetween: 10,
          effect: 'fade',
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          thumbs: {
            swiper: galleryThumbs
          },
          on: {
            init: function () {
              swiperAnimation.init(this).animate();
            },
            slideChange: function () {
              swiperAnimation.init(this).animate();
            }
          }
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* -------------------------- Multi Scroll Slider  ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_MultiScrollSlider: function() {
      var $multi_scrolling_slider = $('.tm-divided-multi-scrolling-slider');
      $multi_scrolling_slider.height(windowHeight).animate({opacity:1},300);
      if ( $multi_scrolling_slider.length > 0 ) {
        $("html").addClass("tm-multiscroll-enabled");

        var data_anchor_menu = ( $multi_scrolling_slider.data("anchor-menu") === undefined ) ? '': $multi_scrolling_slider.data("anchor-menu");
        var data_anchor_menu = data_anchor_menu.split(',');
        for(var i = 0; i < data_anchor_menu.length; i += 1){
          data_anchor_menu[i] = '' + $.trim(data_anchor_menu[i]);
        }

        var data_navigation = ( $multi_scrolling_slider.data("navigation") === undefined ) ? true: $multi_scrolling_slider.data("navigation");
        var data_navigationPosition = ( $multi_scrolling_slider.data("navigation-position") === undefined ) ? 'right': $multi_scrolling_slider.data("navigation-position");
        var data_navigationTooltip_show = ( $multi_scrolling_slider.data("navigation-tooltip") === undefined ) ? false: $multi_scrolling_slider.data("navigation-tooltip");

        var data_navigationTooltip = ( $multi_scrolling_slider.data("navigation-tooltips") === undefined ) ? '': $multi_scrolling_slider.data("navigation-tooltips");
        var data_navigationTooltip = data_navigationTooltip.split(',');
        for(var i = 0; i < data_navigationTooltip.length; i += 1){
          data_navigationTooltip[i] = '' + $.trim(data_navigationTooltip[i]);
        }

        var data_scrollingSpeed = ( $multi_scrolling_slider.data("scrolling-speed") === undefined ) ? 700: $multi_scrolling_slider.data("scrolling-speed");
        var data_responsiveWidth = ( $multi_scrolling_slider.data("responsive-width") === undefined ) ? 1000: $multi_scrolling_slider.data("responsive-width");
        var data_easing = ( $multi_scrolling_slider.data("easing") === undefined ) ? 'easeInQuart': $multi_scrolling_slider.data("easing");
        var data_looptop = ( $multi_scrolling_slider.data("looptop") === undefined ) ? true: $multi_scrolling_slider.data("looptop");
        var data_loopbottom = ( $multi_scrolling_slider.data("loopbottom") === undefined ) ? true: $multi_scrolling_slider.data("loopbottom");

        var navigationTooltips = '';
        if( data_navigationTooltip_show === true ) {
          navigationTooltips = data_navigationTooltip;
        }

        $( $multi_scrolling_slider ).multiscroll({
          navigation: data_navigation,
          scrollingSpeed: data_scrollingSpeed,
          anchors: data_anchor_menu,
          navigationTooltips: navigationTooltips,
          menu: '#multi-scrolling-menu',
          navigationPosition: data_navigationPosition,
          loopTop: data_looptop,
          loopBottom: data_loopbottom,
          easing: data_easing,
          responsiveWidth: data_responsiveWidth,
          responsiveExpandKey: 'QU5ZX2pHemNtVnpjRzl1YzJsMlpVVjRjR0Z1WkE9PTVuNw==',
          responsiveExpand: true,
          //events
          onLeave: function(index, nextIndex, direction){
            $.force_appear();
          },
          afterLoad: function(anchorLink, index){
            $.force_appear();
          },
          afterRender: function(){
            $.force_appear();
          },
          afterResize: function(){
            $.force_appear();
          },
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* -------------------------- Full Page Slider  ------------------------- */
    /* ---------------------------------------------------------------------- */
    TM_FullPageSlider: function() {
      var $full_page_slider = $('.tm-full-page-slider');
      $full_page_slider.height(windowHeight).animate({opacity:1},300);
      if ( $full_page_slider.length > 0 ) {

        var data_anchor_menu = ( $full_page_slider.data("anchor-menu") === undefined ) ? '': $full_page_slider.data("anchor-menu");
        var data_anchor_menu = data_anchor_menu.split(',');
        for(var i = 0; i < data_anchor_menu.length; i += 1){
          data_anchor_menu[i] = '' + $.trim(data_anchor_menu[i]);
        }

        var data_navigation = ( $full_page_slider.data("navigation") === undefined ) ? true: $full_page_slider.data("navigation");
        var data_navigationPosition = ( $full_page_slider.data("navigation-position") === undefined ) ? 'right': $full_page_slider.data("navigation-position");
        var data_navigationTooltip_show = ( $full_page_slider.data("navigation-tooltip") === undefined ) ? false: $full_page_slider.data("navigation-tooltip");

        var data_navigationTooltip = ( $full_page_slider.data("navigation-tooltips") === undefined ) ? '': $full_page_slider.data("navigation-tooltips");
        var data_navigationTooltip = data_navigationTooltip.split(',');
        for(var i = 0; i < data_navigationTooltip.length; i += 1){
          data_navigationTooltip[i] = '' + $.trim(data_navigationTooltip[i]);
        }

        var data_slidesNavigation = ( $full_page_slider.data("horizontal-navigation") === undefined ) ? true: $full_page_slider.data("horizontal-navigation");
        var data_scrollingSpeed = ( $full_page_slider.data("scrolling-speed") === undefined ) ? 700: $full_page_slider.data("scrolling-speed");
        var data_responsiveWidth = ( $full_page_slider.data("responsive-width") === undefined ) ? 1000: $full_page_slider.data("responsive-width");
        var data_easing = ( $full_page_slider.data("easing") === undefined ) ? 'easeInOutCubic': $full_page_slider.data("easing");
        var data_looptop = ( $full_page_slider.data("looptop") === undefined ) ? true: $full_page_slider.data("looptop");
        var data_loopbottom = ( $full_page_slider.data("loopbottom") === undefined ) ? true: $full_page_slider.data("loopbottom");

        var navigationTooltips = '';
        if( data_navigationTooltip_show === true ) {
          navigationTooltips = data_navigationTooltip;
        }

        $( $full_page_slider ).fullpage({
          navigation: data_navigation,
          anchors: data_anchor_menu,
          navigationTooltips: navigationTooltips,
          menu: '#tm-full-page-menu',
          scrollingSpeed: data_scrollingSpeed,
          navigationPosition: data_navigationPosition,
          loopTop: data_looptop,
          loopBottom: data_loopbottom,
          easing: data_easing,
          scrollOverflow: true,
          slidesNavigation: data_slidesNavigation,
          responsiveWidth: data_responsiveWidth,
          //events
          onLeave: function(origin, destination, direction){
            $.force_appear();
          },
          afterLoad: function(origin, destination, direction){
            $.force_appear();
          },
          afterRender: function(){
            $.force_appear();
          },
          afterResize: function(width, height){
            $.force_appear();
          },
          afterResponsive: function(isResponsive){
          }
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ------------------------- Page Piling Slider  ------------------------ */
    /* ---------------------------------------------------------------------- */
    TM_PagePilingSlider: function() {
      var $page_piling_slider = $('.tm-page-piling-slider');
      $page_piling_slider.height(windowHeight).animate({opacity:1},300);
      if ( $page_piling_slider.length > 0 ) {
        $("html").addClass("tm-pagepiling-enabled");

        var data_anchor_menu = ( $page_piling_slider.data("anchor-menu") === undefined ) ? '': $page_piling_slider.data("anchor-menu");
        var data_anchor_menu = data_anchor_menu.split(',');
        for(var i = 0; i < data_anchor_menu.length; i += 1){
          data_anchor_menu[i] = '' + $.trim(data_anchor_menu[i]);
        }

        var data_navigation = ( $page_piling_slider.data("navigation") === undefined ) ? true: $page_piling_slider.data("navigation");
        var data_navigationPosition = ( $page_piling_slider.data("navigation-position") === undefined ) ? 'right': $page_piling_slider.data("navigation-position");
        var data_navigationTooltip_show = ( $page_piling_slider.data("navigation-tooltip") === undefined ) ? false: $page_piling_slider.data("navigation-tooltip");

        var data_navigationTooltip = ( $page_piling_slider.data("navigation-tooltips") === undefined ) ? '': $page_piling_slider.data("navigation-tooltips");
        var data_navigationTooltip = data_navigationTooltip.split(',');
        for(var i = 0; i < data_navigationTooltip.length; i += 1){
          data_navigationTooltip[i] = '' + $.trim(data_navigationTooltip[i]);
        }

        var data_scrollingSpeed = ( $page_piling_slider.data("scrolling-speed") === undefined ) ? 700: $page_piling_slider.data("scrolling-speed");
        var data_scrollingDirection = ( $page_piling_slider.data("scrolling-direction") === undefined ) ? 'vertical': $page_piling_slider.data("scrolling-direction");
        var data_easing = ( $page_piling_slider.data("easing") === undefined ) ? 'easeInOutCubic': $page_piling_slider.data("easing");
        var data_looptop = ( $page_piling_slider.data("looptop") === undefined ) ? true: $page_piling_slider.data("looptop");
        var data_loopbottom = ( $page_piling_slider.data("loopbottom") === undefined ) ? true: $page_piling_slider.data("loopbottom");

        var navigationTooltips = '';
        if( data_navigationTooltip_show === true ) {
          navigationTooltips = data_navigationTooltip;
        }

        $( $page_piling_slider ).pagepiling({
          direction: data_scrollingDirection,
          anchors: data_anchor_menu,
          menu: '#tm-page-piling-menu',
          scrollingSpeed: data_scrollingSpeed,
          loopTop: data_looptop,
          loopBottom: data_loopbottom,
          easing: data_easing,
          navigation: {
            'position': data_navigationPosition,
            'tooltips': navigationTooltips
          },
          //events
          onLeave: function(index, nextIndex, direction){
            $.force_appear();
          },
          afterLoad: function(anchorLink, index){
            $.force_appear();
          },
          afterRender: function(){
            $.force_appear();
          },
        });
        $window.resize(function(){
          var height = $window.height();
          $page_piling_slider.css('height', height);
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* -------------------------- Typed Text Carousel  ---------------------- */
    /* ---------------------------------------------------------------------- */
    TM_typedAnimation: function() {
      var $typed_text_carousel = $('.typed-text-carousel');
      if ( $typed_text_carousel.length > 0 ) {
        $typed_text_carousel.each(function() {
          var string_1 = $(this).find('span:first-child').text();
          var string_2 = $(this).find('span:nth-child(2)').text();
          var string_3 = $(this).find('span:nth-child(3)').text();
          var str = '';
          var $this = $(this);
          if (!string_2.trim() || !string_3.trim()) {
            str = [string_1];
          }
          if (!string_3.trim() && string_2.length) {
            str = [string_1, string_2];
          }
          if (string_1.length && string_2.length && string_3.length) {
            str = [string_1, string_2, string_3];
          }
          var speed = $(this).data('speed');
          var back_delay = $(this).data('back_delay');
          var loop = $(this).data('loop');
          $(this).typed({
            strings: str,
            typeSpeed: speed,
            backSpeed: 0,
            backDelay: back_delay,
            cursorChar: "|",
            loop: loop,
            contentType: 'text',
            loopCount: false
          });
        });
      }
    },



    /* ---------------------------------------------------------------------- */
    /* -------------------------------- Slick Carousel  --------------------- */
    /* ---------------------------------------------------------------------- */
    TM_slick: function() {
      var $slick_carousel_1col = $('.slick-carousel-1col');
      if ( $slick_carousel_1col.length > 0 ) {
        $slick_carousel_1col.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav") === undefined ) ? false: $this.data("nav");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_duration = ( $this.data("duration") === undefined ) ? 3000: $this.data("duration");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");

          var items_desktop = 2;
          var items_laptop = ( $this.data("laptop") === undefined ) ? 2: $this.data("laptop");
          var items_tablet = ( $this.data("tablet") === undefined ) ? 2: $this.data("tablet");

          $this.slick({
            infinite: data_loop,
            autoplay: data_autoplay,
            autoplaySpeed: data_duration,
            slidesToShow : items_desktop,
            arrows: data_nav,
            dots: data_dots,
            dotsClass: 'tm-slick-dots',
            adaptiveHeight: true,
            easing:'easeOutCubic',
            prevArrow: '<span class="tm-slick-prev tm-prev-icon"><i class="fas fa-arrow-left"></i></span>',
            nextArrow: '<span class="tm-slick-next tm-next-icon"><i class="fas fa-arrow-right"></i></span>',
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          });
        });
      }


      var $slick_thumbnail_slider = $('.slick-thumbnail-slider');
      if ( $slick_thumbnail_slider.length > 0 ) {
        $slick_thumbnail_slider.each(function() {
          var $this = $(this);
          var id =  $this.attr('id');
          $this.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.slider-nav-'+id
          });

          $('.slider-nav-'+id).slick({
            slidesToShow: 7,
            slidesToScroll: 1,
            asNavFor: $this,
            dots: false,
            centerMode: false,
            focusOnSelect: true
          });

        });
      }
    },



    /* ---------------------------------------------------------------------- */
    /* -------------------------------- Owl Carousel  ----------------------- */
    /* ---------------------------------------------------------------------- */
    TM_owlCarousel: function() {
      var $owl_thumb_carousel = $('.tm-owl-thumb-carousel');
      if ( $owl_thumb_carousel.length > 0 ) {
        if(!$owl_thumb_carousel.hasClass("owl-carousel")){
          $owl_thumb_carousel.addClass("owl-carousel owl-theme");
        }
        $owl_thumb_carousel.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav") === undefined ) ? false: $this.data("nav");
          var data_duration = ( $this.data("duration") === undefined ) ? 4000: $this.data("duration");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");

          $this.owlCarousel({
            // Enable thumbnails
            thumbs: true,
            // When only using images in your slide (like the demo) use this option to dynamicly create thumbnails without using the attribute data-thumb.
            thumbImage: false,
            // Enable this if you have pre-rendered thumbnails in your html instead of letting this plugin generate them. This is recommended as it will prevent FOUC
            thumbsPrerendered: true,
            // Class that will be used on the thumbnail container
            thumbContainerClass: 'tm-owl-thumbs',
            // Class that will be used on the thumbnail item's
            thumbItemClass: 'tm-owl-thumb-item',



            rtl: THEMEMASCOT.isRTL.check(),
            autoplay: data_autoplay,
            autoplayTimeout: data_duration,
            autoHeight: true,
            responsiveClass: true,
            loop: data_loop,
            items: 1,
            dots: data_dots,
            nav: data_nav,
            center: true,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ]
          });
        });
      }


      var $owl_carousel_1col = $('.tm-owl-carousel-1col');
      if ( $owl_carousel_1col.length > 0 ) {
        if(!$owl_carousel_1col.hasClass("owl-carousel")){
          $owl_carousel_1col.addClass("owl-carousel owl-theme");
        }
        $owl_carousel_1col.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav") === undefined ) ? false: $this.data("nav");
          var data_duration = ( $this.data("duration") === undefined ) ? 4000: $this.data("duration");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");

          $this.owlCarousel({
            rtl: THEMEMASCOT.isRTL.check(),
            autoplay: data_autoplay,
            autoplayTimeout: data_duration,
            autoHeight: true,
            responsiveClass: true,
            loop: data_loop,
            items: 1,
            dots: data_dots,
            nav: data_nav,
            center: true,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ]
          });
        });
      }

      var $owl_carousel_2col = $('.tm-owl-carousel-2col');
      if ( $owl_carousel_2col.length > 0 ) {
        if(!$owl_carousel_2col.hasClass("owl-carousel")){
          $owl_carousel_2col.addClass("owl-carousel owl-theme");
        }
        $owl_carousel_2col.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav")=== undefined ) ? false: $this.data("nav");
          var data_duration = ( $this.data("duration") === undefined ) ? 4000: $this.data("duration");
          var data_smartspeed = ( $this.data("smartspeed") === undefined ) ? 300: $this.data("smartspeed");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");
          var data_stagePadding = ( $this.data("stagepadding") === undefined ) ? 0: $this.data("stagepadding");
          var data_center = ( $this.data("center") === undefined ) ? false: $this.data("center");

          var items_desktop = 2;
          var items_laptop = ( $this.data("laptop") === undefined ) ? 2: $this.data("laptop");
          var items_tablet = ( $this.data("tablet") === undefined ) ? 2: $this.data("tablet");

          $this.owlCarousel({
            rtl: THEMEMASCOT.isRTL.check(),
            autoplay: data_autoplay,
            autoplayTimeout: data_duration,
            smartSpeed: data_smartspeed,
            autoHeight: true,
            responsiveClass: true,
            loop: data_loop,
            items: 2,
            margin: data_margin,
            stagePadding: data_stagePadding,
            dots: data_dots,
            nav: data_nav,
            center: data_center,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ],
            responsive: {
              0: {
                items: 1,
                stagePadding: 0,
              },
              768: {
                items: items_tablet,
                stagePadding: 0,
              },
              1025: {
                items: items_laptop
              },
              1441: {
                items: items_desktop
              }
            }
          });
        });
      }

      var $owl_carousel_3col = $('.tm-owl-carousel-3col');
      if ( $owl_carousel_3col.length > 0 ) {
        if(!$owl_carousel_3col.hasClass("owl-carousel")){
          $owl_carousel_3col.addClass("owl-carousel owl-theme");
        }
        $owl_carousel_3col.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav")=== undefined ) ? false: $this.data("nav");
          var data_duration = ( $this.data("duration") === undefined ) ? 4000: $this.data("duration");
          var data_smartspeed = ( $this.data("smartspeed") === undefined ) ? 300: $this.data("smartspeed");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");
          var data_stagePadding = ( $this.data("stagepadding") === undefined ) ? 0: $this.data("stagepadding");
          var data_center = ( $this.data("center") === undefined ) ? false: $this.data("center");

          var items_desktop = 3;
          var items_laptop = ( $this.data("laptop") === undefined ) ? 2: $this.data("laptop");
          var items_tablet = ( $this.data("tablet") === undefined ) ? 2: $this.data("tablet");

          $this.owlCarousel({
            rtl: THEMEMASCOT.isRTL.check(),
            autoplay: data_autoplay,
            autoplayTimeout: data_duration,
            smartSpeed: data_smartspeed,
            autoHeight: true,
            responsiveClass: true,
            loop: data_loop,
            items: 3,
            margin: data_margin,
            stagePadding: data_stagePadding,
            dots: data_dots,
            nav: data_nav,
            center: data_center,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ],
            responsive: {
              0: {
                items: 1,
                stagePadding: 0,
              },
              768: {
                items: items_tablet,
                stagePadding: 0,
              },
              1025: {
                items: items_laptop
              },
              1441: {
                items: items_desktop
              }
            }
          });
        });
      }


      var $owl_carousel_4col = $('.tm-owl-carousel-4col');
      if ( $owl_carousel_4col.length > 0 ) {
        if(!$owl_carousel_4col.hasClass("owl-carousel")){
          $owl_carousel_4col.addClass("owl-carousel owl-theme");
        }
        $owl_carousel_4col.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav")=== undefined ) ? false: $this.data("nav");
          var data_duration = ( $this.data("duration") === undefined ) ? 4000: $this.data("duration");
          var data_smartspeed = ( $this.data("smartspeed") === undefined ) ? 300: $this.data("smartspeed");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");
          var data_stagePadding = ( $this.data("stagepadding") === undefined ) ? 0: $this.data("stagepadding");
          var data_center = ( $this.data("center") === undefined ) ? false: $this.data("center");

          var items_desktop = 4;
          var items_laptop = ( $this.data("laptop") === undefined ) ? 3: $this.data("laptop");
          var items_tablet = ( $this.data("tablet") === undefined ) ? 2: $this.data("tablet");

          $this.owlCarousel({
            rtl: THEMEMASCOT.isRTL.check(),
            autoplay: data_autoplay,
            autoplayTimeout: data_duration,
            smartSpeed: data_smartspeed,
            autoHeight: true,
            responsiveClass: true,
            loop: data_loop,
            items: 4,
            margin: data_margin,
            stagePadding: data_stagePadding,
            dots: data_dots,
            nav: data_nav,
            center: data_center,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ],
            responsive: {
              0: {
                items: 1,
                stagePadding: 0,
              },
              768: {
                items: items_tablet,
                stagePadding: 0,
              },
              1025: {
                items: items_laptop
              },
              1441: {
                items: items_desktop
              }
            }
          });
        });
      }

      var $owl_carousel_5col = $('.tm-owl-carousel-5col');
      if ( $owl_carousel_5col.length > 0 ) {
        if(!$owl_carousel_5col.hasClass("owl-carousel")){
          $owl_carousel_5col.addClass("owl-carousel owl-theme");
        }
        $owl_carousel_5col.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav")=== undefined ) ? false: $this.data("nav");
          var data_duration = ( $this.data("duration") === undefined ) ? 4000: $this.data("duration");
          var data_smartspeed = ( $this.data("smartspeed") === undefined ) ? 300: $this.data("smartspeed");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");
          var data_stagePadding = ( $this.data("stagepadding") === undefined ) ? 0: $this.data("stagepadding");
          var data_center = ( $this.data("center") === undefined ) ? false: $this.data("center");

          var items_desktop = 5;
          var items_laptop = ( $this.data("laptop") === undefined ) ? 4: $this.data("laptop");
          var items_tablet = ( $this.data("tablet") === undefined ) ? 2: $this.data("tablet");

          $this.owlCarousel({
            rtl: THEMEMASCOT.isRTL.check(),
            autoplay: data_autoplay,
            autoplayTimeout: data_duration,
            smartSpeed: data_smartspeed,
            autoHeight: true,
            responsiveClass: true,
            loop: data_loop,
            items: 5,
            margin: data_margin,
            stagePadding: data_stagePadding,
            dots: data_dots,
            nav: data_nav,
            center: data_center,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ],
            responsive: {
              0: {
                items: 1,
                stagePadding: 0,
              },
              768: {
                items: items_tablet,
                stagePadding: 0,
              },
              1025: {
                items: items_laptop
              },
              1441: {
                items: items_desktop
              }
            }
          });
        });
      }

      var $owl_carousel_6col = $('.tm-owl-carousel-6col');
      if ( $owl_carousel_6col.length > 0 ) {
        if(!$owl_carousel_6col.hasClass("owl-carousel")){
          $owl_carousel_6col.addClass("owl-carousel owl-theme");
        }
        $owl_carousel_6col.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav")=== undefined ) ? false: $this.data("nav");
          var data_duration = ( $this.data("duration") === undefined ) ? 4000: $this.data("duration");
          var data_smartspeed = ( $this.data("smartspeed") === undefined ) ? 300: $this.data("smartspeed");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");
          var data_stagePadding = ( $this.data("stagepadding") === undefined ) ? 0: $this.data("stagepadding");
          var data_center = ( $this.data("center") === undefined ) ? false: $this.data("center");

          var items_desktop = 6;
          var items_laptop = ( $this.data("laptop") === undefined ) ? 4: $this.data("laptop");
          var items_tablet = ( $this.data("tablet") === undefined ) ? 2: $this.data("tablet");

          $this.owlCarousel({
            rtl: THEMEMASCOT.isRTL.check(),
            autoplay: data_autoplay,
            autoplayTimeout: data_duration,
            smartSpeed: data_smartspeed,
            autoHeight: true,
            responsiveClass: true,
            loop: data_loop,
            items: 6,
            margin: data_margin,
            stagePadding: data_stagePadding,
            dots: data_dots,
            nav: data_nav,
            center: data_center,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ],
            responsive: {
              0: {
                items: 1,
                stagePadding: 0,
              },
              768: {
                items: items_tablet,
                stagePadding: 0,
              },
              1025: {
                items: items_laptop
              },
              1441: {
                items: items_desktop
              }
            }
          });
        });
      }

      var $owl_carousel_7col = $('.tm-owl-carousel-7col');
      if ( $owl_carousel_7col.length > 0 ) {
        if(!$owl_carousel_7col.hasClass("owl-carousel")){
          $owl_carousel_7col.addClass("owl-carousel owl-theme");
        }
        $owl_carousel_7col.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav")=== undefined ) ? false: $this.data("nav");
          var data_duration = ( $this.data("duration") === undefined ) ? 4000: $this.data("duration");
          var data_smartspeed = ( $this.data("smartspeed") === undefined ) ? 300: $this.data("smartspeed");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");
          var data_stagePadding = ( $this.data("stagepadding") === undefined ) ? 0: $this.data("stagepadding");
          var data_center = ( $this.data("center") === undefined ) ? false: $this.data("center");

          var items_desktop = 7;
          var items_laptop = ( $this.data("laptop") === undefined ) ? 5: $this.data("laptop");
          var items_tablet = ( $this.data("tablet") === undefined ) ? 3: $this.data("tablet");

          $this.owlCarousel({
            rtl: THEMEMASCOT.isRTL.check(),
            autoplay: data_autoplay,
            autoplayTimeout: data_duration,
            smartSpeed: data_smartspeed,
            autoHeight: true,
            responsiveClass: true,
            loop: data_loop,
            items: 7,
            margin: data_margin,
            stagePadding: data_stagePadding,
            dots: data_dots,
            nav: data_nav,
            center: data_center,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ],
            responsive: {
              0: {
                items: 1,
                stagePadding: 0,
              },
              768: {
                items: items_tablet,
                stagePadding: 0,
              },
              1025: {
                items: items_laptop
              },
              1441: {
                items: items_desktop
              }
            }
          });
        });
      }

      var $owl_carousel_8col = $('.tm-owl-carousel-8col');
      if ( $owl_carousel_8col.length > 0 ) {
        if(!$owl_carousel_8col.hasClass("owl-carousel")){
          $owl_carousel_8col.addClass("owl-carousel owl-theme");
        }
        $owl_carousel_8col.each(function() {
          var $this = $(this);
          var data_dots = ( $this.data("dots") === undefined ) ? false: $this.data("dots");
          var data_nav = ( $this.data("nav")=== undefined ) ? false: $this.data("nav");
          var data_duration = ( $this.data("duration") === undefined ) ? 4000: $this.data("duration");
          var data_smartspeed = ( $this.data("smartspeed") === undefined ) ? 300: $this.data("smartspeed");
          var data_autoplay = ( $this.data("autoplay") === undefined ) ? false: $this.data("autoplay");
          var data_loop = ( $this.data("loop") === undefined ) ? true: $this.data("loop");
          var data_margin = ( $this.data("margin") === undefined ) ? 30: $this.data("margin");
          var data_stagePadding = ( $this.data("stagepadding") === undefined ) ? 0: $this.data("stagepadding");
          var data_center = ( $this.data("center") === undefined ) ? false: $this.data("center");

          var items_desktop = 8;
          var items_laptop = ( $this.data("laptop") === undefined ) ? 6: $this.data("laptop");
          var items_tablet = ( $this.data("tablet") === undefined ) ? 4: $this.data("tablet");

          $this.owlCarousel({
            rtl: THEMEMASCOT.isRTL.check(),
            autoplay: data_autoplay,
            autoplayTimeout: data_duration,
            smartSpeed: data_smartspeed,
            autoHeight: true,
            responsiveClass: true,
            loop: data_loop,
            items: 8,
            margin: data_margin,
            stagePadding: data_stagePadding,
            dots: data_dots,
            nav: data_nav,
            center: data_center,
            navText: [
              '<i class="fas fa-arrow-left"></i>',
              '<i class="fas fa-arrow-right"></i>'
            ],
            responsive: {
              0: {
                items: 1,
                stagePadding: 0,
              },
              768: {
                items: items_tablet,
                stagePadding: 0,
              },
              1025: {
                items: items_laptop
              },
              1441: {
                items: items_desktop
              }
            }
          });
        });
      }


      /* animate filter */
      var owlAnimateFilter = function(even) {
        $(this)
        .addClass('__loading')
        .delay(70 * $(this).parent().index())
        .queue(function() {
          $(this).dequeue().removeClass('__loading')
        })
      }

      $('.carousel-layout-filter').on('click', 'a', function(e) {
        e.preventDefault();
        var $this = $(this);

        var $this_parent = $this.parent('div');

        $this.addClass('active').siblings().removeClass('active');

        var filter_data = $this.data('filter');
        var linkwith = $this_parent.data('link-with');

        /* Filter */
        $('#'+linkwith).owlFilter(filter_data, function(_owl) {
          $(_owl).find('.tm-carousel-item').each(owlAnimateFilter);
        });
      })


      //full height owl slider
      var $portfolio_full_height_slider = $('.tm-sc-portfolio-full-height-slider');
      if( $portfolio_full_height_slider.length > 0 ) {
        var col = $portfolio_full_height_slider.find('.full-height-slider-inner').data('col');

        var owl_carousel;
        if(col==2) {
          owl_carousel = $owl_carousel_2col;
        } else if(col==3) {
          owl_carousel = $owl_carousel_3col;
        } else if(col==4) {
          owl_carousel = $owl_carousel_4col;
        } else if(col==5) {
          owl_carousel = $owl_carousel_5col;
        } else if(col==6) {
          owl_carousel = $owl_carousel_6col;
        }

        owl_carousel.on('mousewheel', '.owl-stage', function (e) {
          if (e.deltaY>0) {
            owl_carousel.trigger('next.owl');
          } else {
            owl_carousel.trigger('prev.owl');
          }
          e.preventDefault();
        });
      }

    },


    /* ---------------------------------------------------------------------- */
    /* ---------- maximage Fullscreen Parallax Background Slider  ----------- */
    /* ---------------------------------------------------------------------- */
    TM_maximageSlider: function() {
      var $maximage_slider = $('#maximage');
      if( $maximage_slider.length > 0 ) {
        $maximage_slider.each(function() {
          $(this).maximage({
            cycleOptions: {
              fx: 'fade',
              speed: 1500,
              prev: '.img-prev',
              next: '.img-next'
            }
          });
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ----------------------------- BxSlider  ------------------------------ */
    /* ---------------------------------------------------------------------- */
    TM_bxslider: function() {
      var $bxslider = $('.bxslider');
      if( $bxslider.length > 0 ) {
        $bxslider.each(function() {
          var $this = $(this);
          $this.bxSlider({
            mode: 'vertical',
            minSlides: ( $this.data("minslides") === undefined ) ? 2: $this.data("minslides"),
            slideMargin: 20,
            touchEnabled: ( $this.data("touchenabled") === undefined ) ? false: $this.data("touchenabled"),
            pager: false,
            auto: ( $this.data("autoplay") === undefined ) ? true: $this.data("autoplay"),
            prevText: '<i class="fa fa-angle-left"></i>',
            nextText: '<i class="fa fa-angle-right"></i>'
          });
        });
      }

      if ($('.testimonials-circle-carousel').length) {
        $('.testimonials-circle-carousel').bxSlider({
          auto: true,
          controls: true,
          nextText: '<i class="opins-icon-right"></i>',
          prevText: '<i class="opins-icon-left"></i>',
          pause: 5000,
          speed: 500,
          pager: true,
          pagerCustom: '.testimonials-slider-pager-one, .testimonials-slider-pager-two'
        });
      }
    },


    /* ---------------------------------------------------------------------- */
    /* ------------------------ Before After Slider  ------------------------ */
    /* ---------------------------------------------------------------------- */
    TM_beforeAfterSlider: function() {
      var $before_after_slider = $('.twentytwenty-container');
      if ( $.isFunction($.fn.twentytwenty) ) {
        if( $before_after_slider.length > 0 ) {
          $before_after_slider.each(function() {
            var $this = $(this);
            var data_offset_pct = ( $this.data("offset-percent") === undefined ) ? 0.5: $this.data("offset-percent");
            var data_orientation = ( $this.data("orientation") === undefined ) ? 'horizontal': $this.data("orientation");
            var data_before_label = ( $this.data("before-label") === undefined ) ? 'Before': $this.data("before-label");
            var data_after_label = ( $this.data("after-label") === undefined ) ? 'After': $this.data("after-label");
            var data_no_overlay = ( $this.data("no-overlay") === undefined ) ? true: $this.data("no-overlay");
            $this.twentytwenty({
              default_offset_pct: data_offset_pct, // How much of the before image is visible when the page loads
              orientation: data_orientation, // Orientation of the before and after images ('horizontal' or 'vertical')
              before_label: data_before_label, // Set a custom before label
              after_label: data_after_label, // Set a custom after label
              no_overlay: data_no_overlay //Do not show the overlay with before and after
            });
          });
        }
      }
    }
  };


  /* ---------------------------------------------------------------------- */
  /* ---------- document ready, window load, scroll and resize ------------ */
  /* ---------------------------------------------------------------------- */
  //document ready
  THEMEMASCOT.documentOnReady = {
    init: function() {
      THEMEMASCOT.hot.init();
      THEMEMASCOT.initialize.init();
      THEMEMASCOT.header.init();
      THEMEMASCOT.slider.init();
      THEMEMASCOT.widget.init();
      THEMEMASCOT.windowOnscroll.init();
    }
  };

  //window on load
  THEMEMASCOT.windowOnLoad = {
    init: function() {
      var t = setTimeout(function() {
        THEMEMASCOT.initialize.TM_preLoaderOnLoad();
        THEMEMASCOT.widget.TM_twittie();
        THEMEMASCOT.initialize.TM_stickySidebar();
        THEMEMASCOT.initialize.TM_stickInParent();
        THEMEMASCOT.initialize.TM_stickInParentShop();
        THEMEMASCOT.initialize.TM_fitVids();
        THEMEMASCOT.slider.TM_owlCarousel();
      }, 0);
      var tdelay = setTimeout(function() {
        THEMEMASCOT.widget.TM_masonryIsotope();
      }, 400);
      $window.trigger("scroll");
      $window.trigger("resize");
    }
  };

  //window on scroll
  THEMEMASCOT.windowOnscroll = {
    init: function() {
      $window.on( 'scroll', function(){
        THEMEMASCOT.header.TM_scroolToTop();
        THEMEMASCOT.header.TM_activateMenuItemOnReach();
        THEMEMASCOT.header.TM_topnavAnimate();
      });
    }
  };

  //window on resize
  THEMEMASCOT.windowOnResize = {
    init: function() {
      var t = setTimeout(function() {
        THEMEMASCOT.initialize.TM_resizeFullscreen();
        THEMEMASCOT.header.TM_wpadminbarInMobile();
        THEMEMASCOT.header.TM_TopNav_Dropdown_Position();
        THEMEMASCOT.header.TM_verticalNavHeaderPadding();
        THEMEMASCOT.initialize.TM_stickySidebar();
        THEMEMASCOT.initialize.TM_stickInParent();
        THEMEMASCOT.initialize.TM_stickInParentShop();
        THEMEMASCOT.header.TM_navLocalScorll();
        THEMEMASCOT.initialize.TM_fixedFooter();
        THEMEMASCOT.widget.TM_masonryIsotope();
        THEMEMASCOT.initialize.TM_equalHeightDivs();
        THEMEMASCOT.header.TM_HeaderTopElementorSticky();
      }, 400);
    }
  };


  THEMEMASCOT.header.TM_menuzord();


  /* ---------------------------------------------------------------------- */
  /* ---------------------------- Call Functions -------------------------- */
  /* ---------------------------------------------------------------------- */
  $document.ready(
    THEMEMASCOT.documentOnReady.init
  );
  $window.on('load',
    THEMEMASCOT.windowOnLoad.init
  );
  $window.on('resize',
    THEMEMASCOT.windowOnResize.init
  );

  //call function before document ready
  THEMEMASCOT.initialize.TM_preLoaderClickDisable();



})(jQuery);