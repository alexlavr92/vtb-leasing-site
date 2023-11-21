'use strict'



let docWidth = document.body.clientWidth

// Функционал блокировки скрола при открытии модального окна
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
// ------------------------------------

jQuery(document).ready(function ($) {

    // Инициализация плагина анимации
    AOS.init({
        once: true,
    });
    // ------------------------------------

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
                        spaceBetween: 40,
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
                        const $this = this
                        setTimeout(function () {
                            $thisObj.renderSizeSlides(sliderContainer)
                            // console.log('update')
                            $this.update()
                        }, 10);
                    },
                    resize: function () {
                        const $this = this
                        setTimeout(function () {
                            $thisObj.renderSizeSlides(sliderContainer)
                            // console.log('update')
                            $this.update()
                        }, 10);
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
                    // console.log(e)
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
            return valInNew;
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
        sliderUpdate: function (nosSlider) {
            // const $this = this
            setTimeout(function () {
                nosSlider.update()
            }, 10);
        },
        init: function (options) {
            const obj = this
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
                    init: function () {
                        obj.sliderUpdate(this)
                        //     $thisObj.renderSizeSlides(sliderContainer)
                    },
                    resize: function () {
                        obj.sliderUpdate(this)

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

    // Инициализация слайдера "Всё включено"
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
                        const $this = this
                        setTimeout(function () {
                            $thisObj.renderSizeSlides(sliderContainer)
                            $thisObj.renderSizeSlider(sliderContainer, this)
                            // console.log('update')
                            $this.update()
                        }, 10);
                        // console.log(this)

                    },
                    resize: function () {
                        const $this = this
                        setTimeout(function () {
                            $thisObj.renderSizeSlides(sliderContainer)
                            if ($thisObj.defaultsOptions.windowWidth != document.body.clientWidth) {
                                $thisObj.defaultsOptions.windowWidth = document.body.clientWidth
                                // console.log($thisObj.windowWidth)
                                $thisObj.renderSizeSlider(sliderContainer, this)
                            }
                            // console.log('update')
                            $this.update()
                        }, 10);
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

        e.preventDefault();
        let ValidateEmail = function (email) {
            // console.log(email.value)
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(email.val()) == false) {
                return false
            }
            else return true
        }
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
                    AddInvalidText(nowField, 'Некорректно заполнен номер телефона')
                    InvalidCount++
                }
                if (nowField.hasClass('default-input-mail') && !ValidateEmail(nowField)) {
                    AddInvalidText(nowField, 'Некорректно заполнен email')
                    InvalidCount++
                }
            }
            if (nowField.hasClass('default-input-checkbox') && nowField.prop('checked') == false) {
                const checkFieldWrapper = nowField.closest('.default-input-wrapper')
                checkFieldWrapper.addClass('invalid')
                InvalidCount++
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

            const data = new FormData()  // переменная, в которую записываются все поля формы
            $.each(_formFields, function () {
                const _currentField = $(this)
                let _currentFieldVal = _currentField.val()
                if (_currentField.hasClass('default-input-phone')) {
                    _currentFieldVal = _currentFieldVal.replace(/\s+/g, "")
                }
                data.append(_currentField.attr('name'), _currentFieldVal)
            })
            for (let [key, value] of data) {
                console.log('' + key + ' - ' + value + '')
            }
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
        _field.val() != ''
            ? _field.addClass('active')
            : _field.removeClass('active')
    })
    //----------------------//

    // Инициализация модальных окон
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
            this.events(ThisHash, options.callElem)
        },
        events: function (modalElem, callElem) {
            // console.log(modalElem, callElem)
            $('body').on('modal:before-open', modalElem, function (event, modal) {
                modal.$blocker.addClass('current-custom')
                modal.$elm.find('.request-inline-wrapper').css('display', '')
                modal.$elm.find('.request-inline-success').css('display', '').removeClass('show')
                if (callElem.siblings('.video-js').length) {  // Устанавливаем на паузу видео если была открыта модалка на видео
                    callElem.siblings('.video-js').find('video')[0].pause()
                }
                // console.log(event, modal)
            })
            $('body').on('modal:open', modalElem, function (event, modal) {
                // console.log(event, modal)

                BlockScroll.open()
            })
            $('body').on('modal:close', modalElem, function (event, modal) {
                if (!$('.mob-switcher.open').length) {
                    modal.$elm.find('.invalid').removeClass('invalid')
                    modal.$elm.find('.invalid-text').remove()
                    modal.$elm.find('input').val('')
                    BlockScroll.close()
                }
            })
        }
    }

    $('.modal-open').on('click', function (e) {
        // console.log($(this))
        e.preventDefault()
        ModalElem.init({
            callElem: $(this),
            modalHash: $(this).attr('data-id')
        })
    })
    //----------------------//


    // Обработчик клика на якоря
    $("body").on("click", "a[href^='#']:not(.close-modal), .top-btn", function (e) {
        e.preventDefault();
        // console.log($(this))
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

    // Инициализация слайдеров в карточке автомобиля
    const InitCardSlider = {
        defaultsOptions: {
            slidesVisible: 1,
            slidesGroup: 1,
            SpaceBetweenPx: 15,
            windowWidth: document.body.clientWidth
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            const sliderContainer = options.sliderWrapper.find('.card-slider'),
                sliderBtnPrev = options.sliderWrapper.find('.swiper-button.prev'),
                sliderBtnNext = options.sliderWrapper.find('.swiper-button.next')

            // console.log(options.sliderWrapper)

            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                slidesPerGroup: options.slidesGroup,
                grabCursor: true,
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
                    init: function () {
                        const $this = this
                        setTimeout(function () {
                            $this.update()
                        }, 10);
                    },

                    resize: function () {
                        const $this = this
                        setTimeout(function () {
                            $this.update()
                        }, 10);
                    }
                },

            })
            // this.events(sliderContainer, options.windowWidth)
        }
    }
    if ($('.card-slider-outer').length) {
        $.each($('.card-slider-outer'), function () {
            InitCardSlider.init({
                sliderWrapper: $(this)
            })
        })
    }
    //----------------------//

    // Обработчик клика на переключение месяцев в карточке автомобиля
    $('body').on('click', '.card-top-content .price-tabs-switcher:not(.active)', function (e) {
        e.preventDefault()
        const $this = $(this),
            $thisSiblings = $this.siblings('.active'),
            $thisTabs = $this.closest('.card-price-tabs'),
            $thisTabsEditContent = {
                tabsMileAge: $thisTabs.find('.price-tab-mileage span'),
                tabsPriceCurrent: $thisTabs.find('.price-tab-prices--current span:first-child'),
                tabsPriceOld: $thisTabs.find('.price-tab-prices--old span:first-child')
            },
            $thisAttr = {
                tabsMileAge: $this.attr('data-mileage'),
                tabsPriceCurrent: $this.attr('data-price-current'),
                tabsPriceOld: $this.attr('data-price-old')
            }
        for (var key in $thisTabsEditContent) {
            if ($thisTabsEditContent.hasOwnProperty(key)) {
                const $obj = $thisTabsEditContent
                $obj[key].text($thisAttr[key])
                SpaceNumber($obj[key])
                // console.log(key + " -> " + $thisTabsEditContent[key]);
            }
        }
        $thisSiblings.removeClass('active')
        $this.addClass('active')
    })
    //----------------------//


    // Инициализация всплывающих подсказок
    const Tooltip = {
        defaultsOptions: {
            tooltipElems: $('.tooltip')
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            this.events(options)
        },
        events: function (options) {
            const TooltipState = {
                docWidth: document.body.clientWidth,
                open: function (tooltipElem) {
                    // console.log(tooltipElem)
                    // const docWidth = document.body.clientWidth
                    if (!tooltipElem.hasClass("tooltip-open")) {
                        $(".tooltip_content.tooltip-base").remove();
                        options.tooltipElems.removeClass("tooltip-open");
                        tooltipElem.addClass("tooltip-open");
                        let thistooltip = tooltipElem.next(".tooltip-content"),
                            thisTooltipClone = thistooltip.clone();
                        $(thisTooltipClone).appendTo("body");
                        // console.log($(thisTooltipClone).innerHeight())
                        if (this.docWidth >= 1200) {
                            $(thisTooltipClone).css({
                                position: "absolute",
                                "z-index": "3",
                                top: tooltipElem.offset().top - ($(thisTooltipClone).innerHeight() + 15),
                            });
                            if (document.body.hasAttribute("data-body-scroll-fix")) {
                                let NowOffsetTop = $(thisTooltipClone).css("top"),
                                    BodyOffsetTop = document.body.getAttribute("data-body-scroll-fix");
                                /* console.log(gf) */
                                $(thisTooltipClone).css("top", parseInt(NowOffsetTop) + parseInt(BodyOffsetTop));
                                $(thisTooltipClone).css("z-index", "4"); // новое 14.06.2022
                            }
                            if (tooltipElem.width() < $(thisTooltipClone).width()) {
                                // console.log('ок')
                                $(thisTooltipClone).css("left", tooltipElem.offset().left - ($(thisTooltipClone).innerWidth() - tooltipElem.innerWidth()) / 2);
                            } else if (tooltipElem.width() >= $(thisTooltipClone).width()) {
                                $(thisTooltipClone).css("left", tooltipElem.offset().left + (tooltipElem.innerWidth() - $(thisTooltipClone).innerWidth()) / 2);
                            }
                        } else {
                            BlockScroll.open();
                        }

                        $(thisTooltipClone).fadeIn().addClass("tooltip-base");
                        if (this.docWidth >= 1200) {
                            let ToolTipOffset = $(thisTooltipClone).offset().left;
                            if (ToolTipOffset < 0) {
                                $(thisTooltipClone).css("left", tooltipElem.offset().left - 15).addClass("tooltip-base--over-left");
                            }
                            if (this.docWidth - (ToolTipOffset + $(thisTooltipClone).innerWidth()) < 0) {
                                $(thisTooltipClone)
                                    .css("left", tooltipElem.offset().left - $(thisTooltipClone).innerWidth() + tooltipElem.innerWidth() + 15)
                                    .addClass("tooltip-base--over-right");
                            }
                        }
                    }
                },
                close: function (tooltipElem) {
                    // console.log(this.docWidth)
                    tooltipElem.removeClass("tooltip-open");
                    $(".tooltip-content.tooltip-base").remove();
                    if (this.docWidth < 1200) BlockScroll.close(); // новое
                    /*  console.log('tooltip icon close') */
                }
            }
            // console.log('.' + (options.tooltipElems[0].className) + '')
            $('body').on('mouseenter mouseleave click', '.' + (options.tooltipElems[0].className) + '', function (e) {
                e.preventDefault()
                if (document.body.clientWidth >= 1200) {
                    if (e.type == 'mouseenter') {
                        // console.log($(this))
                        this.docWidth = document.body.clientWidth
                        TooltipState.open($(this))
                    }
                    if (e.type == 'mouseleave') {
                        this.docWidth = document.body.clientWidth
                        // console.log($(this))
                        TooltipState.close($(this))
                        // console.log('увод')
                    }
                }
                else {
                    if (e.type == 'click') {
                        // console.log('click')
                        if (!$(this).hasClass('tooltip-open')) {
                            TooltipState.open($(this))
                        }
                        // else {
                        //     TooltipState.close($(this))
                        // }
                    }
                }
            })
            // Обработки клика по документу вне области tooltip //
            $(document).on("click", function (e) {
                // console.log('target')
                if (document.body.clientWidth < 1200 && $(".tooltip-content.tooltip-base").length) {
                    const targetElem = $(".tooltip-content.tooltip-base .tootlip-content-inner"),
                        TooltipElem = $('.tooltip.tooltip-open')
                    if (
                        (!targetElem.is(e.target) && // если клик был не по нашему блоку
                            targetElem.has(e.target).length === 0) &&
                        (!TooltipElem.is(e.target) && TooltipElem.has(e.target).length === 0)
                    ) {
                        // и не по его дочерним элементам
                        TooltipState.close(TooltipElem)
                    }
                }
            });
            //----------------------//

            // Обработка клика по крестику в тултипе //
            $("body").on("click", ".tooltip-content .tooltip-close", function (e) {
                e.preventDefault();
                const TooltipElem = $('.tooltip.tooltip-open')
                TooltipState.close(TooltipElem)
            });
            //----------------------//
        }
    }

    if ($('.tooltip').length) {
        Tooltip.init()
    }
    //----------------------//


    // Инициализация табов на странице карточки автомобиля
    const TabsCardInit = {
        defaultsOptions: {
            tabSwitcher: 'card-descript-switcher',
            tabsWrapper: 'card-descript-tabs',
            tabsContent: 'card-descript-content'
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            // console.log('.' + options.tabSwitcher + ':not(.active)')
            this.events(options)
        },
        events: function (options) {
            $('body').on('click', '.' + options.tabSwitcher + ':not(.active)', function () {
                // console.log($(this))
                const _thisSwitcher = $(this),
                    _thisSwitherIndex = _thisSwitcher.index(),
                    _tabsWrapper = _thisSwitcher.closest('.' + options.tabsWrapper + ''),
                    _tabsContents = _tabsWrapper.find('.' + options.tabsContent + '')
                // console.log(_thisSwitcher, _tabsWrapper, _tabsContents)
                if (_tabsContents.filter('.active.animate-height.open').length) {
                    _tabsContents.filter('.active.animate-height.open').children('.btn-wrapper').find('.link').trigger('click')
                }

                _thisSwitcher.siblings('.active').removeClass('active')
                _thisSwitcher.addClass('active')
                _tabsContents.filter('.active').removeClass('active').css('display', '')
                _tabsContents.filter(':nth-child(' + (_thisSwitherIndex + 1) + ')').fadeIn({
                    duration: 300,
                    start: function () {
                        $(this).addClass('active')
                        if ($(this).find('.card-descript-items').length && !$(this).hasClass('animate-height')) {
                            const newObj = new AnimateHeightDescriptItems({
                                descriptItems: $(this).find('.card-descript-items'),
                                itemsHeight: $(this).find('.card-descript-items').attr('data-height')
                            })
                        }
                    }
                })
            })
        }
    }
    if ($('.card-descript-tabs').length) {
        TabsCardInit.init()
    }
    //----------------------//

    // Конструктор анимации раскрывающегося списка в табе в карточке автомобиля
    function AnimateHeightDescriptItems(options) {
        this.options = options
        this.defaultsOptions = {
            // descriptItems: 'card-descript-items',
            // itemsHeightHidden: 300
        }
        this.ReCalculateHeight = function (options) {
            const descriptItems = options.descriptItems
            if (options.tabContent.hasClass('open'))
                options.btnMore.trigger('click')
            descriptItems.css('height', '').removeClass('hide')
            options.ItemsHeightNow = descriptItems.innerHeight()
            // console.log(options.ItemsHeightNow)
            descriptItems.css('height', options.itemsHeight + 'px').addClass('hide')

        }
        this.init = function (options) {
            var options = $.extend(this.defaultsOptions, options)
            const descriptItems = options.descriptItems
            options.tabContent = descriptItems.closest('.card-descript-content')
            const tabContent = options.tabContent
            if (descriptItems.innerHeight() > options.itemsHeight) {
                options.ItemsHeightNow = descriptItems.innerHeight()
                // console.log(options.ItemsHeightNow)
                const ItemsHeight = options.itemsHeight
                // console.log(ItemsHeight)
                descriptItems.css('height', ItemsHeight + 'px').addClass('hide')
                tabContent.addClass('animate-height')
                const BtnMore = "<div class='btn-wrapper'><a href='javascript: void(0)' class='link link-blue' data-before='Скрыть'>Читать полностью</a></div>"
                $(BtnMore).appendTo(tabContent)
                options.btnMore = tabContent.find('.link')
            }
            this.events(options)
        }
        this.events = function (options) {
            const obj = this
            $(window).on('resize', function () {
                //console.log(obj)
                obj.ReCalculateHeight(options)
            })
            if (options.btnMore) {
                options.btnMore.on('click', function (e) {
                    e.preventDefault()
                    options.tabContent.toggleClass('open')
                    const BtnMoreText = options.btnMore.text()
                    options.btnMore.text(options.btnMore.attr('data-before')).attr('data-before', BtnMoreText)
                    if (options.tabContent.hasClass('open')) {
                        options.descriptItems.animate({
                            height: options.ItemsHeightNow
                        })
                    }
                    else {
                        options.descriptItems.animate({
                            height: options.itemsHeight
                        })
                    }
                })
            }
            else return false
        }
        this.init(this.options)
    }
    //----------------------//

    // Инициализация видеоплеера //
    const InitVideo = function (videoOptions) {
        this.options = {
            controls: true,
            autoplay: false,
        }
        this.init = function (videoOptions) {
            // console.log(videoOptions, this.options)
            const options = videoOptions,
                player = videojs(options.videoElem, this.options, function onPlayerReady() {
                    videojs.log('Your player is ready!');

                    let showBtnVideo = function () {
                        options.videoBtn.fadeIn({
                            duration: 300,
                            complete: function () {
                                $(this).addClass('show')
                            }
                        })
                    }
                    const TimeToShowBtn = parseInt(options.videoTimeShow)
                    // console.log(TimeToShowBtn)
                    player.on('play', function () {
                        this.on('loadedmetadata', function () {
                            const videoDuration = this.duration()
                            // console.log(videoDuration)
                            if (parseInt(videoDuration) <= TimeToShowBtn) {
                                // console.log('короче')
                                this.on('ended', function () {
                                    showBtnVideo()
                                });
                            }
                            else {
                                this.on('timeupdate', function () {
                                    const currentTime = this.currentTime()
                                    // console.log(currentTime)
                                    if (parseInt(currentTime) >= TimeToShowBtn) {
                                        showBtnVideo()
                                    }
                                })
                            }
                        })
                    })
                    // In this context, `this` is the player that was created by Video.js.
                    // this.play();

                    // How about an event listener?
                    // this.on('ended', function () {
                    //     videojs.log('Awww...over so soon?!');
                    // });
                })
            return player

        }
        this.player = this.init(videoOptions)
    }

    if ($('.video-js').length) {
        $.each($('.video-js'), function () {
            const $this = $(this),
                $thisBtn = $this.siblings('.btn')
            var player = new InitVideo({
                videoElem: $this.attr('id'),
                videoTimeShow: $this.attr('data-time'),
                videoBtn: $thisBtn
            })
            // console.log(player)
        })
    }
    //----------------------//

    // Инициализация слайдера "Вам могут понравиться"
    const InitSliderFavourite = {
        defaultsOptions: {
            slidesVisible: 3,
            slidesGroup: 1,
            SpaceBetweenPx: 32,
            // windowWidth: document.body.clientWidth
        },
        init: function (options) {
            const $thisObj = this
            var options = $.extend(this.defaultsOptions, options)
            //console.log(options)
            const sliderContainer = options.sliderWrapper.children('.favourite-slider'),
                sliderBtnPrev = options.sliderWrapper.children('.swiper-control').find('.prev'),
                sliderBtnNext = options.sliderWrapper.children('.swiper-control').find('.next')
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
                        const $this = this
                        setTimeout(function () {
                            $this.update()
                        }, 10);
                    },
                    resize: function () {
                        const $this = this
                        setTimeout(function () {
                            $this.update()
                        }, 10);
                    }
                },
                breakpoints: {
                    // when window width is >= 320px
                    767: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    // when window width is >= 480px
                    1199: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },

                },
            })

        },

    }

    if ($('.favourite-slider-wrapper').length) {
        $.each($('.favourite-slider-wrapper'), function () {
            InitSliderFavourite.init({
                sliderWrapper: $(this)
            })
        })
    }
    //------------------------------------


    // Инициализация карты
    if ($('#my-map').length) {
        ymaps.ready(initYandexMap);
        function initYandexMap() {
            var setImageSize, setImageOffset
            if (docWidth >= 768) {
                setImageSize = [60, 60]
                //    setImageOffset = [0, -70]
            }
            else {
                setImageSize = [40, 40]
                //    setImageOffset = [10, -40]
            }
            // Создание карты.
            var myMap = new ymaps.Map("my-map", {
                // Координаты центра карты.
                // Порядок по умолчанию: «широта, долгота».
                // Чтобы не определять координаты центра карты вручную,
                // воспользуйтесь инструментом Определение координат.
                center: [55.7048000, 37.6918980],
                // Уровень масштабирования. Допустимые значения:
                // от 0 (весь мир) до 19.
                zoom: 17,
                controls: ['zoomControl', 'fullscreenControl']
            }, {
                searchControlProvider: 'yandex#search'
            }),
                myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                    /* hintContent: 'Собственный значок метки', */
                    /* balloonContent: 'Это красивая метка' */
                }, {
                    // Опции.
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: "./media/icons/baloon.png",
                    // Размеры метки.
                    iconImageSize: setImageSize,
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                    // iconImageOffset: setImageOffset
                });

            // let SetMapCenter = (map) => {
            //     let pixelCenter = map.getGlobalPixelCenter();
            //     const contactContentWidth = document.querySelector('.contacts-content').offsetWidth

            //     // console.log(pixelCenter, contactContentWidth)
            //     pixelCenter = [
            //         pixelCenter[0] + (document.querySelector('.contacts-content').offsetWidth / 2),
            //         pixelCenter[1]
            //     ];
            //     console.log(pixelCenter)
            //     const geoCenter = map.options.get('projection').fromGlobalPixels(pixelCenter, map.getZoom());
            //     map.setCenter(geoCenter);
            // }
            // SetMapCenter(myMap)

            myMap.geoObjects
                .add(myPlacemark)

            myMap.container.events.add("sizechange", function (event) {
                console.log(event)
                const MapSize = myMap.container.getSize()
                console.log(MapSize[0])
                // SetMapCenter(myMap)
                if (MapSize[0] <= 610) {
                    myPlacemark.options.set({
                        'iconImageSize': [40, 40]
                    })
                }
                else {
                    myPlacemark.options.set({
                        'iconImageSize': [60, 60]
                    })
                }
                // console.log(myMap.container.getSize())
            });

        }
    }
    //------------------------------------


    // Функционал работы фильтра и каталога
    let EditedFltr = {
        defaultsOptions: {
            AllItems: $('.catalog-item'),
            AllItemsProps: [],
            SelectMark: $('.select-custom[name="mark"]'),
            SelectModel: $('.select-custom[name="model"]'),
            SelectSort: $('.select-custom[name="sort"]'),
            ItemRequest: $('.catalog-item-request'),
            ResetBtn: $('.reset-fltr-btn')
        },
        getItemInfo: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            $.each(options.AllItems, function (index, elem) {
                const objInfo = $(elem).attr('data-car-info')
                options.AllItemsProps[index] = JSON.parse(objInfo)
                options.AllItemsProps[index].elem = $(elem)
                options.AllItemsProps[index].elem.attr('data-index', (index + 1))
            })
            // console.log(options.AllItemsProps)
            options.CatalogItemsWrapper = options.AllItems.closest('.catalog-items')
            this.fillFltrMark(options)
            this.events(options)

        },
        uniqueValuesSelect: function (arr) {
            let result = [];

            for (let str of arr) {
                if (!result.includes(str)) {
                    result.push(str);
                }
            }
            return result;
        },
        ShowHideItem: function (options, elem, state = 'hide') {
            options.ItemRequest.hide()
            if (state == 'hide') {
                elem.addClass('hide')
            }
            else {
                elem.removeClass('hide')
            }
        },
        fillFltrSelect: function (arrayItems, select) {
            for (let item of arrayItems) {
                const option = '<option value="' + item + '">' + item + '</option>'
                $(option).appendTo(select)
            }
            select.trigger('change.select2')
        },
        fillFltrMark: function (options) {
            let MarksArray = []
            $.each(options.AllItemsProps, function (index, elem) {
                let ElemMark = elem.mark
                // .toLowerCase()
                // ElemMark = ElemMark.charAt(0).toUpperCase() + ElemMark.slice(1);
                MarksArray[index] = ElemMark
            })
            MarksArray = this.uniqueValuesSelect(MarksArray);
            this.fillFltrSelect(MarksArray, options.SelectMark);
        },
        fillFltrModel: function (markValue, options) {
            let ModelsArray = []
            const ShowHideItem = this.ShowHideItem
            $.each(options.AllItemsProps, function (index, item) {
                if (item.mark.toLowerCase() == markValue.toLowerCase()) {
                    let ElemModel = item.model
                    ModelsArray.push(ElemModel)
                    ShowHideItem(options, item.elem, 'show')
                }
                else {
                    ShowHideItem(options, item.elem)
                }
            })

            ModelsArray = this.uniqueValuesSelect(ModelsArray)
            // console.log(ModelsArray)
            options.SelectModel.children(':not(:first-child)').remove()
            this.fillFltrSelect(ModelsArray, options.SelectModel)
            if (options.SelectModel.siblings('.select2-container--notfirst').length)
                options.SelectModel.siblings('.select2-container--notfirst').removeClass('select2-container--notfirst')
            options.SelectModel.prop('selectedIndex', '0')
        },
        changeSelectModel: function (modelValue, options) {
            const CurrentMark = this.SelectedMark,
                ShowHideItem = this.ShowHideItem
            // 
            options.AllItemsProps.map(function (item) {
                if (item.mark == CurrentMark) {
                    if (item.model != modelValue) {
                        ShowHideItem(options, item.elem)
                    }
                    else {
                        ShowHideItem(options, item.elem, 'show')
                    }
                }
            })
            // console.log(ModelItems)
        },
        clearSelectModel: function () {
            this.SelectedModel = null
        },
        sortedFltr: function (options, state) {
            const ShowedItems = []
            options.AllItems.map(function (index, item) {
                if (!$(item).hasClass('hide'))
                    ShowedItems.push($(item))
            })
            // console.log(ShowedItems)
            ShowedItems.sort(function (itemA, itemB) {
                // console.log(IndexA, IndexB)
                if (state == 'reset') {
                    const DataIndex = 'data-index',
                        IndexA = parseInt(itemA.attr(DataIndex)),
                        IndexB = parseInt(itemB.attr(DataIndex))
                    if (IndexA < IndexB) return -1;
                    if (IndexA > IndexB) return 1;
                }
                if (state == 'desc-views') {
                    const DataViews = 'view-count',
                        ViewsA = parseInt(itemA.find('.' + DataViews + '> span').text().replace(/\s+/g, "")),
                        ViewsB = parseInt(itemB.find('.' + DataViews + '> span').text().replace(/\s+/g, ""))
                    // console.log(ViewsA, ViewsB)
                    if (ViewsA > ViewsB) return -1;
                    if (ViewsA < ViewsB) return 1;
                }
                if (state == 'asc-price' || 'desc-price') {
                    const DataPrice = 'item-price-current',
                        PriceA = parseInt(itemA.find('.' + DataPrice + '> span').text().replace(/\s+/g, "")),
                        PriceB = parseInt(itemB.find('.' + DataPrice + '> span').text().replace(/\s+/g, ""))
                    if (state == 'asc-price') {
                        if (PriceA < PriceB) return -1;
                        if (PriceA > PriceB) return 1;
                    }
                    else {
                        if (PriceA > PriceB) return -1;
                        if (PriceA < PriceB) return 1;
                    }
                }
                return 0;

            })
                .forEach(function (item, index) {
                    item.appendTo(options.CatalogItemsWrapper)
                    // if (state == 'reset') {
                    if (index == 4 && document.body.clientWidth >= 1200) {
                        options.ItemRequest.show()
                        options.ItemRequest.insertAfter(item)
                    }
                    // }
                });

        },
        resetFltr: function (options) {

            options.AllItems.removeClass('hide')

            // Функция сброса селектов фильтра
            let ResetFltrSelects = function (resetSelect) {
                resetSelect.prop('selectedIndex', '0').trigger('change.select2')
                if (resetSelect.siblings('.select2-container--notfirst').length)
                    resetSelect.siblings('.select2-container--notfirst').removeClass('select2-container--notfirst')

            }
            //------------------------------------

            ResetFltrSelects(options.SelectMark)

            options.SelectModel.children(':not(:first-child)').remove()
            ResetFltrSelects(options.SelectModel)
            options.SelectModel.prop('disabled', true).trigger('change.select2')

            ResetFltrSelects(options.SelectSort)

            // Вызов функции сброса фильтра в состояние "По умолчанию"
            this.sortedFltr(options, 'reset')
        },
        events: function (options) {
            const $thisObj = this
            options.SelectMark.on('change', function () {
                $thisObj.SelectedMark = $(this).val()
                $thisObj.fillFltrModel($thisObj.SelectedMark, options)
                if ($thisObj.SelectedModel)
                    $thisObj.clearSelectModel()
                $thisObj.sortedFltr(options, options.SelectSort.val())
            })
            options.SelectModel.on('change', function () {
                $thisObj.SelectedModel = $(this).val()
                $thisObj.changeSelectModel($thisObj.SelectedModel, options)
                // console.log($thisObj)
                // $thisObj.fltrApply(options)
                $thisObj.sortedFltr(options, options.SelectSort.val())
            })
            options.SelectSort.on('change', function () {
                const selectValue = $(this).val()
                $thisObj.sortedFltr(options, selectValue)
            })
            options.ResetBtn.on('click', function () {
                $thisObj.resetFltr(options)
            })
        },

    }

    if ($('.catalog-items .catalog-item').length) {
        EditedFltr.getItemInfo()
    }
    //------------------------------------

}) // finish doc ready



