//
//   Core Framework - Script file
//
//   @license    MIT (https://mit-license.org/)
//   @author     Louis Ouellet <louis@laswitchtech.com>
//

const LeadForm = function(form,values = {},modal = null){

    // Initialize Values
    var Values = {
        name: null,
        dba: null,
        businessNumber: null,
        taxExtension: null,
        importerExtension: null,
        address: null,
        city: null,
        country: null,
        state: null,
        zipcode: null,
        email: null,
        fax: null,
        phone: null,
        mobile: null,
        tollfree: null,
        locale: null,
        website: null,
        tags: null,
        industries: null,
    };

    // Set Values
    if(values){
        for(const [key, value] of Object.entries(values)){
            if(typeof Values[key] !== 'undefined'){
                Values[key] = value;
            }
        }
    }

    // csrf
    form.add(
        {
            name: CSRF_KEY,
            label: 'csrf',
            icon: 'hash',
            type: 'hidden',
            value: CSRF_TOKEN,
        },
        function(input,form){
            input.css('display','none');
        },
    );

    // name
    form.add(
        {
            name: 'name',
            label: builder.Locale.get('Business name'),
            icon: 'hash',
            type: 'text',
            value: Values.name,
            class: {
                field: 'col-12',
                label: 'text-bg-primary',
            },
        }
    );

    // dba
    form.add(
        {
            name: 'dba',
            label: builder.Locale.get('Doing Business As'),
            icon: 'hash',
            type: 'text',
            value: Values.dba,
            class: {
                field: 'col-12',
            },
        }
    );

    // businessNumber
    form.add(
        {
            name: 'businessNumber',
            label: builder.Locale.get('Business Number'),
            icon: 'hash',
            type: 'text',
            value: Values.businessNumber,
            class: {
                field: 'col-4',
            },
        }
    );

    // taxExtension
    form.add(
        {
            name: 'taxExtension',
            label: builder.Locale.get('Tax Extension'),
            icon: 'hash',
            type: 'text',
            value: Values.taxExtension,
            class: {
                field: 'col-4',
            },
        }
    );

    // importerExtension
    form.add(
        {
            name: 'importerExtension',
            label: builder.Locale.get('Importer Extension'),
            icon: 'hash',
            type: 'text',
            value: Values.importerExtension,
            class: {
                field: 'col-4',
            },
        }
    );

    // address
    form.add(
        {
            name: 'address',
            label: builder.Locale.get('Address'),
            icon: 'pin-map',
            type: 'text',
            value: Values.address,
            class: {
                field: 'col-7',
                label: 'text-bg-primary',
            },
        }
    );

    // city
    form.add(
        {
            name: 'city',
            label: builder.Locale.get('City'),
            icon: 'geo-alt',
            type: 'text',
            value: Values.city,
            class: {
                field: 'col-5',
                label: 'text-bg-primary',
            },
        }
    );

    // country
    form.add(
        {
            name: 'country',
            label: 'Country',
            icon: 'geo-alt',
            type: 'country',
            value: Values.country,
            modal: modal,
            class: {
                field: 'col',
                label: 'text-bg-primary',
            },
        }
    );

    // state
    form.add(
        {
            name: 'state',
            label: 'State',
            icon: 'geo-alt',
            type: 'state',
            value: Values.state,
            modal: modal,
            class: {
                field: 'col',
                label: 'text-bg-primary',
            },
        }
    );

    // zipcode
    form.add(
        {
            name: 'zipcode',
            label: builder.Locale.get('Zip Code'),
            icon: 'geo',
            type: 'zipcode',
            value: Values.zipcode,
            class: {
                field: 'col',
                label: 'text-bg-primary',
            },
        }
    );

    // email
    form.add(
        {
            name: 'email',
            label: builder.Locale.get('E-Mail'),
            icon: 'at',
            type: 'email',
            value: Values.email,
            class: {
                field: 'col-8',
                label: 'text-bg-primary',
            },
        }
    );

    // fax
    form.add(
        {
            name: 'fax',
            label: builder.Locale.get('Fax'),
            icon: 'telephone-outbound',
            type: 'phone',
            value: Values.fax,
            class: {
                field: 'col',
            },
        }
    );

    // phone
    form.add(
        {
            name: 'phone',
            label: builder.Locale.get('Phone'),
            icon: 'telephone',
            type: 'phone-extension',
            value: Values.phone,
            class: {
                field: 'col',
                label: 'text-bg-primary',
            },
        }
    );

    // mobile
    form.add(
        {
            name: 'mobile',
            label: builder.Locale.get('Mobile'),
            icon: 'telephone',
            type: 'phone-extension',
            value: Values.mobile,
            class: {
                field: 'col',
            },
        }
    );

    // tollfree
    form.add(
        {
            name: 'tollfree',
            label: builder.Locale.get('Toll Free'),
            icon: 'telephone-inbound',
            type: 'phone-international',
            value: Values.tollfree,
            class: {
                field: 'col',
            },
        }
    );

    // locale
    form.add(
        {
            name: 'locale',
            label: builder.Locale.get('Language'),
            icon: 'globe-americas',
            type: 'locale',
            value: Values.locale,
            modal: modal,
            class: {
                field: 'col-6',
                label: 'text-bg-primary',
            },
        }
    );

    // website
    form.add(
        {
            name: 'website',
            label: builder.Locale.get('Website'),
            icon: 'globe2',
            type: 'text',
            value: Values.website,
            class: {
                field: 'col-6',
                label: 'text-bg-primary',
            },
        }
    );

    // tags
    form.add(
        {
            name: 'tags',
            label: builder.Locale.get('Tags'),
            icon: 'tags',
            type: 'tags',
            value: Values.tags ?? [],
            modal: modal,
            class: {
                field: 'col-12',
            },
        }
    );

    // industries
    form.add(
        {
            name: 'industries',
            label: builder.Locale.get('Industries'),
            icon: 'building',
            type: 'industries',
            value: Values.industries ?? [],
            modal: modal,
            class: {
                field: 'col-12',
            },
        },
        function(input,form){
            input.removeClass('mb-3');
        },
    );
};
const LeadModalArchive = function(lead, table = null, row = null){

    // Create a modal
    builder.Component(
        "modal",
        null,
        {
            onEnter: false,
            destroy: true,
            icon: "archive",
            title: builder.Locale.get("Are you sure you?"),
            body: builder.Locale.get("Your are about to archive this lead. Are you sure you want to continue?"),
            cancel: false,
            submit: true,
            callback: {
                submit: function(element,modal){

                    // Create a spinner animate-rotate
                    var spinner = $(document.createElement('div')).attr({
                        "class": "animate-rotate rounded-circle border border-secondary border-4 d-none",
                        "style": "width: 96px; height: 96px; border-top-color: var(--bs-primary)!important;",
                    }).appendTo(element);

                    // Hide the dialog
                    element.dialog.addClass('opacity-0');

                    // Setup a spinner while waiting for the modal to be submitted
                    setTimeout(() => {

                        // Hide the dialog
                        element.dialog.hide();

                        // Add flex to the modal
                        element.addClass('d-flex align-items-center justify-content-center');

                        // Show the spinner
                        spinner.removeClass('d-none');

                        // AJAX Request
                        $.ajax({
                            url: '/endpoint.php/leads/archive?id='+lead.id,
                            type: 'GET',dataType: 'json',
                            success: function(response) {

                                // Remove the item from the list
                                if(table && row){
                                    table.delete(row);
                                }

                                // Hide the modal
                                modal.hide();
                            }
                        });
                    }, 300);
                },
            },
        },
        function(modal,component){

            // Save the component
            const componentModal = component;

            // Style the modal
            component.header.addClass('text-bg-dark');
            component.footer.submit.addClass('btn-dark').removeClass('btn-link').attr({
                "style": "border-bottom-right-radius: var(--bs-modal-inner-border-radius) !important;border-bottom-left-radius: var(--bs-modal-inner-border-radius) !important;",
            }).text(builder.Locale.get('Archive'));
            component.footer.submit.icon = $(document.createElement('i')).addClass('bi bi-archive me-1').prependTo(component.footer.submit);

            // Open the modal
            modal.show();
        },
    );
};
const LeadsImportFile = function(callback){
    // Create a Modal to select the file
    builder.Component(
        "modal",
        {
            callback: {
                submit: function(element,modal){

                    // Create a spinner animate-rotate
                    var spinner = $(document.createElement('div')).attr({
                        "class": "animate-rotate rounded-circle border border-secondary border-4 d-none",
                        "style": "width: 96px; height: 96px; border-top-color: var(--bs-primary)!important;",
                    }).appendTo(element);

                    // Hide the dialog
                    element.dialog.addClass('opacity-0');

                    // Setup a spinner while waiting for the modal to be submitted
                    setTimeout(() => {

                        // Hide the dialog
                        element.dialog.hide();

                        // Add flex to the modal
                        element.addClass('d-flex align-items-center justify-content-center');

                        // Show the spinner
                        spinner.removeClass('d-none');

                        // Submit the form
                        element.form.submit();
                    }, 300);
                },
            },
            destroy:true,
            icon: "database-up",
            title: builder.Locale.get("Import"),
            size: "lg",
        },
        function(modal,component){

            // Save Modal Component for select2 fields
            const componentModal = component;

            // Styling
            component.dialog.css('transition','opacity 0.3s');
            component.header.addClass('text-bg-primary');
            component.footer.submit.text(builder.Locale.get('Next')).addClass('btn-primary').removeClass('btn-link');
            component.footer.submit.icon = $(document.createElement('i')).addClass('bi bi-database-up me-1').prependTo(component.footer.submit);

            // Create Form
            component.form = builder.Component(
                'form',
                component.body,
                {
                    callback:{
                        submit: function(form){

                            // Get the values
                            var values = form.val();

                            // Run the files promise
                            values.files.then(fileData => {

                                // Check if a file was selected
                                if(fileData.length > 0){

                                    // Select the file
                                    let file = fileData[Object.keys(fileData)[0]]

                                    // Hide the modal
                                    modal.hide();

                                    // Generate a md5 checksum
                                    builder.Helper.md5(file.content.split(',')[1],function(checksum){

                                        // Save the checksum
                                        file.checksum = checksum;

                                        // Execute the callback
                                        callback(file);
                                    });
                                }
                            }).catch(error => {
                                console.error('Error reading files:', error);
                            });
                        },
                    },
                },
                function(form,component){

                    // file
                    form.add(
                        {
                            name: 'files',
                            label: builder.Locale.get('File(s)'),
                            icon: 'file-earmark-arrow-up',
                            type: 'excel',
                            multiple: false,
                            modal: componentModal,
                        },
                    );

                    // Show the modal
                    modal.show();
                },
            );
        },
    );
};
const LeadsImportAssign = function(file, Columns, Required, Important, Defaults, callback){

    // Create a Modal to select the columns
    builder.Component(
        "modal",
        {
            callback: {
                submit: function(element,modal){

                    // Create a spinner animate-rotate
                    var spinner = $(document.createElement('div')).attr({
                        "class": "animate-rotate rounded-circle border border-secondary border-4 d-none",
                        "style": "width: 96px; height: 96px; border-top-color: var(--bs-primary)!important;",
                    }).appendTo(element);

                    // Hide the dialog
                    element.dialog.addClass('opacity-0');

                    // Setup a spinner while waiting for the modal to be submitted
                    setTimeout(() => {

                        // Hide the dialog
                        element.dialog.hide();

                        // Add flex to the modal
                        element.addClass('d-flex align-items-center justify-content-center');

                        // Show the spinner
                        spinner.removeClass('d-none');

                        // Submit the form
                        element.form.submit();
                    }, 300);
                },
            },
            destroy:true,
            icon: "database-up",
            title: builder.Locale.get("Import"),
            size: "xl",
        },
        function(modal,component){

            // Save the modal
            const modalAssign = modal;

            // Save Modal Component for select2 fields
            const componentModal = component;

            // Styling
            component.dialog.css('transition','opacity 0.3s');
            component.header.addClass('text-bg-primary');
            component.footer.submit.text(builder.Locale.get('Import')).addClass('btn-primary').removeClass('btn-link');
            component.footer.submit.icon = $(document.createElement('i')).addClass('bi bi-database-up me-1').prependTo(component.footer.submit);

            // Create Form
            component.form = builder.Component(
                'form',
                component.body,
                {
                    class: {
                        component: 'row row-cols-2 g-3',
                    },
                    callback:{
                        submit: function(form){

                            // Initialize variables
                            let Records = [];
                            let Errors = [];
                            let Ready = true;

                            const sanitize = function(row, values){

                                // Initialize Objects
                                let Record = {};

                                // Loop through the record to build the header object and the line object
                                for(const [column, match] of Object.entries(values)){

                                    // Check if match is None
                                    if(match === 'None'){
                                        if(typeof Defaults[column] !== 'undefined'){
                                            row[match] = Defaults[column];
                                        }
                                    }

                                    // Check if the column is not required
                                    if(!builder.Helper.inArray(column,Required)){
                                        if(typeof row[match] === 'undefined' || row[match] === null || row[match] === ''){
                                            continue;
                                        }
                                    }

                                    // Check if row[match] is a string
                                    if(typeof row[match] === 'string'){

                                        // Normalize the string
                                        row[match] = builder.Helper.normalize(row[match],'nfd');

                                        // Trim the string
                                        row[match] = row[match].replace(/^\s+|\s+$/g, "");

                                        // Check if the column is tags or industries
                                        if(column === 'tags' || column === 'industries'){

                                            // Trim commas
                                            row[match] = row[match].replace(/(^,)|(,$)/g, "");

                                            // Split the value by comma
                                            row[match] = row[match].split(',');

                                            // Loop through the tags/industries and trim spaces
                                            for(var i = 0; i < row[match].length; i++){
                                                row[match][i] = row[match][i].trim();
                                                // Check if the value is empty
                                                if(row[match][i] === ''){
                                                    row[match].splice(i, 1);
                                                    i--;
                                                }
                                            }
                                        }
                                    }

                                    // Set the value
                                    Record[column] = row[match];
                                }
                                return Record;
                            };

                            // Get the values
                            var values = form.val();

                            // Loop through the json
                            for(const [key, row] of Object.entries(file.json)){

                                var Lead = sanitize(row, values);

                                // Add an empty array for contacts and errors
                                Lead.contacts = [];
                                Lead.errors = [];

                                // Loop through the contact forms
                                form.contacts.forEach(function(contactForm){

                                    // Get the values
                                    var contactValues = contactForm.val();

                                    // Get the contact record
                                    var Contact = sanitize(row, contactValues);

                                    // Check if the contact contains any data
                                    if(Object.keys(Contact).length > 0){

                                        // Check if the Important fields are set
                                        for(const [key, column] of Object.entries(Important)){
                                            if(typeof Contact[column] === 'undefined' || Contact[column] === null || Contact[column] === ''){
                                                return;
                                            }
                                        }

                                        // Add the contact to the lead
                                        Lead.contacts.push(Contact);
                                    }
                                });

                                // Check if the Important fields are set
                                for(const [key, column] of Object.entries(Required)){
                                    if(typeof Lead[column] === 'undefined'){
                                        Lead.errors.push(builder.Locale.get("Missing required field in the selected record.")+" ["+column+"]");
                                        Ready = false;
                                    }
                                }

                                // Check if the Important fields are set
                                for(const [key, column] of Object.entries(Important)){
                                    if(typeof Lead[column] === 'undefined' || Lead[column] === null || Lead[column] === ''){
                                        Lead.errors.push(builder.Locale.get("Missing required value in the selected record.")+" ["+column+"]");
                                        Ready = false;
                                    }
                                }

                                // Check if the Important fields are set
                                for(const [column, value] of Object.entries(Lead)){

                                    // Check if the column is a locale
                                    if(column === 'locale'){

                                        // Check if the value is a valid locale "en-ca" by checking if it is formatted as "xx-xx"
                                        if(!/^[a-z]{2}-[a-z]{2}$/.test(value.toLowerCase())){

                                            Lead.errors.push(builder.Locale.get("Invalid format in the selected record. Field should be formatted as xx-xx.")+" ["+column+"]");
                                            Ready = false;
                                        } else {
                                            Lead[column] = value.toLowerCase();
                                        }
                                    }

                                    // Check if the column is a country or state
                                    if(column === 'country' || column === 'state'){

                                        // Check if the value is a valid country/state "CA/QC" by checking if it is formatted as "xx"
                                        if(!/^[A-Z]{2}$/.test(value.toUpperCase())){

                                            Lead.errors.push(builder.Locale.get("Invalid format in the selected record. Field should be formatted as xx.")+" ["+column+"]");
                                            Ready = false;
                                        } else {
                                            Lead[column] = value.toUpperCase();
                                        }
                                    }
                                }

                                // Check if the Important fields are set
                                if(Ready){

                                    // Add to the records
                                    Records.push(Lead);
                                } else {

                                    // Add to the errors
                                    Errors.push(Lead);
                                }
                            }

                            // Check if the records are empty or if the file is not ready
                            if(Records.length === 0 && Errors.length === 0){
                                builder.Toast.add(
                                    {
                                        icon: "exclamation-diamond",
                                        title: builder.Locale.get("Error"),
                                        body: builder.Locale.get("The file did not return any valid data."),
                                        color: "danger"
                                    },
                                    function(toast){

                                        // Remove the Spinner
                                        componentModal.find('.animate-rotate').remove();

                                        // Reset the Dialog
                                        componentModal.removeClass('d-flex align-items-center justify-content-center');

                                        // Show the modal
                                        componentModal.dialog.show()

                                        // Add a timeout to show the modal
                                        setTimeout(() => {

                                            // Show the dialog
                                            componentModal.dialog.removeClass('opacity-0');
                                        }, 300);
                                    }
                                );
                            } else {

                                // Check if the errors are empty
                                if(Errors.length > 0){

                                    // Create a Modal to display the errors
                                    builder.Component(
                                        "modal",
                                        {
                                            callback: {
                                                submit: function(element,modal){

                                                    // Close the modals
                                                    modalAssign.hide();
                                                    modal.hide();

                                                    // Execute the callback
                                                    callback(Ready, Records);
                                                },
                                                onHide: function(component,modal){

                                                    // Add a timeout to show the modal
                                                    setTimeout(() => {

                                                        // Show the dialog
                                                        componentModal.dialog.removeClass('opacity-0');
                                                    }, 300);
                                                },
                                            },
                                            destroy:true,
                                            icon: "exclamation-triangle",
                                            title: builder.Locale.get("Wait!"),
                                            size: "xl",
                                        },
                                        function(modal,component){

                                            // Styling
                                            component.dialog.css('transition','opacity 0.3s');
                                            component.header.addClass('text-bg-warning');
                                            component.footer.submit.text(builder.Locale.get('Continue')).addClass('btn-success').removeClass('btn-link');
                                            component.footer.submit.icon = $(document.createElement('i')).addClass('bi bi-arrow-right me-1').prependTo(component.footer.submit);

                                            // Add a warning message
                                            component.body.warning = $(document.createElement('h4')).text(builder.Locale.get("The file contains errors. Please review the errors before continuing.")).appendTo(component.body);

                                            // Loop through the records reporting errors
                                            for(const [key, row] of Object.entries(Errors)){
                                                builder.Component(
                                                    "alert",
                                                    component.body,
                                                    {
                                                        color: "danger",
                                                        dismissible: false,
                                                        icon: "exclamation-octagon",
                                                        title: builder.Locale.get("Error") + ": [" + (parseInt(key) + 1) + "]",
                                                    },
                                                    function(alert,component){

                                                        // Add the list of errors
                                                        for(const [ekey, error] of Object.entries(row.errors)){
                                                            $(document.createElement('div')).text(error).appendTo(component.content);
                                                        }

                                                        // Copy the row and remove the errors
                                                        var data = row;
                                                        delete data.errors;

                                                        // Convert row to pretty JSON
                                                        const prettyJson = JSON.stringify(data, null, 2);

                                                        // Create a code block to display the row data
                                                        component.content.code = builder.Component(
                                                            "code",
                                                            component.content,
                                                            {
                                                                class: {
                                                                    component: "w-100 mt-2",
                                                                },
                                                                language: "json",
                                                                title: builder.Locale.get("Row Data"),
                                                                clipboard:false,
                                                                fullscreen:false,
                                                                collapsed:true,
                                                                code:prettyJson,
                                                            },
                                                            function(code,component){ //Callback
                                                            },
                                                        );
                                                    },
                                                );
                                            }

                                            // Remove the Spinner
                                            componentModal.find('.animate-rotate').remove();

                                            // Reset the Dialog
                                            componentModal.removeClass('d-flex align-items-center justify-content-center');

                                            // Show the modal
                                            componentModal.dialog.show()

                                            // Show the modal
                                            modal.show();
                                        },
                                    );
                                } else {

                                    // Close the modal
                                    modalAssign.hide();

                                    // Execute the callback
                                    callback(Ready, Records);
                                }
                            }
                        },
                    },
                },
                function(form,component){

                    // select the first record
                    let record = file.json[Object.keys(file.json)[0]]

                    // Loop through the columns
                    let options = [{id:"None",text:"None - Not Available"}];
                    for(var [key, value] of Object.entries(record)){

                        // Add to the options
                        options.push({id:key,text:key + ' - ' + value});
                    }

                    // Loop through the tables
                    for(const [column, type] of Object.entries(Columns)){

                        // Check if column is in array
                        if(builder.Helper.inArray(column,["title","role","mobile"])){
                            continue;
                        }

                        // Create a select
                        form.add(
                            {
                                name: column,
                                label: builder.Locale.get(column.charAt(0).toUpperCase() + column.slice(1)),
                                icon: 'columns',
                                type: 'select',
                                modal: componentModal,
                                options: options,
                                class: {
                                    field: 'col',
                                    label: builder.Helper.inArray(column,Required) ? (builder.Helper.inArray(column,Important) ? 'text-bg-danger' : 'text-bg-primary') : null,
                                },
                            },
                            function(input,form){

                                // Set default value
                                input.val('None');
                            },
                        );
                    }

                    // Initialize the contact array
                    form.contacts = [];

                    // Setup an additional form area to setup contacts
                    component.contacts = builder.Component(
                        "accordion",
                        component,
                        {
                            class: {
                                accordion: "col-12",
                                item: null,
                            },
                            flush: false,
                            alwaysOpen: true,
                            properties: {
                                icon: "person-vcard",
                                title: null,
                                content: null,
                            },
                        },
                        function(accordion,component){

                            // Add a counter
                            component.count = 1;

                            // Add a function to add a new contact
                            component.add = function(){

                                // Add a new item to the accordion
                                accordion.add(
                                    {title: 'Contact #' + component.count},
                                    function(item,accordion){

                                        // Styling
                                        item.addClass('bg-transparent border border-1');

                                        // Check if the counter is greater than 0
                                        if(component.count <= 1){
                                            item.addClass('mt-3')
                                        }

                                        // Open the collapse
                                        item.collapse.addClass('show');
                                        item.header.button.removeClass('collapsed');

                                        // Include a form in the content area
                                        item.content.form = builder.Component(
                                            "form",
                                            item.content,
                                            {
                                                class:{
                                                    component: 'row row-cols-2 g-3',
                                                }
                                            },
                                            function(subForm,component){

                                                // Loop through the tables
                                                for(const [column, type] of Object.entries(Columns)){

                                                    // Check if column is in array
                                                    if(builder.Helper.inArray(column,["dba","fax","tags","industries","businessNumber","taxExtension","importerExtension"])){
                                                        continue;
                                                    }

                                                    // Create a select
                                                    subForm.add(
                                                        {
                                                            name: column,
                                                            label: builder.Locale.get(column.charAt(0).toUpperCase() + column.slice(1)),
                                                            icon: 'columns',
                                                            type: 'select',
                                                            modal: componentModal,
                                                            options: options,
                                                            class: {
                                                                field: 'col',
                                                                label: builder.Helper.inArray(column,Required) ? (builder.Helper.inArray(column,Important) ? 'text-bg-danger' : 'text-bg-primary') : null,
                                                            },
                                                        },
                                                        function(input){

                                                            // Set default value
                                                            input.val((builder.Helper.inArray(column,["title","role","mobile","name"])) ? 'None' : form.val(column));
                                                        },
                                                    );
                                                }

                                                // Add the form to the contacts array
                                                form.contacts.push(subForm);
                                            }
                                        );

                                        // Increment the counter
                                        component.count++;
                                    },
                                );
                            };

                            // Add a button to add a new contact
                            component.btn = $(document.createElement('button')).attr({"type":"button","class": "btn btn-success w-100"}).text(builder.Locale.get("Add Contact")).appendTo(component);
                            component.btn.icon = $(document.createElement('i')).attr({"class": "bi bi-plus-lg me-1"}).prependTo(component.btn);

                            // Add a click event to the button
                            component.btn.off().click(function(){
                                component.add();
                            });
                        }
                    );

                    // Show the modal
                    modal.show();
                },
            );
        },
    );
};
const LeadsImportStart = function(Records, callback){

    // Create a progress modal
    builder.Component(
        "modal",
        {
            destroy:true,
            submit: false,
            cancel: false,
            icon: "database-up",
            title: builder.Locale.get("Progress"),
            static: true,
            size: "lg",
        },
        function(modal,component){

            // Save Modal Component for select2 fields
            const componentModal = component;

            // Styling
            component.header.addClass('text-bg-primary');
            component.footer.remove();

            // Create a progress bar
            component.progress = builder.Component(
                'progress',
                component.body,
                {
                    size: '32px',
                    color: 'primary',
                    striped: true,
                    animated: true,
                    scale: Records.length,
                    label: "{percent} completed {progress} of {scale} records imported",
                },
                function(progress,component){

                    // Set default value
                    progress.set(0);

                    // Default timeout
                    let timeout = 0;

                    // Loop through the records
                    for(const [key, row] of Object.entries(Records)){

                        // Add 250 miliseconds to the timeout
                        timeout += 250;

                        // Create a timeout function
                        setTimeout(function(){

                            // Execute the callback
                            callback(row, function(){

                                // Set the value
                                progress.set(progress.get() + 1);

                                // Check if the progress is complete
                                if(progress.get() === Records.length){

                                    // Update the color of the progress bar
                                    component.bar.removeClass('text-bg-primary').addClass('text-bg-success');

                                    // Timeout to close the modal
                                    setTimeout(function(){

                                        // Close the modal
                                        modal.hide();
                                    }, 1000);
                                }
                            });
                        },timeout);
                    }

                    // Show the modal
                    modal.show();
                },
            );
        }
    );
};
const LeadsImport = function(dt){
    $.ajax({
        url: '/endpoint.php/vcards/describe',
        type: 'GET',dataType: 'json',
        success: function(response) {

            // Create ab array of columns to skip
            var Skip = ['id','created','modified','owner','category','organization','avatar'];

            // Create an array of columns and default values
            var Columns = {};
            var Defaults = {};
            for(const [key, value] of Object.entries(response)){
                if(!builder.Helper.inArray(value.Field,Skip)){
                    Columns[value.Field] = value.Type;
                    switch(value.Field){
                        case "country":
                            Defaults[value.Field] = "CA";
                            break;
                        case "locale":
                            Defaults[value.Field] = "en-ca";
                            break;
                    }
                }
            }

            // Create ab array of required columns
            var Required = ['name','address','city','state','zipcode','email','phone','website','locale'];
            var Important = ['name','email','phone','locale'];

            // Select the file
            LeadsImportFile(function(file){

                // Add some properties
                file.isPublic = 1;
                file.targetTable = "leads";

                // Check if the file is empty or if the file type is not supported
                if(file.json.length === 0 || file.extension !== 'xlsx'){
                    builder.Toast.add(
                        {
                            icon: "exclamation-diamond",
                            title: builder.Locale.get("Error"),
                            body: builder.Locale.get("No records found in the selected file or the file type is not supported."),
                            color: "danger"
                        }
                    );
                } else {
                    LeadsImportAssign(file, Columns, Required, Important, Defaults, function(Ready, Records){

                        LeadsImportStart(Records, function(Record, callback){

                            // AJAX Request
                            $.ajax({
                                url: '/endpoint.php/leads/create',
                                headers: {'X-CSRF-Authorization': CSRF_KEY},
                                type: 'POST',dataType: 'json',
                                data: Record,
                                error: function(xhr, status, response) {
                                    console.log('leads/create', xhr, status, response, Record);
                                },
                                success: function(response) {

                                    // Retrieve the Lead Record
                                    const Lead = response.record;

                                    // Add the lead to the datatable
                                    dt.row.add(Lead).draw();

                                    // Update some properties
                                    file.targetId = Lead.id;

                                    // Create fileData
                                    const fileData = {
                                        "checksum": file.checksum,
                                        "targetTable": file.targetTable ?? "leads",
                                        "targetId": file.targetId ?? response.record.id,
                                        "isPublic": file.isPublic ?? 1,
                                        "content": file.content,
                                        "extension": file.extension,
                                        "icon": file.icon,
                                        "name": file.name,
                                        "size": file.size,
                                        "type": file.type
                                    };

                                    // AJAX Request
                                    $.ajax({
                                        url: '/endpoint.php/files/upload',
                                        headers: {'X-CSRF-Authorization': CSRF_KEY},
                                        type: 'POST',dataType: 'json',
                                        data: fileData,
                                        error: function(xhr, status, response) {
                                            console.log('files/upload', xhr, status, response, fileData);
                                        },
                                        success: function(response) {

                                            if(Record.contacts.length > 0){
                                                for(const [arrayKey, arrayValue] of Object.entries(Record.contacts)){

                                                    var contactData = {
                                                        "targetTable": "leads",
                                                        "targetId": Lead.id,
                                                    };
                                                    for(const [contactKey, contactValue] of Object.entries(arrayValue)){
                                                        contactData[contactKey] = contactValue;
                                                    }
                                                    const requestData = contactData;

                                                    // AJAX Request
                                                    $.ajax({
                                                        url: '/endpoint.php/contacts/create',
                                                        headers: {'X-CSRF-Authorization': CSRF_KEY},
                                                        type: 'POST',dataType: 'json',
                                                        data: requestData,
                                                        error: function(xhr, status, response) {
                                                            console.log('contacts/create', xhr, status, response, requestData);
                                                        },
                                                        success: function(response) {

                                                            // Update the CSRF
                                                            CSRF_KEY = response.CSRF.key;
                                                            CSRF_TOKEN = response.CSRF.token;

                                                            // Check if this is the last contact
                                                            if(parseInt(arrayKey) === (Record.contacts.length - 1)){

                                                                // Execute the callback
                                                                callback();
                                                            }
                                                        }
                                                    });
                                                }
                                            } else {

                                                // Execute the callback
                                                callback();
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    });
                }
            });
        }
    });
};
const LeadsAssignSelect = function(callback){

    // AJAX Request
    $.ajax({
        url: '/endpoint.php/auth/colleagues',
        type: 'GET',dataType: 'json',
        success: function(response) {
            var members = response;
            var options = [];
            for(const [id, member] of Object.entries(members)){
                options.push({id: id, text: member.username});
            }
            builder.Component(
                "modal",
                null,
                {
                    onEnter: true,
                    destroy:true,
                    icon: "person-add",
                    title: builder.Locale.get("Assign Someone"),
                    cancel: false,
                    submit: true,
                    size: "md",
                    callback: {
                        submit: function(element,modal){
                            element.form.submit();
                        },
                    },
                },
                function(modal,component){
                    const componentModal = component;
                    component.header.addClass('text-bg-primary');
                    component.footer.submit
                        .addClass('btn-primary')
                        .removeClass('btn-link')
                        .text(builder.Locale.get('Assign'))
                        .attr('style','border-bottom-left-radius: var(--bs-modal-inner-border-radius) !important;border-bottom-right-radius: var(--bs-modal-inner-border-radius) !important;');
                    component.footer.submit.icon = $(document.createElement('i')).addClass('bi bi-person-add me-1').prependTo(component.footer.submit);
                    component.form = builder.Component(
                        "form",
                        component.body,
                        {
                            callback:{
                                submit: function(form){

                                    // Execute the callback
                                    callback(form.val().assignedTo);

                                    // Close the modal
                                    modal.hide();
                                },
                            },
                        },
                        function(form,component){
                            form.add(
                                {
                                    name: 'assignedTo',
                                    label: builder.Locale.get('User'),
                                    icon: 'person',
                                    type: 'select2',
                                    options: options,
                                    modal: componentModal,
                                    value: USER_ID,
                                },
                            );
                            modal.show();
                        },
                    );
                }
            );
        }
    });
}
const LeadsAssignStart = function(Records, callback){

    // Create a progress modal
    builder.Component(
        "modal",
        {
            destroy:true,
            submit: false,
            cancel: false,
            icon: "person-plus",
            title: builder.Locale.get("Progress"),
            static: true,
            size: "lg",
        },
        function(modal,component){

            // Save Modal Component for select2 fields
            const componentModal = component;

            // Styling
            component.header.addClass('text-bg-warning');
            component.footer.remove();

            // Create a progress bar
            component.progress = builder.Component(
                'progress',
                component.body,
                {
                    size: '32px',
                    color: 'primary',
                    striped: true,
                    animated: true,
                    scale: Records.length,
                    label: "{percent} completed {progress} of {scale} records assigned",
                },
                function(progress,component){

                    // Set default value
                    progress.set(0);

                    // Default timeout
                    let timeout = 0;

                    // Loop through the records
                    for(const [key, row] of Object.entries(Records)){

                        // Add 250 miliseconds to the timeout
                        timeout += 250;

                        // Create a timeout function
                        setTimeout(function(){

                            // Execute the callback
                            callback(row, function(){

                                // Set the value
                                progress.set(progress.get() + 1);

                                // Check if the progress is complete
                                if(progress.get() === Records.length){

                                    // Update the color of the progress bar
                                    component.bar.removeClass('text-bg-primary').addClass('text-bg-success');

                                    // Timeout to close the modal
                                    setTimeout(function(){

                                        // Close the modal
                                        modal.hide();
                                    }, 1000);
                                }
                            });
                        },timeout);
                    }

                    // Show the modal
                    modal.show();
                },
            );
        }
    );
}
const LeadsAssign = function(dt){

    // Retrieve the selected rows
    const Records = dt.rows({ selected: true }).data().toArray();

    // Select a user to assign
    LeadsAssignSelect(function(userId){

        // Start the assignment process
        LeadsAssignStart(Records,function(Record,callback){

            // Create a task object
            var taskData = {
                id: Record.task.id,
                assignedTo: userId,
            };
            taskData[CSRF_KEY] = CSRF_TOKEN;

            // AJAX Request
            $.ajax({
                url: '/endpoint.php/tasks/assign?id='+taskData.id,
                type: 'POST',dataType: 'json',
                data: taskData,
                success: function(response) {

                    // Update CSRF Token
                    CSRF_KEY = response.CSRF.key;
                    CSRF_TOKEN = response.CSRF.token;

                    // Update Assigned User's Avatar
                    $('[data-type="avatar"][data-task="'+Record.task.id+'"]').attr({
                        "alt": response.record.assignedTo.username,
                        "src": "/avatar?username="+response.record.assignedTo.username,
                    });

                    // Update Assigned User's Username
                    $('[data-type="username"][data-task="'+Record.task.id+'"]').attr({
                        "title":response.record.assignedTo.username,
                        "data-bs-title":response.record.assignedTo.username,
                    }).text(response.record.assignedTo.username);

                    // Execute the callback
                    callback();
                }
            });
        });
    });
}
const LeadsArchiveWarning = function(callback){

    // Create a modal
    builder.Component(
        "modal",
        null,
        {
            onEnter: true,
            destroy:true,
            icon: "archive",
            title: builder.Locale.get("Are you sure you?"),
            body: builder.Locale.get("Your are about to archive these leads. Are you sure you want to continue?"),
            cancel: false,
            submit: true,
            callback: {
                submit: function(element,modal){

                    // Execute the callback
                    callback();

                    // Hide the modal
                    modal.hide();
                },
            },
        },
        function(modal,component){

            // Save the component
            const componentModal = component;

            // Style the modal
            component.header.addClass('text-bg-dark');
            component.footer.submit.addClass('btn-dark').removeClass('btn-link').attr({
                "style": "border-bottom-right-radius: var(--bs-modal-inner-border-radius) !important;border-bottom-left-radius: var(--bs-modal-inner-border-radius) !important;",
            }).text(builder.Locale.get('Archive'));
            component.footer.submit.icon = $(document.createElement('i')).addClass('bi bi-archive me-1').prependTo(component.footer.submit);

            // Open the modal
            modal.show();
        }
    );
}
const LeadsArchiveStart = function(Records, callback){

    // Create a progress modal
    builder.Component(
        "modal",
        {
            destroy:true,
            submit: false,
            cancel: false,
            icon: "archive",
            title: builder.Locale.get("Progress"),
            static: true,
            size: "lg",
        },
        function(modal,component){

            // Save Modal Component for select2 fields
            const componentModal = component;

            // Styling
            component.header.addClass('text-bg-dark');
            component.footer.remove();

            // Create a progress bar
            component.progress = builder.Component(
                'progress',
                component.body,
                {
                    size: '32px',
                    color: 'primary',
                    striped: true,
                    animated: true,
                    scale: Records.length,
                    label: "{percent} completed {progress} of {scale} records archived",
                },
                function(progress,component){

                    // Set default value
                    progress.set(0);

                    // Default timeout
                    let timeout = 0;

                    // Loop through the records
                    for(const [key, row] of Object.entries(Records)){

                        // Add 250 miliseconds to the timeout
                        timeout += 250;

                        // Create a timeout function
                        setTimeout(function(){

                            // Execute the callback
                            callback(row, function(){

                                // Set the value
                                progress.set(progress.get() + 1);

                                // Check if the progress is complete
                                if(progress.get() === Records.length){

                                    // Update the color of the progress bar
                                    component.bar.removeClass('text-bg-primary').addClass('text-bg-success');

                                    // Timeout to close the modal
                                    setTimeout(function(){

                                        // Close the modal
                                        modal.hide();
                                    }, 1000);
                                }
                            });
                        },timeout);
                    }

                    // Show the modal
                    modal.show();
                },
            );
        }
    );
}
const LeadsArchive = function(dt){

    // Retrieve the selected rows
    const Records = dt.rows({ selected: true }).data().toArray();

    // Select a user to assign
    LeadsArchiveWarning(function(){

        // Start the assignment process
        LeadsArchiveStart(Records,function(Record,callback){

            // AJAX Request
            $.ajax({
                url: '/endpoint.php/leads/archive?id='+Record.id,
                type: 'GET',dataType: 'json',
                success: function(response) {

                    // Retrieve the datatable row of the record
                    const row = dt.row(function(idx, data, node) {
                        return data.id === Record.id;
                    });

                    // Remove the row from the datatable
                    row.remove().draw();

                    // Execute the callback
                    callback();
                }
            });
        });
    });
}
