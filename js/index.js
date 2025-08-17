let baseurl = 'https://glxtbk.vercel.app/node';
let orgData = JSON.parse(localStorage.getItem('orgData'));
// 
// // window.addEventListener('load', function () {

// });

setTimeout(() => {
    document.getElementById('preloader').style.display = 'none';
}, 5000);

fetch(baseurl+'/api/front/admin/organizationsettings')
.then(response => {
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
})
.then(data => {
	console.log('Organization Data:', data);
	localStorage.setItem('orgData', JSON.stringify(data))	
	orgData = JSON.parse(localStorage.getItem('orgData'));
	// You can add more logic here to handle the organization data
	for(let i=0;i<document.getElementsByClassName('companylogo').length;i++){
		if(document.getElementsByClassName('companylogo')[i])document.getElementsByClassName('companylogo')[i].src = `${orgData.data[0].logo}`;
		if(document.getElementsByClassName('companylogo')[i])document.getElementsByClassName('companylogo')[i].setAttribute('src', orgData.data[0].logo);
	}
	
})
.catch(error => {
	console.error('There was a problem with the fetch operation:', error);
});



if(document.getElementById('header')){
	document.getElementById('header').innerHTML=`
        <div id="elementor-header-top" class="elementor-header-top-transparent">
            <style id="elementor-post-33448">
                .elementor-33448 .elementor-element.elementor-element-fae2974>.elementor-container>.elementor-column>.elementor-widget-wrap {
                    align-content: center;
                    align-items: center;
                }

                .elementor-33448 .elementor-element.elementor-element-fae2974 {
                    border-style: solid;
                    border-width: 0px 0px 1px 0px;
                    border-color: #DBDBDB99;
                    padding: 0px 0px 0px 0px;
                }

                .elementor-33448 .elementor-element.elementor-element-583b2a0 {
                    text-align: left;
                }

                .elementor-33448 .elementor-element.elementor-element-583b2a0 img {
                    width: 165px;
                }

                .elementor-33448 .elementor-element.elementor-element-b5ae8d1>.elementor-element-populated {
                    padding: 0px 0px 0px 15px;
                }

                .elementor-33448 .elementor-element.elementor-element-c41dfe5 {
                    border-style: solid;
                    border-width: 0px 0px 2px 0px;
                    border-color: #F0F0F0C9;
                }

                .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li i {
                    display: inline-block;
                    color: var(--theme-color2);
                }

                .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li svg {
                    fill: var(--theme-color2);
                }

                .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li .prefix {
                    display: inline-block;
                }

                .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li>* {
                    font-size: 15px;
                    color: #696969;
                }

                .elementor-33448 .elementor-element.elementor-element-474b8e6 {
                    text-align: left;
                }

                .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li {
                    margin: 0px 18px 0px 0px;
                    padding: 3px 18px 3px 0px;
                }

                .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li:last-child {
                    border-style: solid;
                    border-width: 0px 0px 0px 0px;
                }

                .elementor-33448 .elementor-element.elementor-element-831add4 {
                    text-align: right;
                }

                .elementor-33448 .elementor-element.elementor-element-0032216>.elementor-element-populated {
                    padding: 0px 0px 0px 10px;
                }

                @media (min-width: 1025px) {
                    .elementor-33448 .elementor-element.elementor-element-8624775 .menuzord-menu>li.menu-item {
                        padding: 25px 0px 25px 0px
                    }

                    ;
                }

                @media (min-width: 1025px) {
                    header#header .elementor-33448 .elementor-element.elementor-element-8624775 .menuzord-menu>li.menu-item {
                        padding: 25px 0px 25px 0px
                    }

                    ;
                }

                .elementor-bc-flex-widget .elementor-33448 .elementor-element.elementor-element-fe19aad.elementor-column .elementor-widget-wrap {
                    align-items: center;
                }

                .elementor-33448 .elementor-element.elementor-element-fe19aad.elementor-column.elementor-element[data-element_type="column"]>.elementor-widget-wrap.elementor-element-populated {
                    align-content: center;
                    align-items: center;
                }

                .elementor-33448 .elementor-element.elementor-element-fe19aad.elementor-column>.elementor-widget-wrap {
                    justify-content: flex-end;
                }

                .elementor-33448 .elementor-element.elementor-element-83a2a72 {
                    width: auto;
                    max-width: auto;
                }

                .elementor-33448 .elementor-element.elementor-element-83a2a72 .btn:hover:before {
                    background-color: var(--theme-color2);
                }

                .elementor-33448 .elementor-element.elementor-element-83a2a72 .btn:hover:after {
                    background-color: var(--theme-color2);
                }

                @media(min-width:768px) {
                    .elementor-33448 .elementor-element.elementor-element-c4fa825 {
                        width: 17.778%;
                    }

                    .elementor-33448 .elementor-element.elementor-element-b5ae8d1 {
                        width: 82.222%;
                    }

                    .elementor-33448 .elementor-element.elementor-element-0032216 {
                        width: 73.876%;
                    }

                    .elementor-33448 .elementor-element.elementor-element-fe19aad {
                        width: 26.024%;
                    }
                }

                @media(max-width:1024px) and (min-width:768px) {
                    .elementor-33448 .elementor-element.elementor-element-b5ae8d1 {
                        width: 100%;
                    }
                }

                @media(max-width:1200px) {
                    .elementor-33448 .elementor-element.elementor-element-fae2974 {
                        padding: 0px 0px 0px 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-583b2a0 {
                        text-align: center;
                    }

                    .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li {
                        margin: 0px 18px 0px 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li:last-child {
                        margin: 0px 0px 0px 0px;
                        padding: 0px 0px 0px 0px;
                    }
                }

                @media(max-width:1024px) {
                    .elementor-33448 .elementor-element.elementor-element-fae2974 {
                        padding: 0px 0px 0px 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-b5ae8d1>.elementor-element-populated {
                        padding: 0px 0px 0px 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-c41dfe5 {
                        border-width: 0px 0px 0px 0px;
                        padding: 0px 0px 0px 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-474b8e6 {
                        text-align: left;
                    }

                    .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li {
                        margin: 0px 0px 0px 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-83a2a72 {
                        width: var(--container-widget-width, 33%);
                        max-width: 33%;
                        --container-widget-width: 33%;
                        --container-widget-flex-grow: 0;
                    }

                    .elementor-33448 .elementor-element.elementor-element-83a2a72>.elementor-widget-container {
                        margin: 0px 0px 0px 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-83a2a72 .btn-view-details {
                        text-align: Center;
                    }
                }

                @media(max-width:767px) {
                    .elementor-33448 .elementor-element.elementor-element-b5ae8d1>.elementor-element-populated {
                        padding: 0px 0px 0px 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-c41dfe5 {
                        padding: 0px 0px 10px 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-474b8e6 {
                        text-align: center;
                    }

                    .elementor-33448 .elementor-element.elementor-element-474b8e6 .tm-header-top-info li {
                        padding: 10px 20px 10px 10px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-09f621a>.elementor-element-populated {
                        margin: -6px 0px 0px 0px;
                        --e-column-margin-right: 0px;
                        --e-column-margin-left: 0px;
                    }

                    .elementor-33448 .elementor-element.elementor-element-831add4 {
                        text-align: center;
                    }

                    .elementor-33448 .elementor-element.elementor-element-83a2a72 {
                        width: 100%;
                        max-width: 100%;
                    }

                    .elementor-33448 .elementor-element.elementor-element-83a2a72 .btn-view-details {
                        text-align: Center;
                    }
                }
            </style>
            <div data-elementor-type="wp-post" data-elementor-id="33448" class="elementor elementor-33448">
                <section
                    class="elementor-section elementor-top-section elementor-element elementor-element-fae2974 elementor-section-content-middle elementor-section-stretched elementor-hidden-tablet elementor-hidden-mobile elementor-hidden-mobile_extra elementor-section-boxed elementor-section-height-default elementor-section-height-default tm-col-stretched-none tm-bg-color-over-image"
                    data-id="fae2974" data-element_type="section"
                    data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;}">
                    <div class="elementor-container elementor-column-gap-no">
                        <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-c4fa825 tm-bg-color-over-image"
                            data-id="c4fa825" data-element_type="column">
                            <div class="elementor-widget-wrap elementor-element-populated">
                                <div class="elementor-element elementor-element-583b2a0 elementor-hidden-tablet elementor-hidden-phone elementor-widget elementor-widget-image"
                                    data-id="583b2a0" data-element_type="widget" data-widget_type="image.default">
                                    <div class="elementor-widget-container">
                                        <a href="/globalxt/index.html">
											<img decoding="async" width="150" height="48" style="width:97px" src="${orgData.data[0].logo??'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}" class="attachment-large size-large wp-image-35010 companylogo" alt="" /> 
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-b5ae8d1 tm-bg-color-over-image"
                            data-id="b5ae8d1" data-element_type="column">
                            <div class="elementor-widget-wrap elementor-element-populated">
                                <section
                                    class="elementor-section elementor-inner-section elementor-element elementor-element-c41dfe5 elementor-section-full_width elementor-section-height-default elementor-section-height-default tm-col-stretched-none tm-bg-color-over-image"
                                    data-id="c41dfe5" data-element_type="section">
                                    <div class="elementor-container elementor-column-gap-default">
                                        <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-1cc9a19 tm-bg-color-over-image"
                                            data-id="1cc9a19" data-element_type="column">
                                            <div class="elementor-widget-wrap elementor-element-populated">
                                                <div class="elementor-element elementor-element-474b8e6 elementor-widget elementor-widget-tm-ele-header-top-info"
                                                    data-id="474b8e6" data-element_type="widget"
                                                    data-widget_type="tm-ele-header-top-info.default">
                                                    <div class="elementor-widget-container">
                                                        <div class="tm-header-top-info " style="width:500px">
                                                            <ul style="display:flex">
                                                                <li>
																	<a href="mailto:${orgData.data[0].email}">
                                                                        <i aria-hidden="true" class="fas fa-envelope"></i> 
                                                                        <span>${orgData.data[0].email}</span>
                                                                    </a>
                                                                </li>
                                                                <li>
																	<a href='tel:${orgData.data[0].phone}'>
                                                                        <i aria-hidden="true"
                                                                            class=" flaticon-common-call"></i> Tel:
																		${orgData.data[0].phone}</a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-09f621a tm-bg-color-over-image"
                                            data-id="09f621a" data-element_type="column">
                                            <div class="elementor-widget-wrap elementor-element-populated">
                                                <div class="elementor-element elementor-element-831add4 tm-header-search-content-style-side-panel hide-cart-count-yes elementor-widget elementor-widget-tm-ele-header-cart"
                                                    data-id="831add4" data-element_type="widget"
                                                    data-widget_type="tm-ele-header-cart.default">
                                                    <div class="elementor-widget-container d-none">
                                                        <div class="woocommerce top-nav-mini-cart-icon-container">
                                                            <div class="top-nav-mini-cart-icon-contents">
                                                                <a class="mini-cart-icon"
                                                                    style="display: none" href="https://Wp2022.kodesolution.com/organek/cart/"
                                                                    title="View your shopping cart"><i
                                                                        class="lnr lnr-icon-cart1"></i>
                                                                    <span class="items-count">0</span> <span
                                                                        class="cart-quick-info">0 items - <span
                                                                            class="woocommerce-Price-amount amount"><bdi><span
                                                                                    class="woocommerce-Price-currencySymbol">&#36;</span>0.00</bdi></span></span>
                                                                </a>

                                                                <div class="dropdown-content">


                                                                    <p class="woocommerce-mini-cart__empty-message">
                                                                        No products in the cart.</p>


                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section
                                    class="elementor-section elementor-inner-section elementor-element elementor-element-03ee938 elementor-hidden-tablet elementor-hidden-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default tm-col-stretched-none tm-bg-color-over-image"
                                    data-id="03ee938" data-element_type="section">
                                    <div class="elementor-container elementor-column-gap-default">
                                        <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-0032216 tm-bg-color-over-image"
                                            data-id="0032216" data-element_type="column">
                                            <div class="elementor-widget-wrap elementor-element-populated">
                                                <div class="elementor-element elementor-element-8624775 elementor-widget elementor-widget-tm-ele-header-primary-nav"
                                                    data-id="8624775" data-element_type="widget"
                                                    data-widget_type="tm-ele-header-primary-nav.default">
                                                    <div class="elementor-widget-container">
                                                        <nav id="top-primary-nav-elementor-id-holder-521541"
                                                            class="menuzord-primary-nav menuzord menuzord-responsive">
                                                            <ul id="main-nav-id-holder-521541"
                                                                class="menuzord-menu">
                                                                <li id="menu-item-3005411"
                                                                    class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30054">
                                                                    <a title="Home" class="menu-item-link"
                                                                        onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#home'; } else { window.location.href = '#home'; }"><span>Home</span>
                                                                    </a>
                                                                </li>
                                                                
                                                                <li id="menu-item-30054"
                                                                    class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30054">
                                                                    <a title="About Us" class="menu-item-link"
                                                                        onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#aboutus'; } else { window.location.href = '#aboutus'; }"><span>About Us</span>
                                                                    </a>
                                                                </li>
                                                                <li id="menu-item-"
                                                                    class="menu-item menu-item-type-post_type menu-item-object-page ">
                                                                    <a title="Services" class="menu-item-link"
                                                                         onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#services'; } else { window.location.href = '#services'; }"><span>Services</span>
                                                                    </a>
                                                                </li>															
                                                                
                                                                <li id="menu-item-52569"
                                                                    class="menu-item menu-item-type-post_type menu-item-object-page menu-item-52569">
                                                                    <a title="Products" class="menu-item-link"
                                                                        href="./shop.html"><span>Products</span>
                                                                    </a>
                                                                </li>
                                                              
                                                            </ul>
                                                        </nav>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-fe19aad tm-bg-color-over-image"
                                            data-id="fe19aad" data-element_type="column">
                                            <div class="elementor-widget-wrap elementor-element-populated">
                                                <div class="elementor-element elementor-element-83a2a72 elementor-widget__width-auto elementor-widget-tablet__width-initial elementor-widget-mobile__width-inherit elementor-hidden-phone elementor-widget elementor-widget-tm-ele-button"
                                                    data-id="83a2a72" data-element_type="widget"
                                                    data-widget_type="tm-ele-button.default">
                                                    <div class="elementor-widget-container">
                                                        <div class="tm-sc-button btn-view-details ">
                                                            <a class="btn btn-theme-colored1 btn-sm"
                                                                onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#contactus'; } else { window.location.href = '#contactus'; }">


                                                                <span class="btn-icon"><i
                                                                        class="far fa-calendar-check"></i></span>

                                                                <span>
                                                                    Contact Us </span>

                                                                <span class="btn-icon"><i
                                                                        class="fas fa-chevron-right"></i></span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <div id="elementor-header-top-sticky">
            <style id="elementor-post-52459">
                .elementor-52459 .elementor-element.elementor-element-0985e18>.elementor-container>.elementor-column>.elementor-widget-wrap {
                    align-content: center;
                    align-items: center;
                }

                .elementor-52459 .elementor-element.elementor-element-0985e18:not(.elementor-motion-effects-element-type-background),
                .elementor-52459 .elementor-element.elementor-element-0985e18>.elementor-motion-effects-container>.elementor-motion-effects-layer {
                    background-color: #FFFFFF;
                }

                .elementor-52459 .elementor-element.elementor-element-0985e18 {
                    border-style: solid;
                    border-width: 1px 0px 0px 0px;
                    border-color: #EEEEEE;
                    box-shadow: 0px 0px 30px 0px rgba(184, 184, 184, 0.2901960784313726);
                    transition: background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s;
                    padding: 0px 0px 0px 0px;
                    z-index: 5;
                }

                .elementor-52459 .elementor-element.elementor-element-0985e18>.elementor-background-overlay {
                    transition: background 0.3s, border-radius 0.3s, opacity 0.3s;
                }

                .elementor-52459 .elementor-element.elementor-element-61130a3>.elementor-element-populated {
                    padding: 0px 0px 0px 0px;
                }

                .elementor-52459 .elementor-element.elementor-element-2df2808 {
                    width: auto;
                    max-width: auto;
                }

                .elementor-52459 .elementor-element.elementor-element-7cf23e6.elementor-column>.elementor-widget-wrap {
                    justify-content: center;
                }

                .elementor-52459 .elementor-element.elementor-element-7cf23e6>.elementor-element-populated {
                    padding: 0px 0px 0px 0px;
                }

                .elementor-52459 .elementor-element.elementor-element-d9c2411 .menuzord-menu>li.menu-item>a {
                    color: #414141;
                }

                .elementor-52459 .elementor-element.elementor-element-d9c2411 .menuzord-menu>li.menu-item:hover>a,
                .elementor-52459 .elementor-element.elementor-element-d9c2411 .menuzord-menu>li.menu-item.active>a {
                    color: #3A3A3A;
                }

                @media (min-width: 1025px) {
                    .elementor-52459 .elementor-element.elementor-element-d9c2411 .menuzord-menu>li.menu-item {
                        padding: 33px 0px 33px 0px
                    }

                    ;
                }

                @media (min-width: 1025px) {
                    header#header .elementor-52459 .elementor-element.elementor-element-d9c2411 .menuzord-menu>li.menu-item {
                        padding: 33px 0px 33px 0px
                    }

                    ;
                }

                .elementor-52459 .elementor-element.elementor-element-d9c2411 {
                    width: auto;
                    max-width: auto;
                }

                .elementor-bc-flex-widget .elementor-52459 .elementor-element.elementor-element-424457c.elementor-column .elementor-widget-wrap {
                    align-items: center;
                }

                .elementor-52459 .elementor-element.elementor-element-424457c.elementor-column.elementor-element[data-element_type="column"]>.elementor-widget-wrap.elementor-element-populated {
                    align-content: center;
                    align-items: center;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .tm-sc-icon-box {
                    text-align: left;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon-wrapper {
                    display: flex;
                    justify-content: center;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0px 15px 0px 0px;
                    background-color: var(--theme-color2);
                    width: 42px;
                    height: 42px;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon i {
                    line-height: 1;
                    color: #FFFFFF;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon svg {
                    line-height: 1;
                    fill: #FFFFFF;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon i,
                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon svg {
                    font-size: 1rem;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb:hover .icon {
                    background-color: var(--theme-color3);
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon-wrapper .icon-bg-img {
                    left: 0%;
                    top: 0%;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb:hover .icon-wrapper .icon-bg-img {
                    left: 0%;
                    top: 0%;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon-box-title,
                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon-box-title a {
                    font-size: 14px;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .icon-box-title {
                    margin: 0px 0px 0px 0px;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .content {
                    color: #000000;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .content * {
                    color: #000000;
                }

                .elementor-52459 .elementor-element.elementor-element-41a1ffb .content,
                .elementor-52459 .elementor-element.elementor-element-41a1ffb .content * {
                    font-size: 12px;
                }

                @media(min-width:768px) {
                    .elementor-52459 .elementor-element.elementor-element-61130a3 {
                        width: 13.819%;
                    }

                    .elementor-52459 .elementor-element.elementor-element-7cf23e6 {
                        width: 66.552%;
                    }

                    .elementor-52459 .elementor-element.elementor-element-424457c {
                        width: 19.293%;
                    }
                }

                @media(max-width:1366px) {
                    .elementor-52459 .elementor-element.elementor-element-41a1ffb>.elementor-widget-container {
                        margin: 0px 15px 0px 15px;
                    }
                }

                @media(max-width:1200px) {
                    .elementor-52459 .elementor-element.elementor-element-41a1ffb>.elementor-widget-container {
                        margin: 0px 10px 0px 15px;
                    }
                }

                @media(max-width:1024px) {
                    .elementor-52459 .elementor-element.elementor-element-41a1ffb>.elementor-widget-container {
                        margin: 0px 0px 0px 0px;
                        padding: 0px 0px 0px 0px;
                    }

                    .elementor-52459 .elementor-element.elementor-element-41a1ffb {
                        width: var(--container-widget-width, 33%);
                        max-width: 33%;
                        --container-widget-width: 33%;
                        --container-widget-flex-grow: 0;
                    }
                }

                @media(max-width:767px) {
                    .elementor-52459 .elementor-element.elementor-element-41a1ffb>.elementor-widget-container {
                        margin: 0px 0px 30px 0px;
                        padding: 0px 0px 0px 0px;
                    }

                    .elementor-52459 .elementor-element.elementor-element-41a1ffb {
                        width: 100%;
                        max-width: 100%;
                    }
                }
            </style>
            <div data-elementor-type="wp-post" data-elementor-id="52459" class="elementor elementor-52459">
                <section
                    class="elementor-section elementor-top-section elementor-element elementor-element-0985e18 elementor-section-content-middle elementor-section-stretched elementor-hidden-tablet elementor-hidden-mobile elementor-hidden-mobile_extra elementor-section-boxed elementor-section-height-default elementor-section-height-default tm-col-stretched-none tm-bg-color-over-image"
                    data-id="0985e18" data-element_type="section"
                    data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
                    <div class="elementor-container elementor-column-gap-default">
                        <div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-61130a3 tm-bg-color-over-image"
                            data-id="61130a3" data-element_type="column">
                            <div class="elementor-widget-wrap elementor-element-populated">
                                <div class="elementor-element elementor-element-2df2808 elementor-widget__width-auto elementor-widget elementor-widget-tm-ele-site-logo"
                                    data-id="2df2808" data-element_type="widget"
                                    data-widget_type="tm-ele-site-logo.default">
                                    <div class="elementor-widget-container">
                                        <a class="site-brand"  href="./index.html">
                                            <img decoding="async" class="logo-default" style="width: 59px"
                                                src="../wp-content/uploads/new/logo.png"
                                                width="" height="" alt="Organek">
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-7cf23e6 tm-bg-color-over-image"
                            data-id="7cf23e6" data-element_type="column">
                            <div class="elementor-widget-wrap elementor-element-populated">
                                <div class="elementor-element elementor-element-d9c2411 elementor-widget__width-auto elementor-widget elementor-widget-tm-ele-header-primary-nav"
                                    data-id="d9c2411" data-element_type="widget"
                                    data-widget_type="tm-ele-header-primary-nav.default">
                                    <div class="elementor-widget-container">
                                        <nav id="top-primary-nav-elementor-id-holder-813026"
                                            class="menuzord-primary-nav menuzord menuzord-responsive">
                                            <ul id="main-nav-id-holder-813026" class="menuzord-menu">
                                                
                                                <li id="menu-item-30054112"
                                                                    class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30054">
                                                                    <a title="Home" class="menu-item-link"
                                                                        onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#home'; } else { window.location.href = '#home'; }"><span>Home</span>
                                                                    </a>
                                                                </li>
                                                <li id="menu-item-3005411"
                                                                    class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30054">
                                                                    <a title="About Us" class="menu-item-link"
                                                                        onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#aboutus'; } else { window.location.href = '#aboutus'; }"><span>About Us</span>
                                                                    </a>
                                                                </li>
                                                <li id="menu-item-3005311"
                                                                    class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30053">
                                                                    <a title="Services" class="menu-item-link"
                                                                         onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#services'; } else { window.location.href = '#services'; }"><span>Services</span>
                                                                    </a>
                                                                </li>
                                                
                                                <li id="menu-item-52569"
                                                    class="menu-item menu-item-type-post_type menu-item-object-page menu-item-52569">
                                                    <a title="Products" class="menu-item-link"
                                                        href="./shop.html"><span>Products</span>
                                                    </a>
                                                </li>
                                                <li id="menu-item-30059"
                                                    class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30059">
                                                    <p title="Contact Us" class="menu-item-link" style="position:relative;top:7px"
                                                        onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#contactus'; } else { window.location.href = '#contactus'; }"><span>Contact Us</span>
                                                    </p>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-424457c tm-bg-color-over-image"
                            data-id="424457c" data-element_type="column">
                            <div class="elementor-widget-wrap elementor-element-populated">
                                <div class="elementor-element elementor-element-41a1ffb elementor-widget-tablet__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-tm-ele-iconbox"
                                    data-id="41a1ffb" data-element_type="widget"
                                    data-widget_type="tm-ele-iconbox.default">
                                    <div class="elementor-widget-container">
                                        <div
                                            class="tm-sc-icon-box icon-box icon-left tm-iconbox-icontype-font-icon iconbox-centered-in-responsive-mobile icon-position-icon-left animate-icon-on-hover animate-icon-rotate">

                                            <div class="icon-box-wrapper">

                                                <div class="icon-wrapper">
                                                    <div
                                                        class="icon icon-type-font-icon icon-sm icon-default-bg icon-circled">
                                                        <i aria-hidden="true" class="fas fa-phone"></i>
                                                    </div>

                                                    <div class="icon-bg-img">
                                                    </div>
                                                </div>
                                                <div class="icon-text">
                                                    <div class="content">Call Anytime </div>

                                                    <h6 class="icon-box-title ">
														${orgData.data[0].phone} </h6>



                                                </div>
                                                <div class="clearfix"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <div id="elementor-header-top-mobile">
            <div id="tm-header-mobile">
                <div id="tm-header-main" class="tm-header-main">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="tm-header-branding">

                                <a class="menuzord-brand site-brand"
                                    href="/">
                                    <img class="logo-default" style="width: 59px"
                                        src="../wp-content/uploads/new/logo.png"
                                        alt="Organek Logo" width="150" height="48">
                                </a>
                            </div>
                            <div class="tm-header-menu">
                                <div class="tm-header-menu-scroll">
                                    <div id="navclose" class="tm-menu-close tm-close"></div>
                                    <style id="elementor-post-27212">
                                        .elementor-27212 .elementor-element.elementor-element-6a2e2da {
                                            padding: 0px 0px 0px 0px;
                                        }

                                        .elementor-27212 .elementor-element.elementor-element-e115c9d img {
                                            width: 200px;
                                        }
                                    </style>
                                    <div data-elementor-type="wp-post" data-elementor-id="27212"
                                        class="elementor elementor-27212">
                                        <section
                                            class="elementor-section elementor-top-section elementor-element elementor-element-6a2e2da elementor-section-full_width elementor-section-height-default elementor-section-height-default tm-col-stretched-none tm-bg-color-over-image"
                                            data-id="6a2e2da" data-element_type="section">
											<div class="elementor-container elementor-column-gap-default">
												<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-66f0dc1 tm-bg-color-over-image"
													data-id="66f0dc1" data-element_type="column">
													<div class="elementor-widget-wrap elementor-element-populated">
														<div class="elementor-element elementor-element-e115c9d elementor-widget elementor-widget-tm-ele-site-logo"
															data-id="e115c9d" data-element_type="widget"
															data-widget_type="tm-ele-site-logo.default">
															<div class="elementor-widget-container">
																<a class="site-brand"
																	 href="./index.html">
																	<img decoding="async" class="logo-default"
																		src="../wp-content/uploads/new/logo.png"
																		width="" height="" alt="Organek">
																</a>
															</div>
														</div>
														<div class="elementor-element elementor-element-6eeb3fd search-submit-icon elementor-widget elementor-widget-tm-ele-header-search"
															data-id="6eeb3fd" data-element_type="widget"
															data-widget_type="tm-ele-header-search.default">
															<div class="elementor-widget-container">
																<div class="tm-widget-search-form">
																	<form role="search" method="get"
																		class="search-form-default"
																		action="https://wp2022.kodesolution.com/organek/">
																		<input type="search"
																			class="form-control search-field"
																			placeholder="Search Product..." value=""
																			name="s" />
																		<button type="submit"
																			class="search-submit"><i
																				class="lnr lnr-icon-search"></i></button>
																	</form>
																</div>
															</div>
														</div>
														<div class="elementor-element elementor-element-cafcfa8 elementor-widget elementor-widget-tm-ele-header-primary-nav"
															data-id="cafcfa8" data-element_type="widget"
															data-widget_type="tm-ele-header-primary-nav.default">
															<div class="elementor-widget-container">
																<nav id="top-primary-nav-elementor-id-holder-757790"
																	class="menuzord-primary-nav menuzord menuzord-responsive">
																	<ul id="main-nav-id-holder-757790"
																		class="menuzord-menu">
																		<li id="menu-item-30054"
																			class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30054 menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-30034">
																			<a title="Home" class="menu-item-link"
																				onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#home'; } else { window.location.href = '#home'; } document.getElementById('navclose').click();"><span>Home</span>
																			</a>
																		</li>
																		<li id="menu-item-30054"
																			class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30054 menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-30034">
																			<a title="About Us" class="menu-item-link"
																				onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#aboutus'; } else { window.location.href = '#aboutus'; } document.getElementById('navclose').click();"><span>About Us</span>
																			</a>
																		</li>
																		<li id="menu-item-30054"
																			class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30054 menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-30034">
																			<a title="Services" class="menu-item-link"
																				onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#services'; } else { window.location.href = '#services'; } document.getElementById('navclose').click();"><span>Services</span>
																			</a>
																		</li>
																		<li id="menu-item-30054"
																			class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30054 menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-30034">
																			<a title="Shop" class="menu-item-link"
																				onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#shop'; } else { window.location.href = '#shop'; } document.getElementById('navclose').click();"><span>Shop</span>
																			</a>
																		</li>
																			<li id="menu-item-30054"
																				class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30054 menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-30034">
																				<a title="Contact Us" class="menu-item-link"
																					onclick="if (!window.location.pathname.includes('index.html')) { window.location.href = './index.html#contactus'; } else { window.location.href = '#contactus'; } document.getElementById('navclose').click();"><span>Contact Us</span>
																				</a>
																			</li>


																	</ul>
																</nav>
															</div>
														</div>
													</div>
												</div>
											</div>
										</section>
									</div>
								</div>
							</div>
							<div class="tm-header-menu-backdrop"></div>
						</div>
					</div>
					<div id="tm-nav-mobile">
						<div class="tm-nav-mobile-button"><span></span></div>
					</div>
				</div>
			</div>
		</div>
	`
}
if(document.getElementById('footer')){
	document.getElementById('footer').innerHTML=`
		<div class="footer-widget-area">
			<div class="container">
				<div class="row">
					<div class="col-md-12">
						<!-- the loop -->
						<style id="elementor-post-27948">
							.elementor-27948 .elementor-element.elementor-element-9c7bf9a:not(.elementor-motion-effects-element-type-background),
							.elementor-27948 .elementor-element.elementor-element-9c7bf9a>.elementor-motion-effects-container>.elementor-motion-effects-layer {
								background-color: #2B3530;
							}

							.elementor-27948 .elementor-element.elementor-element-9c7bf9a {
								border-style: solid;
								border-width: 0px 0px 1px 0px;
								border-color: #6E6E6E59;
								transition: background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s;
								padding: 20px 0px 20px 0px;
							}

							.elementor-27948 .elementor-element.elementor-element-9c7bf9a>.elementor-background-overlay {
								transition: background 0.3s, border-radius 0.3s, opacity 0.3s;
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .tm-sc-icon-box {
								text-align: left;
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .icon {
								margin: 0px 0px 0px 0px;
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .icon i {
								color: var(--theme-color1);
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .icon svg {
								fill: var(--theme-color1);
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .icon-wrapper .icon-bg-img {
								left: 0%;
								top: 0%;
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115:hover .icon-wrapper .icon-bg-img {
								left: 0%;
								top: 0%;
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .icon-box-title,
							.elementor-27948 .elementor-element.elementor-element-3cde115 .icon-box-title a {
								font-family: "Covered By Your Grace", Sans-serif;
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .icon-box-title {
								margin: 0px 0px 0px 0px;
								color: #99A59E;
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .icon-box-title a {
								color: #99A59E;
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .content {
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-3cde115 .content * {
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-8440601 img {
								width: 135px;
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .tm-sc-icon-box {
								text-align: left;
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .icon {
								margin: 0px 0px 0px 0px;
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .icon i {
								color: var(--theme-color1);
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .icon svg {
								fill: var(--theme-color1);
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .icon-wrapper .icon-bg-img {
								left: 0%;
								top: 0%;
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb:hover .icon-wrapper .icon-bg-img {
								left: 0%;
								top: 0%;
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .icon-box-title,
							.elementor-27948 .elementor-element.elementor-element-85d4fcb .icon-box-title a {
								font-family: "Covered By Your Grace", Sans-serif;
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .icon-box-title {
								margin: 0px 0px 0px 0px;
								color: #99A59E;
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .icon-box-title a {
								color: #99A59E;
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .content {
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-85d4fcb .content * {
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-6edaf8c0:not(.elementor-motion-effects-element-type-background),
							.elementor-27948 .elementor-element.elementor-element-6edaf8c0>.elementor-motion-effects-container>.elementor-motion-effects-layer {
								background-color: #2B3530;
							}

							.elementor-27948 .elementor-element.elementor-element-6edaf8c0>.elementor-background-overlay {
								background-image: url("../wp-content/uploads/2021/06/footer.png");
								background-position: bottom left;
								background-repeat: no-repeat;
								background-size: 46% auto;
								opacity: 0.5;
								transition: background 0.3s, border-radius 0.3s, opacity 0.3s;
							}

							.elementor-27948 .elementor-element.elementor-element-6edaf8c0 {
								transition: background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s;
								padding: 80px 0px 85px 0px;
							}

							.elementor-27948 .elementor-element.elementor-element-c9b9942 .tm-text-editor {
								margin-top: 0;
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-c9b9942 .tm-text-editor * {
								margin-top: 0;
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-77f2ba5 .tm-text-editor {
								margin-top: 0;
								color: #BBBBBB;
							}

							.elementor-27948 .elementor-element.elementor-element-77f2ba5 .tm-text-editor * {
								margin-top: 0;
								color: #BBBBBB;
							}

							.elementor-27948 .elementor-element.elementor-element-eca21e8 .tm-sc-social-links {
								justify-content: default;
							}

							.elementor-27948 .elementor-element.elementor-element-eca21e8 .social-link {
								color: #9AA59F;
								background-color: #28332D;
							}

							.elementor-27948 .elementor-element.elementor-element-eca21e8 .social-link:hover {
								color: var(--theme-color3) !important;
								background-color: var(--theme-color1) !important;
							}

							.elementor-27948 .elementor-element.elementor-element-39237980 .tm-text-editor {
								margin-top: 0;
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-39237980 .tm-text-editor * {
								margin-top: 0;
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-7163ba4 .tm-sc-simple-nav-menu li .tm-nav-arrow-icon {
								display: none;
							}

							.elementor-27948 .elementor-element.elementor-element-7163ba4 .tm-sc-simple-nav-menu li {
								color: #BBBBBB;
							}

							.elementor-27948 .elementor-element.elementor-element-7163ba4 .tm-sc-simple-nav-menu li a {
								color: #BBBBBB;
								padding: 0px 0px 0px 0px;
							}

							.elementor-27948 .elementor-element.elementor-element-7163ba4 .tm-sc-simple-nav-menu li a:hover {
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-7b360fc7 .tm-text-editor {
								margin-top: 0;
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-7b360fc7 .tm-text-editor * {
								margin-top: 0;
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-ddeefd6 .tm-sc-simple-nav-menu li .tm-nav-arrow-icon {
								display: none;
							}

							.elementor-27948 .elementor-element.elementor-element-ddeefd6 .tm-sc-simple-nav-menu li {
								color: #BBBBBB;
							}

							.elementor-27948 .elementor-element.elementor-element-ddeefd6 .tm-sc-simple-nav-menu li a {
								color: #BBBBBB;
								padding: 0px 0px 0px 0px;
							}

							.elementor-27948 .elementor-element.elementor-element-ddeefd6 .tm-sc-simple-nav-menu li a:hover {
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-a1e2e09 .tm-text-editor {
								margin-top: 0;
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-a1e2e09 .tm-text-editor * {
								margin-top: 0;
								color: #FFFFFF;
							}

							.elementor-27948 .elementor-element.elementor-element-89cb25c .tm-text-editor {
								margin-top: 0;
								color: #BBBBBB;
							}

							.elementor-27948 .elementor-element.elementor-element-89cb25c .tm-text-editor * {
								margin-top: 0;
								color: #BBBBBB;
							}

							.elementor-27948 .elementor-element.elementor-element-0b71f7f .tm-mc4wp-newsletter .mc4wp-form-fields {
								display: flex;
								flex-direction: column;
							}

							.elementor-27948 .elementor-element.elementor-element-0b71f7f .tm-mc4wp-newsletter input[type="email"] {
								width: 100%;
								background-color: #FFFFFF;
								color: #323E37;
								border-radius: 6px 6px 6px 6px;
								padding: 20px 20px 20px 20px;
								margin: 0px 0px 15px 0px;
							}

							.elementor-27948 .elementor-element.elementor-element-0b71f7f .tm-mc4wp-newsletter [type="submit"] {
								background-color: var(--theme-color1);
								border-radius: 6px 6px 6px 6px;
								padding: 10px 10px 10px 10px;
							}

							.elementor-27948 .elementor-element.elementor-element-0b71f7f .tm-mc4wp-newsletter [type="submit"]:hover {
								background-color: var(--theme-color2);
							}

							.elementor-27948 .elementor-element.elementor-element-5fcdc0f:not(.elementor-motion-effects-element-type-background),
							.elementor-27948 .elementor-element.elementor-element-5fcdc0f>.elementor-motion-effects-container>.elementor-motion-effects-layer {
								background-color: #272F2B;
							}

							.elementor-27948 .elementor-element.elementor-element-5fcdc0f {
								transition: background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s;
								padding: 20px 0px 20px 0px;
							}

							.elementor-27948 .elementor-element.elementor-element-5fcdc0f>.elementor-background-overlay {
								transition: background 0.3s, border-radius 0.3s, opacity 0.3s;
							}

							.elementor-27948 .elementor-element.elementor-element-004ba54 {
								text-align: center;
								color: #BBBBBB;
							}

							@media(min-width:768px) {
								.elementor-27948 .elementor-element.elementor-element-a1614f9 {
									width: 30.324%;
								}

								.elementor-27948 .elementor-element.elementor-element-77c7616 {
									width: 42.999%;
								}

								.elementor-27948 .elementor-element.elementor-element-77c3258 {
									width: 26.341%;
								}

								.elementor-27948 .elementor-element.elementor-element-6c5cafed {
									width: 28.493%;
								}

								.elementor-27948 .elementor-element.elementor-element-5bb44d2d {
									width: 18.069%;
								}

								.elementor-27948 .elementor-element.elementor-element-fccea11 {
									width: 19.068%;
								}

								.elementor-27948 .elementor-element.elementor-element-327b91ae {
									width: 34.35%;
								}
							}

							@media(max-width:1024px) and (min-width:768px) {
								.elementor-27948 .elementor-element.elementor-element-6c5cafed {
									width: 50%;
								}

								.elementor-27948 .elementor-element.elementor-element-5bb44d2d {
									width: 50%;
								}

								.elementor-27948 .elementor-element.elementor-element-fccea11 {
									width: 50%;
								}

								.elementor-27948 .elementor-element.elementor-element-327b91ae {
									width: 50%;
								}
							}

							@media(max-width:1200px) {
								.elementor-27948 .elementor-element.elementor-element-6edaf8c0 {
									padding: 80px 0px 75px 0px;
								}
							}

							@media(max-width:1024px) {
								.elementor-27948 .elementor-element.elementor-element-9c7bf9a {
									padding: 0px 0px 15px 0px;
								}

								.elementor-27948 .elementor-element.elementor-element-3cde115 .tm-sc-icon-box {
									text-align: center;
								}

								.elementor-27948 .elementor-element.elementor-element-6edaf8c0>.elementor-background-overlay {
									background-size: cover;
								}

								.elementor-27948 .elementor-element.elementor-element-6edaf8c0 {
									padding: 80px 0px 85px 0px;
								}

								.elementor-27948 .elementor-element.elementor-element-6c5cafed>.elementor-element-populated {
									margin: 0px 0px 25px 0px;
									--e-column-margin-right: 0px;
									--e-column-margin-left: 0px;
								}

								.elementor-27948 .elementor-element.elementor-element-5bb44d2d>.elementor-element-populated {
									margin: 0px 0px 25px 0px;
									--e-column-margin-right: 0px;
									--e-column-margin-left: 0px;
								}
							}

							@media(max-width:767px) {
								.elementor-27948 .elementor-element.elementor-element-9c7bf9a {
									padding: 10px 0px 20px 0px;
								}

								.elementor-27948 .elementor-element.elementor-element-3cde115>.elementor-widget-container {
									margin: 0px 0px 5px 0px;
								}

								.elementor-27948 .elementor-element.elementor-element-6c5cafed {
									width: 100%;
								}

								.elementor-27948 .elementor-element.elementor-element-5bb44d2d {
									width: 100%;
								}

								.elementor-27948 .elementor-element.elementor-element-5bb44d2d>.elementor-element-populated {
									margin: 0px 0px 15px 0px;
									--e-column-margin-right: 0px;
									--e-column-margin-left: 0px;
								}

								.elementor-27948 .elementor-element.elementor-element-fccea11 {
									width: 100%;
								}

								.elementor-27948 .elementor-element.elementor-element-fccea11>.elementor-element-populated {
									margin: 0px 0px 15px 0px;
									--e-column-margin-right: 0px;
									--e-column-margin-left: 0px;
								}

								.elementor-27948 .elementor-element.elementor-element-7b360fc7 .tm-text-editor {
									margin-bottom: 0;
								}

								.elementor-27948 .elementor-element.elementor-element-7b360fc7 .tm-text-editor * {
									margin-bottom: 0;
								}

								.elementor-27948 .elementor-element.elementor-element-327b91ae {
									width: 100%;
								}

								.elementor-27948 .elementor-element.elementor-element-a1e2e09 .tm-text-editor {
									margin-bottom: 0;
								}

								.elementor-27948 .elementor-element.elementor-element-a1e2e09 .tm-text-editor * {
									margin-bottom: 0;
								}
							}
						</style>
						<div data-elementor-type="wp-post" data-elementor-id="27948"
							class="elementor elementor-27948">
							<section
								class="elementor-section elementor-top-section elementor-element elementor-element-9c7bf9a elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-height-default tm-col-stretched-none tm-bg-color-over-image"
								data-id="9c7bf9a" data-element_type="section"
								data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
								<div class="elementor-container elementor-column-gap-extended">
									<div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-a1614f9 tm-bg-color-over-image"
										data-id="a1614f9" data-element_type="column">
										<div class="elementor-widget-wrap elementor-element-populated">
											<div class="elementor-element elementor-element-3cde115 elementor-widget elementor-widget-tm-ele-iconbox"
												data-id="3cde115" data-element_type="widget"
												data-widget_type="tm-ele-iconbox.default">
												<div class="elementor-widget-container">
													<div
														class="tm-sc-icon-box icon-box icon-left tm-iconbox-icontype-font-icon iconbox-centered-in-responsive-tablet iconbox-centered-in-responsive-mobile icon-position-icon-left animate-icon-on-hover animate-icon-rotate">

														<div class="icon-box-wrapper">

															<div class="icon-wrapper">
																<div
																	class="icon icon-type-font-icon icon-md icon-default-bg icon-circled">
																	<i aria-hidden="true"
																		class=" flaticon-contact-043-email-1"></i>
																</div>

															</div>
															<div class="icon-text">

																<h5 class="icon-box-title ">
																	Visit Us </h5>
																<div class="content">
																	<a href="mailto:${orgData.data[0].email}" class="__cf_email__" data-cfemail="9bd5fefefff3fef7ebdbfff4f6faf2f5b5f8f4f6">
																		${orgData.data[0].email}
																	</a>
																</div>



															</div>
															<div class="clearfix"></div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-77c7616 tm-bg-color-over-image"
										data-id="77c7616" data-element_type="column">
										<div class="elementor-widget-wrap elementor-element-populated">
											<div class="elementor-element elementor-element-8440601 elementor-widget elementor-widget-image"
												data-id="8440601" data-element_type="widget"
												data-widget_type="image.default">
												<div class="elementor-widget-container">
													<img loading="lazy" decoding="async" width="250" height="148"
														src="${orgData.data[0].logo??'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}"
														class="attachment-full size-full wp-image-35011" alt="" />
												</div>
											</div>
										</div>
									</div>
									<div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-77c3258 tm-bg-color-over-image"
										data-id="77c3258" data-element_type="column">
										<div class="elementor-widget-wrap elementor-element-populated">
											<div class="elementor-element elementor-element-85d4fcb elementor-widget elementor-widget-tm-ele-iconbox"
												data-id="85d4fcb" data-element_type="widget"
												data-widget_type="tm-ele-iconbox.default">
												<div class="elementor-widget-container">
													<div
														class="tm-sc-icon-box icon-box icon-left tm-iconbox-icontype-font-icon iconbox-centered-in-responsive-tablet iconbox-centered-in-responsive-mobile icon-position-icon-left animate-icon-on-hover animate-icon-rotate">

														<div class="icon-box-wrapper">

															<div class="icon-wrapper">
																<div
																	class="icon icon-type-font-icon icon-md icon-default-bg icon-circled">
																	<i aria-hidden="true"
																		class=" flaticon-contact-045-call"></i>
																</div>

															</div>
															<div class="icon-text">

																<h5 class="icon-box-title ">
																	Call Now </h5>
																<div class="content">${orgData.data[0].phone}</div>



															</div>
															<div class="clearfix"></div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>
							<section
								class="elementor-section elementor-top-section elementor-element elementor-element-6edaf8c0 elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-height-default tm-col-stretched-none tm-bg-color-over-image"
								data-id="6edaf8c0" data-element_type="section"
								data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
								<div class="elementor-background-overlay"></div>
								<div class="elementor-container elementor-column-gap-extended">
									<div class="elementor-column elementor-col-25 elementor-top-column elementor-element elementor-element-6c5cafed tm-bg-color-over-image"
										data-id="6c5cafed" data-element_type="column">
										<div class="elementor-widget-wrap elementor-element-populated">
											<div class="elementor-element elementor-element-c9b9942 elementor-widget elementor-widget-tm-ele-text-editor"
												data-id="c9b9942" data-element_type="widget"
												data-widget_type="tm-ele-text-editor.default">
												<div class="elementor-widget-container">
													<div class="tm-text-editor">
														<h4>About</h4>
													</div>
												</div>
											</div>
											<div class="elementor-element elementor-element-77f2ba5 elementor-widget elementor-widget-tm-ele-text-editor"
												data-id="77f2ba5" data-element_type="widget"
												data-widget_type="tm-ele-text-editor.default">
												<div class="elementor-widget-container">
													<div class="tm-text-editor">
														Global XT Limited is a Nigerian agro-export company delivering premium commodities like sesame seeds, cashew nuts, cowpeas, and ginger to global markets.
We connect local farmers to international buyers — with integrity, quality, and certified logistics. </div>
												</div>
											</div>
											<div class="elementor-element elementor-element-eca21e8 elementor-widget elementor-widget-tm-ele-social-links"
												data-id="eca21e8" data-element_type="widget"
												data-widget_type="tm-ele-social-links.default">
												<div class="elementor-widget-container">
													<ul class="tm-sc-social-links icon-lg links-outlined icon-dark">

														<li><a class="social-link" aria-label="Social Link" href="#"
																target="_self"><i class="fa fa-twitter"></i></a>
														</li>
														<li><a class="social-link" aria-label="Social Link" href="#"
																target="_self"><i class="fa fa-facebook"></i></a>
														</li>
														<li><a class="social-link" aria-label="Social Link" href="#"
																target="_self"><i class="fa fa-youtube"></i></a>
														</li>


														<li><a class="social-link" aria-label="Social Link" href="#"
																target="_self"><i class="fa fa-linkedin"></i></a>
														</li>

													</ul>
												</div>
											</div>
										</div>
									</div>
									<div class="elementor-column elementor-col-25 elementor-top-column elementor-element elementor-element-5bb44d2d tm-bg-color-over-image"
										data-id="5bb44d2d" data-element_type="column">
										<div class="elementor-widget-wrap elementor-element-populated">
											<div class="elementor-element elementor-element-39237980 elementor-widget elementor-widget-tm-ele-text-editor"
												data-id="39237980" data-element_type="widget"
												data-widget_type="tm-ele-text-editor.default">
												<div class="elementor-widget-container">
													<div class="tm-text-editor">
														<h4>Links</h4>
													</div>
												</div>
											</div>
											<div class="elementor-element elementor-element-7163ba4 elementor-widget elementor-widget-tm-ele-navigation-menu"
												data-id="7163ba4" data-element_type="widget"
												data-widget_type="tm-ele-navigation-menu.default">
												<div class="elementor-widget-container">
													<div class="tm-sc-simple-nav-menu">
														<ul id="menu-useful-links" class="">
															<li id="menu-item-30050"
																class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-30050">
																<a  href="./index.html"><i
																		class="tm-nav-arrow-icon fas fa-caret-right"></i>Home</a>
															</li>
															<li id="menu-item-30018"
																class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30018">
																<a
																	 href="./aboutus.html"><i
																		class="tm-nav-arrow-icon fas fa-caret-right"></i>About
																	Us</a>
															</li>
															<li id="menu-item-30020"
																class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30020">
																<a
																	 href="./shop.html"><i
																		class="tm-nav-arrow-icon fas fa-caret-right"></i>Our
																	Projects</a>
															</li>
															<li id="menu-item-30076"
																class="menu-item menu-item-type-post_type menu-item-object-page menu-item-30076">
																<a
																	style="display: none" href="https://Wp2022.kodesolution.com/organek/team-grid/"><i
																		class="tm-nav-arrow-icon fas fa-caret-right"></i>Meet
																	The Team</a>
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="d-none elementor-column elementor-col-25 elementor-top-column elementor-element elementor-element-fccea11 tm-bg-color-over-image"
										data-id="fccea11" data-element_type="column">
										<div class="elementor-widget-wrap elementor-element-populated">
											<div class="elementor-element elementor-element-7b360fc7 elementor-widget elementor-widget-tm-ele-text-editor"
												data-id="7b360fc7" data-element_type="widget"
												data-widget_type="tm-ele-text-editor.default">
												<div class="elementor-widget-container">
													<div class="tm-text-editor">
														<h4>Explore</h4>
													</div>
												</div>
											</div>
											<div class="elementor-element elementor-element-ddeefd6 elementor-widget elementor-widget-tm-ele-navigation-menu"
												data-id="ddeefd6" data-element_type="widget"
												data-widget_type="tm-ele-navigation-menu.default">
												<div class="elementor-widget-container">
													<div class="tm-sc-simple-nav-menu">
														<ul id="menu-footer-useful-links" class="">
															<li id="menu-item-30042"
																class="menu-item menu-item-type-post_type menu-item-object-services menu-item-30042">
																<a
																	style="display: none" href="https://Wp2022.kodesolution.com/organek/services/organic-products/"><i
																		class="tm-nav-arrow-icon fas fa-caret-right"></i>Organic
																	Products</a>
															</li>
															<li id="menu-item-30040"
																class="menu-item menu-item-type-post_type menu-item-object-services menu-item-30040">
																<a
																	style="display: none" href="https://Wp2022.kodesolution.com/organek/services/fresh-vegetables/"><i
																		class="tm-nav-arrow-icon fas fa-caret-right"></i>Fresh
																	Vegetables</a>
															</li>
															<li id="menu-item-30041"
																class="menu-item menu-item-type-post_type menu-item-object-services menu-item-30041">
																<a
																	style="display: none" href="https://Wp2022.kodesolution.com/organek/services/dairy-production/"><i
																		class="tm-nav-arrow-icon fas fa-caret-right"></i>Dairy
																	Production</a>
															</li>
															<li id="menu-item-30044"
																class="menu-item menu-item-type-post_type menu-item-object-services menu-item-30044">
																<a
																	style="display: none" href="https://Wp2022.kodesolution.com/organek/services/water-irrigation/"><i
																		class="tm-nav-arrow-icon fas fa-caret-right"></i>Water
																	Irrigation</a>
															</li>
															<li id="menu-item-30043"
																class="menu-item menu-item-type-post_type menu-item-object-services menu-item-30043">
																<a
																	style="display: none" href="https://Wp2022.kodesolution.com/organek/services/organic-fertiliser/"><i
																		class="tm-nav-arrow-icon fas fa-caret-right"></i>Organic
																	Fertilizer</a>
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="elementor-column elementor-col-25 elementor-top-column elementor-element elementor-element-327b91ae tm-bg-color-over-image"
										data-id="327b91ae" data-element_type="column">
										<div class="elementor-widget-wrap elementor-element-populated">
											<div class="elementor-element elementor-element-a1e2e09 elementor-widget elementor-widget-tm-ele-text-editor"
												data-id="a1e2e09" data-element_type="widget"
												data-widget_type="tm-ele-text-editor.default">
												<div class="elementor-widget-container">
													<div class="tm-text-editor">
														<h4>Newsletter</h4>
													</div>
												</div>
											</div>
											<div class="elementor-element elementor-element-89cb25c elementor-widget elementor-widget-tm-ele-text-editor"
												data-id="89cb25c" data-element_type="widget"
												data-widget_type="tm-ele-text-editor.default">
												<div class="elementor-widget-container">
													<div class="tm-text-editor">
														<p>Sing up now to get monthly news and updates</p>
													</div>
												</div>
											</div>
											<div class="elementor-element elementor-element-0b71f7f elementor-widget elementor-widget-tm-ele-newsletter"
												data-id="0b71f7f" data-element_type="widget"
												data-widget_type="tm-ele-newsletter.default">
												<div class="elementor-widget-container">
													<div class="tm-mc4wp-newsletter form-style-classic">
														<script data-cfasync="false"
															src="../../cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
														<script>(function () {
																window.mc4wp = window.mc4wp || {
																	listeners: [],
																	forms: {
																		on: function (evt, cb) {
																			window.mc4wp.listeners.push(
																				{
																					event: evt,
																					callback: cb
																				}
																			);
																		}
																	}
																}
															})();
														</script><!-- Mailchimp for WordPress v4.10.5 - https://wordpress.org/plugins/mailchimp-for-wp/ -->
														<form id="mc4wp-form-1" class="mc4wp-form mc4wp-form-322"
															method="post" data-id="322" data-name="Newsletter">
															<div class="mc4wp-form-fields"><input type="email"
																	name="EMAIL" placeholder="Your Email Address"
																	required="">
																<input type="submit" value="Subscribe">
															</div><label style="display: none !important;">Leave
																this field empty if you're human: <input type="text"
																	name="_mc4wp_honeypot" value="" tabindex="-1"
																	autocomplete="off" /></label><input
																type="hidden" name="_mc4wp_timestamp"
																value="1751839751" /><input type="hidden"
																name="_mc4wp_form_id" value="322" /><input
																type="hidden" name="_mc4wp_form_element_id"
																value="mc4wp-form-1" />
															<div class="mc4wp-response"></div>
														</form><!-- / Mailchimp for WordPress Plugin -->
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>
							<section
								class="elementor-section elementor-top-section elementor-element elementor-element-5fcdc0f elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-height-default tm-col-stretched-none tm-bg-color-over-image"
								data-id="5fcdc0f" data-element_type="section"
								data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
								<div class="elementor-container elementor-column-gap-default">
									<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-fdbc852 tm-bg-color-over-image"
										data-id="fdbc852" data-element_type="column">
										<div class="elementor-widget-wrap elementor-element-populated">
											<div class="elementor-element elementor-element-004ba54 elementor-widget elementor-widget-text-editor"
												data-id="004ba54" data-element_type="widget"
												data-widget_type="text-editor.default">
												<div class="elementor-widget-container">
												<p>© Copyright <span id="current-year"></span> by Global XT Limited</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>
						</div>
						<!-- end of the loop -->
					</div>
				</div>
			</div>
		</div>
	`;
}
document.getElementById('current-year').textContent = new Date().getFullYear();


