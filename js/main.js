'use strict'

let docWidth = document.body.clientWidth

const BlockScroll = {
    open: function () {
        setTimeout(function () {

            if (!document.body.hasAttribute('data-body-scroll-fix')) {
                let scrollPosition = window.pageYOffset || document.documentElement.scrollTop; // Получаем позицию прокрутки

                document.body.setAttribute('data-body-scroll-fix', scrollPosition); // Cтавим атрибут со значением прокрутки
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = '-' + scrollPosition + 'px';
                document.body.style.left = '0';
                document.body.style.right = '0';
                if ($('body').height() < $(window).height()) {
                    /*   console.log('меньше') */
                    document.body.style.bottom = '0';
                }
                /* if ($('header').) */
            }
            // if (jQuery('.header-menu.open').length && docWidth < 1200) { //новое
            //     menuopen = true
            // }

        }, 10);
    },
    close: function () {
        if (document.body.hasAttribute('data-body-scroll-fix')) {

            let scrollPosition = document.body.getAttribute('data-body-scroll-fix'); // Получаем позицию прокрутки из атрибута

            document.body.removeAttribute('data-body-scroll-fix'); // Удаляем атрибут
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            window.scroll(0, scrollPosition); // Прокручиваем на полученное из атрибута значение
        }
    }
}

jQuery(document).ready(function ($) {

    // Инициализация слайдера "Больше возможностей"
    const InitSliderMore = {
        defaultsOptions: {
            slidesVisible: 3,
            slidesGroup: 1,
            SpaceBetweenPx: 40,
            windowWidth: document.body.clientWidth
        },
        renderSizeSlides: function (sliderContainer) {
            const slides = sliderContainer.find('.more-possibilities-slide')
            slides.css({ 'min-height': '' })
            let MaxItemHeight = 0
            $.each(slides, function () {
                if ($(this).innerHeight() >= MaxItemHeight) {
                    MaxItemHeight = $(this).innerHeight()
                }
            })
            // console.log(MaxItemHeight)
            slides.css({ 'min-height': MaxItemHeight + 'px' })

        },
        init: function (options) {
            const $thisObj = this
            var options = $.extend(this.defaultsOptions, options)
            //console.log(options)
            const sliderContainer = options.sliderWrapper.find('.more-possibilities-slider'),
                sliderBtnPrev = options.sliderWrapper.find('.swiper-prev'),
                sliderBtnNext = options.sliderWrapper.find('.swiper-next'),
                sliderPagination = options.sliderWrapper.find('.swiper-pagination')
            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                slidesPerGroup: options.slidesGroup,
                grabCursor: true,
                spaceBetween: options.SpaceBetweenPx,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                navigation: {
                    nextEl: sliderBtnNext,
                    prevEl: sliderBtnPrev,
                    disabledClass: "disabled",
                },
                pagination: {
                    clickable: true,
                    type: 'bullets',
                    el: sliderPagination
                },
                breakpoints: {
                    // when window width is >= 320px
                    767: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                        //   spaceBetween: 20
                    },
                    // when window width is >= 480px
                    1199: {
                        slidesPerView: 2,
                        // slidesPerGroup: 2
                        //   spaceBetween: 30
                    },
                    // when window width is >= 640px
                    /*  1200: {
                         slidesPerView: 4,
                         slidesPerGroup: options.countPerView,
                         //   spaceBetween: 40
                     } */
                },
                on: {
                    init: function () {
                        $thisObj.renderSizeSlides(sliderContainer)
                    },
                    resize: function () {
                        $thisObj.renderSizeSlides(sliderContainer)
                        const $this = this
                        setTimeout(function () {
                            console.log('update')
                            $this.update()
                        }, 1);
                    }
                },
            })
            // this.events(sliderContainer, options.windowWidth)
        },
        events: function (sliderContainer, windowWidth) {
            const $thisObj = this
            // $(window).on('load', function () {
            // $thisObj.renderSizeSlides(sliderContainer)
            // })
            $(window).on('resize', function () {
                if (windowWidth != document.body.clientWidth) {
                    $thisObj.windowWidth = document.body.clientWidth
                    // console.log($thisObj.windowWidth)
                    // console.log($thisObj.windowWidth)

                }
            })
        }
    }

    if ($('.more-possibilities-wrapper').length) {
        $.each($('.more-possibilities-wrapper'), function () {
            InitSliderMore.init({
                sliderWrapper: $(this)
            })
        })
    }
    //------------------------------------

    // Инициализация custom-select
    const InitSelect2 = {
        defaultsOptions: {
            selects: $('.select-custom')
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            // console.log(options)
            $.each(options.selects, function () {
                const $this = $(this)
                if ($this.hasClass('select-custom-search')) {
                    $this.select2({
                        minimumResultsForSearch: 0,
                        // debug: true,
                        // closeOnSelect: false,
                        theme: "custom-select select-search",
                        language: {
                            inputTooShort: function () {
                                return "Выберите больше опций...";
                            },
                            noResults: function () {
                                return "Ничего не найдено";
                            },
                            searching: function () {
                                return "Поиск...";
                            },
                            removeAllItems: function () {
                                return "Удалить всё";
                            },
                        },
                    });
                }
                else {
                    $this.select2({
                        minimumResultsForSearch: Infinity,
                        theme: "custom-select",
                        language: "ru",
                    });
                }

            })
            this.events(options.selects)
        },
        events: function (selects) {
            const $obj = this
            selects.on('select2:select', function (e) {
                const nativeSelect = $(e.delegateTarget),
                    nextSelect2Container = nativeSelect.next('.select2.select2-container')
                if (nativeSelect.prop('selectedIndex') != 0) {
                    nextSelect2Container.addClass('select2-container--notfirst')
                    if (nativeSelect.attr('name') == 'mark') {
                        const nativeSelectWrapper = nativeSelect.closest('.default-select-wrapper')
                        nativeSelectWrapper.next().find('.select-custom').attr('disabled', false).trigger('change.select2')
                    }
                }
                else {
                    nextSelect2Container.removeClass('select2-container--notfirst')
                }
            })
            selects.on('select2:open', function (e) {
                setTimeout(function () {
                    $obj.showScroll($('body').find(".select2-results__options:not(.select2-results__options--nested)"));
                }, 0);

                if ($(e.currentTarget).hasClass('select-custom-search')) {
                    console.log(e)
                    $(".select2-container.select2-container--custom-select:not(.select2)").addClass("select2-search");
                    var SelectSearchField = $(".select2-container.select2-container--custom-select:not(.select2)").find(".select2-search__field");
                    setTimeout(() => {
                        if (SelectSearchField.is(":focus")) {
                            SelectSearchField.blur();
                            SelectSearchField.attr("placeholder", "Начните вводить название");
                        }
                    }, 1);
                }


            })
        },
        showScroll: function (options, mobignore = true) {
            const SelectOptionsHeight = function (options) {
                const InitScrollBar = function () {
                    options.scrollbar({
                        ignoreMobile: mobignore,
                        autoUpdate: true,
                    });
                }
                // console.log(options)
                const AllInnerHeight = options.children()
                let SummHeight = 0
                $.each(AllInnerHeight, function () {
                    SummHeight += $(this).outerHeight()
                })
                // console.log(SummHeight)
                if (SummHeight > parseInt(options.css('max-height'))) {
                    InitScrollBar()
                }
                else return false
            }
            SelectOptionsHeight(options)
        }
    }

    if ($('.select-custom').length) {
        InitSelect2.init({
            selects: $('.select-custom')
        })
    }
    //------------------------------------

    // Функция проставления пробелов между разрядами в числительных
    var SpaceNumber = function (NumberElem) {
        NumberElem.each(function (index, element) {
            var valIn = $(this).text();
            var valInNew = valIn.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
            $(this).text(valInNew);
        });
    };
    // добавляем пробелы в числа во всех тегах с классом this-number
    var ThisNumber = $(".this-number span");
    SpaceNumber(ThisNumber);
    //----------------------//


    // Инициализация слайдеров в карточке автомобиля
    const InitItemSlider = {
        defaultsOptions: {
            slidesVisible: 1,
            slidesGroup: 1,
            SpaceBetweenPx: 0,
            windowWidth: document.body.clientWidth
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            const sliderContainer = options.sliderWrapper.find('.catalog-item-slider'),
                sliderBtnPrev = options.sliderWrapper.find('.swiper-button.prev'),
                sliderBtnNext = options.sliderWrapper.find('.swiper-button.next')

            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                slidesPerGroup: options.slidesGroup,
                // grabCursor: true,
                preloadImages: false,
                lazy: true,
                spaceBetween: options.SpaceBetweenPx,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                navigation: {
                    nextEl: sliderBtnNext,
                    prevEl: sliderBtnPrev,
                    disabledClass: "disabled",
                },
                on: {
                    // init: function () {
                    //     $thisObj.renderSizeSlides(sliderContainer)
                    // },
                    resize: function () {
                        const $this = this
                        setTimeout(function () {
                            $this.update()
                        }, 1);

                        // this.updateSlides()
                        // console.log(document.body.clientWidth)
                    }
                },

            })
            // this.events(sliderContainer, options.windowWidth)
        }
    }
    if ($('.catalog-item-slider_wrapper').length) {
        $.each($('.catalog-item-slider_wrapper'), function () {
            InitItemSlider.init({
                sliderWrapper: $(this)
            })
        })
    }
    //----------------------//

    // Инициализация слайдера "Больше возможностей"
    const InitSliderInclusive = {
        defaultsOptions: {
            slidesVisible: 3,
            slidesGroup: 1,
            SpaceBetweenPx: 40,
            windowWidth: document.body.clientWidth
        },
        renderSizeSlides: function (sliderContainer) {
            const slides = sliderContainer.find('.all-inclusive-slide')
            slides.css({ 'min-height': '' })
            let MaxItemHeight = 0

            $.each(slides, function () {
                if ($(this).innerHeight() >= MaxItemHeight) {
                    // console.log($(this).innerHeight())
                    MaxItemHeight = $(this).innerHeight()
                }
            })
            // console.log(MaxItemHeight)
            slides.css({ 'min-height': MaxItemHeight + 'px' })
        },
        renderSizeSlider: function (sliderContainer, slider) {
            if (this.defaultsOptions.windowWidth < 1200 && this.defaultsOptions.windowWidth >= 768) {
                const sliderWrapperWidth = sliderContainer.find('.swiper-wrapper').innerWidth(),
                    deltaWidth = (this.defaultsOptions.windowWidth - sliderWrapperWidth) / 2
                // console.log(deltaWidth)

                sliderContainer.css({
                    'margin-left': '-' + deltaWidth + 'px',
                    'margin-right': '-' + deltaWidth + 'px',
                    'padding-right': deltaWidth + 'px',
                    'padding-left': deltaWidth + 'px'
                })
                // console.log(slider)
                setTimeout(function () {
                    slider.update()
                }, 1);
                // 
            }
            else {
                sliderContainer.attr('style', '')
            }
        },
        init: function (options) {
            const $thisObj = this
            var options = $.extend(this.defaultsOptions, options)
            //console.log(options)
            const sliderContainer = options.sliderWrapper.find('.all-inclusive-slider'),
                sliderBtnPrev = options.sliderWrapper.find('.swiper-prev'),
                sliderBtnNext = options.sliderWrapper.find('.swiper-next')
            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                slidesPerGroup: options.slidesGroup,
                grabCursor: true,
                spaceBetween: options.SpaceBetweenPx,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                navigation: {
                    nextEl: sliderBtnNext,
                    prevEl: sliderBtnPrev,
                    disabledClass: "disabled",
                },
                on: {
                    init: function () {
                        // console.log(this)
                        $thisObj.renderSizeSlides(sliderContainer)
                        $thisObj.renderSizeSlider(sliderContainer, this)
                    },
                    resize: function () {
                        $thisObj.renderSizeSlides(sliderContainer)
                        if ($thisObj.defaultsOptions.windowWidth != document.body.clientWidth) {
                            $thisObj.defaultsOptions.windowWidth = document.body.clientWidth
                            // console.log($thisObj.windowWidth)
                            $thisObj.renderSizeSlider(sliderContainer, this)
                        }
                    }
                },
                breakpoints: {
                    // when window width is >= 320px
                    // 767: {
                    //     slidesPerView: 1,
                    //     slidesPerGroup: 1,
                    //     //   spaceBetween: 20
                    // },
                    // when window width is >= 480px
                    1199: {
                        slidesPerView: 'auto',
                        spaceBetween: 15,
                        // slidesPerGroup: 2
                        //   spaceBetween: 30
                    },
                    // when window width is >= 640px
                    /*  1200: {
                         slidesPerView: 4,
                         slidesPerGroup: options.countPerView,
                         //   spaceBetween: 40
                     } */
                },
            })
            // this.events(sliderContainer, options.windowWidth)
        },
        // events: function (sliderContainer, windowWidth) {
        //     $(window).on('resize', function () {

        //     })
        // }
    }

    if ($('.all-inclusive-wrapper').length) {
        $.each($('.all-inclusive-wrapper'), function () {
            InitSliderInclusive.init({
                sliderWrapper: $(this)
            })
        })
    }
    //------------------------------------

    // Обработчик клика на Faq
    $('body').on('click', '.faq-item-switcher', function (e) {
        e.preventDefault()

        const CloseOtherFaqItems = function ($thisParentItem) {
            const OpenedFaqs = $thisParentItem.siblings('.open'),
                OpenedFaqsContents = OpenedFaqs.find('.faq-item-content')
            OpenedFaqs.removeClass('open')
            OpenedFaqsContents.slideUp()
        }

        const $this = $(this),
            $thisParentItem = $this.closest('.faq-item'),
            $thisContent = $this.next('.faq-item-content')

        CloseOtherFaqItems($thisParentItem)

        $thisParentItem.toggleClass('open')
        $thisParentItem.hasClass('open')
            ? $thisContent.slideDown()
            : $thisContent.slideUp()
    })
    //------------------------------------


    // Инициализация бибилиотеки валидности номера телефона //
    function InitMaskPhone() {
        if ($(".default-input-phone").length > 0) {
            $(".default-input-phone").inputmask({
                mask: "+7   (999) 999-99-99",
                showMaskOnHover: false
            });
        }
    }
    InitMaskPhone();
    //----------------------//

    // Инициализация бибилиотеки валидности номера телефона //
    function InitMaskText() {
        if ($('.default-input-text').length > 0) {
            $(".default-input-text").inputmask({
                mask: "z{*} ",
                showMaskOnHover: false,
                // greedy: false,
                definitions: {
                    'z': {
                        validator: "[A-Za-zА-Яа-яЁё\u0020\-]",
                    }
                }
            });
        }
    }
    InitMaskText()
    //----------------------//

    // Submit Отправки формы 
    $('body').on('submit', '.form-request-inline', function (e) {
        e.preventDefault()
        const _form = $(this),
            _formFields = _form.find('input')
        let InvalidCount = 0
        // console.log(_formFields)

        const AddInvalidText = function (checkField, invalidText) {
            const checkFieldWrapper = checkField.closest('.default-input-wrapper'),
                InvalidElem = '<span class="invalid-text">' + invalidText + '</span>'
            if (!checkFieldWrapper.find('.invalid-text').length) {
                checkFieldWrapper.addClass('invalid')
                $(InvalidElem).appendTo(checkFieldWrapper)
            }
        }

        $.each(_formFields, function () {
            const nowField = $(this)
            if (nowField.val() == '') {
                AddInvalidText(nowField, 'Заполните обязательное поле')
                InvalidCount++
            }
            else {
                if (nowField.hasClass('default-input-phone') && !nowField.inputmask("isComplete")) {
                    AddInvalidText(nowField, 'Некорректно заполнено номер телефона')
                    InvalidCount++
                }
            }
        })
        // console.log(InvalidCount)
        if (InvalidCount == 0) {
            const _formWrapper = _form.closest('.request-inline-wrapper'),
                _formWrapperHeight = _formWrapper.innerHeight(),
                _formSuccessWrapper = _formWrapper.next('.request-inline-success')
            // console.log(_formWrapperHeight, _formSuccessWrapper)

            _formWrapper.hide()
            _formSuccessWrapper.css({
                'height': _formWrapperHeight + 'px'
            })
            _formSuccessWrapper.fadeIn({
                duration: 300,
                start: function () {
                    $(this).addClass('show')
                },
                complete: function () {
                    if (!_formWrapper.closest('.modal').length)
                        _formWrapper.remove()
                    else {
                        _formFields.val('')
                    }
                }
            })
        }
    })
    //----------------------//

    // Обработчик ввода или изменеия инпутов
    $('body').on('input change', '.default-input-wrapper input', function (e) {
        const _field = $(this),
            _fieldWrapper = _field.closest('.default-input-wrapper')
        if (_fieldWrapper.hasClass('invalid')) {
            _fieldWrapper.removeClass('invalid')
            _fieldWrapper.find('.invalid-text').remove()
        }

    })


    const ModalElem = {
        defaultsOptions: {
            modalHash: '',
            click_close: true,
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            // let click_close = true;
            const ThisHash = $('#' + options.modalHash + '')
            // console.log(options)
            // console.log(options.click_close)
            ThisHash.modal({
                fadeDuration: 150,
                closeExisting: false, // новое 11.07.2022
                closeClass: "close-custom",
                closeText: '<span class="visually-hidden">Закрыть</span>',
                clickClose: options.click_close, // новое 28.11.2022
            });
            this.events(ThisHash)
        },
        events: function (modalElem) {
            // console.log(modalElem)
            $('body').on('modal:before-open', modalElem, function (event, modal) {
                modal.$blocker.addClass('current-custom')
                modal.$elm.find('.request-inline-wrapper').css('display', '')
                modal.$elm.find('.request-inline-success').css('display', '').removeClass('show')

            })
            $('body').on('modal:open', modalElem, function (event, modal) {
                console.log(event, modal)

                BlockScroll.open()
            })
            $('body').on('modal:close', modalElem, function (event, modal) {
                if (!$('.mob-switcher.open').length)
                    BlockScroll.close()
            })
        }
    }

    $('.modal-open').on('click', function (e) {
        // console.log($(this))
        e.preventDefault()
        ModalElem.init({
            modalHash: $(this).attr('data-id')
        })
    })
    //----------------------//


    // Обработчик клика на якоря
    $("body").on("click", "a[href^='#']:not(.close-modal), .top-btn", function (e) {
        e.preventDefault();
        console.log($(this))
        if ($(this).closest('.header-mob-inner').length) {
            $(this).closest('.header-mob-inner').find('.top-close').trigger('click')
        }
        let header_offset = 0,
            $thisHash, $thisHashOffset
        if ($(this.hash).length) {
            $thisHash = $(this.hash)
            $thisHashOffset = $thisHash.offset().top
        }
        let $duration = 800
        // console.log($(window).scrollTop())
        // if (docWidth > 1200) {
        //   header_offset = $('header').innerHeight();
        //   // console.log(header_offset)
        // } else {
        //   header_offset = 0;

        // }
        let $scrollTop
        $(this).hasClass('top-btn')
            ? $scrollTop = 0
            : $scrollTop = $thisHashOffset
        // let $scrollTop = $thisHashOffset
        $("html, body")
            .stop()
            .animate(
                {
                    scrollTop: $scrollTop,
                },
                {
                    duration: $duration, // продолжительность анимации
                    // easing: "linear", // скорость анимации
                    complete: function () { // callback
                    },
                    queue: false // не ставим в очередь
                }
            );
        return false;
    });
    //----------------------//

    // Обработчик скрола страницы
    $(window).on('scroll', function (e) {
        let $window = $(window),
            scrollTop = $window.scrollTop();
        scrollTop > $('section:first-child').innerHeight()
            ? $('.top-btn').addClass('show')
            : $('.top-btn').removeClass('show')
    })
    //----------------------//

    // Инициализация изменения Header в зависимости от разрешения
    const HeaderEdited = {
        defaultsOptions: {
            header: $('header'),
            headerWrapper: $('.header'),
            windowWidth: document.body.clientWidth,
            lastScrollTop: 0
        },
        init: function () {
            this.edited()
            this.events()
        },

        edited: function () {
            const options = this.defaultsOptions,
                header_nav = options.headerWrapper.find('.header-nav'),
                header_nav_links = header_nav.find('a'),
                headerMobNavWrapper = options.headerWrapper.find('.header-mob-nav')

            if (options.windowWidth < 1200) {
                // console.log(options.windowWidth)
                // console.log(headerMobNavWrapper.find('a').length)
                if (!headerMobNavWrapper.find('a').length) {
                    $.each(header_nav_links, function (index, elem) {
                        let count_number
                        index < 9
                            ? count_number = '<span>0' + (index + 1) + '</span>'
                            : count_number = '<span>' + (index + 1) + '</span>'
                        // console.log(count_number)
                        $(count_number).prependTo($(elem))
                        $(elem).appendTo(headerMobNavWrapper)
                    })
                    // header_nav.appendTo(headerMobNavWrapper)
                }
            }
            else {
                if (!header_nav_links.length) {
                    const header_nav_links_mob = headerMobNavWrapper.find('a')
                    header_nav_links_mob.find('span').remove()
                    header_nav_links_mob.appendTo(header_nav)
                    // console.log(header_nav_links_mob)
                    if ($('.header-mob-wrapper.show').length) {
                        $('.header-mob-wrapper.show').find('.top-close').trigger('click')
                    }
                }
            }
        },
        events: function () {
            const $obj = this,
                options = this.defaultsOptions
            $(window).on('resize', function () {
                if (options.windowWidth != document.body.clientWidth) {
                    options.windowWidth = document.body.clientWidth
                    $obj.edited()
                }

            })
            options.headerWrapper.on('click', '.mob-switcher', function (e) {
                e.preventDefault()
                const $this = $(this)
                $this.addClass('open')
                $this.next('.header-mob-wrapper').slideDown({
                    duration: 500,
                    start: function () {
                        $(this).addClass('show')
                        BlockScroll.open()
                    },
                    complete: function () {
                        $(this).css('display', '')
                    }
                })
            })
            options.headerWrapper.on('click', '.top-close', function (e) {
                e.preventDefault()
                const $this = $(this),
                    mobSwitcher = $('.mob-switcher'),
                    headerMobWrapper = options.headerWrapper.find('.header-mob-wrapper.show')
                mobSwitcher.removeClass('open')
                headerMobWrapper.slideUp({
                    duration: 500,
                    start: function () {
                        BlockScroll.close()
                    },
                    complete: function () {
                        $(this).removeClass('show')
                        $(this).css('display', '')

                    }
                })
            })
            $(window).on('scroll', function (e) {
                if (options.windowWidth < 1200) {
                    let scrollTop = $(window).scrollTop();
                    // console.log(scrollTop, options.lastScrollTop)
                    if (scrollTop < options.lastScrollTop && scrollTop != 0) {
                        if (!options.header.hasClass('sticky'))
                            options.header.addClass('sticky')
                    }
                    else {
                        if ((options.header.hasClass('sticky') || scrollTop == 0) && !$('.jquery-modal.blocker').length)
                            options.header.removeClass('sticky')
                    }
                    options.lastScrollTop = scrollTop
                }
            })
        }
    }

    if ($('.header').length) {
        HeaderEdited.init()
    }
    //----------------------//


}) // finish doc ready



