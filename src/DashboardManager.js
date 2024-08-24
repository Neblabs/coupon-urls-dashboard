import { textDomain } from "./CouponURLs";
import { security } from "./CouponURLs";
import { __ } from "./globals";

class DashboardManager {
    state = {
        isOpen: false
    }

    fieldElements = {}

    beforeSaveEvents = [
        this.validate,
        this.updateStateToFormElements
    ]
    saveValidators = [
        this.noActionsValidator,
        this.noMainPathValidator,
    ]

    constructor(store) {
        this.store = store
        this.createElements()
        this.createDashboardOpenCloseEvent()
        this.createSaveEvents()
        this.registerInitEvent()
    }

    open() 
    {
        this.beforeOpen()
        if (!this.state.isOpen) {
            this.state.isOpen = true;
            $(this.getMainElement()).removeClass('hidden')
        }
    }

    close() 
    {
        this.beforeClose()
        if (this.state.isOpen) {
            this.state.isOpen = false;
            $(this.getMainElement()).addClass('hidden')
        }
    }

    getMainElement() 
    {
        return document.getElementById('coupon_urls')
    }

    getSwitchToClassicButtonElement() 
    {
        return document.getElementById('cu-view-switch-to-classic')
    }

    addDashboardButtons() 
    {
        window.document.body.classList.add('coupon_urls')

        const urlsButton = `<button class="coupon_urls--open-button h-[30px] inline-flex flex-row items-center justify-center px-2 bg-[#6c90e0] text-gray-100 rounded-4 space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="min-w-4 max-w-4 min-h-4 max-h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"></path></svg>
            <span>Configure URL</span>
        </button>`

        $('#titlewrap').append(urlsButton)

        $('.woocommerce-layout__header-heading').prepend(`
            <button id="cu-view-switch-to-classic" class="hidden flex flex-row items-center space-x-2 px-5 ml-[calc(var(--large-gap)*-1)] h-full border-r-px border-gray-200 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>
                    ${__('Back', textDomain)}
                </span>
            </button>
        `) 
    }

    createElements() {
        this.addDashboardButtons()

        const urlParams = new URLSearchParams(window.location.search);
        const openedByDefault = urlParams.get('coupon-urls-opened') === 'true';

        $('#wpbody-content').append(`<div id="coupon_urls" class="${openedByDefault || 'hidden'} left-0 top-0 z-[1000] w-full h-full relative bg-gray-200"><div>`)

        const form = document.querySelector('form#post')

        const fields = [
            'coupon_urls_state',
            'coupon_urls_dashboard_nonce'
        ]

        fields.forEach(field => {
            const fieldElement = document.createElement('input')

            fieldElement.type = 'hidden'
            fieldElement.id = field
            fieldElement.name = field
            
            form.append(fieldElement)
            this.fieldElements[field] = fieldElement
        });
    }

    createDashboardOpenCloseEvent() 
    {
        $('.coupon_urls--open-button').on('click', (event) => {
            event.preventDefault()
            this.open()
        })

        this.getSwitchToClassicButtonElement().addEventListener('click', () => {
            this.close()
        })
    }
    createSaveEvents() {
        document.querySelector('#publish.button').addEventListener('click', (event) => {
            this.beforeSaveEvents
                .map(runner => runner.bind(this, event))
                .forEach(runner => runner())
        }, true);
    }

    registerInitEvent() 
    {
        window.addEventListener(
            'load', 
            () => document.dispatchEvent(new CustomEvent('CouponURLsInit', {detail: {manager: this}}))
        )
    }

    beforeOpen() 
    {
        this.getSwitchToClassicButtonElement().classList.remove('hidden')
    }

    beforeClose() 
    {
        this.getSwitchToClassicButtonElement().classList.add('hidden')   
    }

    validate(event) 
    {
        if (!this.store.getState().options.isEnabled) {
            return
        }
        
        const errorMessage = this.runValidators()

        if (errorMessage) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            alert(errorMessage)
        }
    }   

    runValidators() 
    {
        let errorMessage = null;

        this.saveValidators.map(validator => validator.bind(this))
                           .find(validator => errorMessage = validator())

        return errorMessage
    }

    noMainPathValidator() 
    {
        //,aybe only when this is actually enabled!
        if (this.store.getState().uri.type === 'path' && !this.store.getState().uri.value.replace('/', '')) {
            return __('You need to select a path - Coupon URLs')
        }
    }

    noActionsValidator() 
    {
        if (!this.store.getState().actions.length) {
            return __('You need to add one or more actions - Coupon URLs')
        }
    }

    updateStateToFormElements(event) 
    {
        this.fieldElements['coupon_urls_state'].value = JSON.stringify(this.store.getState())
        this.fieldElements['coupon_urls_dashboard_nonce'].value = security.nonce.value
    }
}

export default DashboardManager;