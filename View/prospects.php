<article id="layout"></article>
<script>
    (async function () {
        await builder.Storage._ensureReady?.();
        $(document).ready(function(){
            $.ajax({
                url: '/api/leads/fetchAll',
                headers: {'X-CSRF-Authorization': CSRF_KEY},
                type: 'POST',dataType: 'json',
                data: {
                    conditions: [
                        {key: 'isArchived', operator: '<>', value: 1},
                        {key: 'task.progress', operator: '<=', value: 2},
                    ]
                },
                error: function(xhr, status, error) {
                    let color = 'info', icon = 'question-circle', title = builder.Locale.get(xhr.statusText), content = builder.Locale.get(xhr.responseText);
                    switch(xhr.status){
                        case 403: color = 'danger'; icon = 'shield-lock'; break;
                        case 404: color = 'warning'; icon = 'question-diamond'; break;
                        case 500: color = 'danger'; icon = 'bug'; break;
                    }
                    builder.Component("alert","#layout",{icon:icon,color:color,title:title},function(alert,component){component.content.html('<pre class="m-0 p-2">'+content+'</pre>');});
                },
                success: async function(response) {

                    // Configure Storage
                    builder.Storage.setKey('leads:index');
                    await builder.Storage.set(response);
                    console.log(await builder.Storage.get());

                    // Set Actions
                    var actions = {
                        details:{
                            label:'Details',
                            icon:'eye',
                            action:function(event, table, dt, node, row, data){
                                window.location.href = "/plugin/leads/details?id=" + data.id + "&name=" + encodeURIComponent(data.vcard.name);
                            }
                        },
                        archive:{
                            label:'Archive',
                            icon:'archive',
                            action:function(event, table, dt, node, row, data){
                                LeadModalArchive(data, table, row);
                            }
                        },
                    };

                    // Set Buttons
                    var buttons = [
                        {
                            className : 'btn-success',
                            init: function (dt, node){
                                $(node).removeClass('btn-secondary');
                            },
                            text: '<i class="bi bi-plus-lg"></i><span class="ms-2 d-xxl-inline d-none">'+builder.Locale.get('Add')+'</span>',
                            action:function(e, dt, node, config){
                                builder.Component(
                                    "modal",
                                    {
                                        callback: {
                                            submit: function(element,modal){
                                                element.form.submit();
                                            },
                                        },
                                        onEnter: true,
                                        destroy:true,
                                        icon: "plus-lg",
                                        title: builder.Locale.get("Add Lead"),
                                        cancel: true,
                                        submit: true,
                                        size: 'xl',
                                    },
                                    function(modal,component){

                                        // Save Modal Component for select2 fields
                                        const componentModal = component;

                                        // Styling
                                        component.addClass('modal-success');
                                        component.footer.submit.text('Create').addClass('btn-success').removeClass('btn-link');
                                        component.footer.submit.icon = $(document.createElement('i')).addClass('bi bi-stars me-1').prependTo(component.footer.submit);

                                        // Create Form
                                        component.form = builder.Component(
                                            'form',
                                            component.body,
                                            {
                                                class:{
                                                    form: 'row row-cols-3',
                                                    field: 'mb-3 col',
                                                },
                                                callback:{
                                                    val: function(values){
                                                        return values;
                                                    },
                                                    submit: function(form){
                                                        $.ajax({
                                                            url: '/api/leads/create',
                                                            headers: {'X-CSRF-Authorization': CSRF_KEY},
                                                            type: 'POST',dataType: 'json',
                                                            data: form.val(),
                                                            success: function(response) {
                                                                console.log(response);

                                                                // Add the followup to the datatable
                                                                dt.row.add(response.record).draw();

                                                                // Close the modal
                                                                modal.hide();
                                                            }
                                                        });
                                                    },
                                                },
                                            },
                                            function(form,component){

                                                // Generate Form
                                                LeadForm(form,{country:"CA",state:"QC",taxExtension:"0001",importerExtension:"0001"},componentModal);

                                                //Show the modal
                                                modal.show();
                                            },
                                        );
                                    },
                                );
                            },
                        },
                        {
                            className : 'btn-primary',
                            init: function (dt, node){
                                $(node).removeClass('btn-secondary');
                            },
                            text: '<i class="bi bi-database-up"></i><span class="ms-2 d-xl-inline d-none">'+builder.Locale.get('Import')+'</span>',
                            action:function(e, dt, node, config){
                                LeadsImport(dt);
                            },
                        },
                        {
                            extend : 'selected',
                            className : 'btn-warning requires-selection d-none',
                            init: function (dt, node){
                                $(node).removeClass('btn-secondary');
                            },
                            text: '<i class="bi bi-person-plus"></i><span class="ms-2 d-xxl-inline d-none">'+builder.Locale.get('Assign')+'</span>',
                            action:function(e, dt, node, config){
                                LeadsAssign(dt);
                            },
                        },
                        {
                            extend : 'selected',
                            className : 'btn-dark requires-selection d-none',
                            init: function (dt, node){
                                $(node).removeClass('btn-secondary');
                            },
                            text: '<i class="bi bi-archive"></i><span class="ms-2 d-xxl-inline d-none">'+builder.Locale.get('Archive')+'</span>',
                            action:function(e, dt, node, config){
                                LeadsArchive(dt);
                            },
                        },
                        {
                            extend : 'selected',
                            className : 'btn-info requires-selection-multiple d-none',
                            init: function (dt, node){
                                $(node).removeClass('btn-secondary');
                            },
                            text: '<i class="bi bi-link-45deg"></i><span class="ms-2 d-xl-inline d-none">'+builder.Locale.get('Link')+'</span>',
                            action:function(e, dt, node, config){

                                // Create Relationships
                                RelationshipsCreate(dt.rows({ selected: true }).data().toArray(), "leads");
                            },
                        },
                    ];

                    // Layout
                    builder.Component(
                        "table",
                        "#layout",
                        {
                            class: {
                                buttons: "px-4 pt-4",
                                table: "border-top",
                                footer: "px-4 pt-2 pb-4 text-bg-gray-200",
                            },
                            advancedSearch:true,
                            exportTools:true,
                            columnsVisibility:true,
                            selectTools:true,
                            showButtonsLabel: false,
                            dblclick:function(event, table, dt, node, data){
                                actions.details.action(event, table, dt, node, null, data);
                            },
                            actions:actions,
                            datatable: {
                                buttons:buttons,
                                columnDefs:[
                                    { target: 0, visible: false, title: builder.Locale.get('ID'), name: 'id', data: 'id', render: function(data, type, row) {
                                        var object = $(document.createElement('span'))
                                            .addClass('my-2')
                                            .text(data)
                                        return object.prop('outerHTML');
                                    }},
                                    { target: 1, visible: true, title: builder.Locale.get('Name'), name: 'name', data: 'name', render: function(data, type, row) {
                                        var object = $(document.createElement('span'))
                                            .addClass('my-2')
                                            .text(row.vcard.name)
                                        return object.prop('outerHTML');
                                    }},
                                    { target: 2, visible: false, title: builder.Locale.get('DBA'), name: 'dba', data: 'dba', render: function(data, type, row) {
                                        var object = $(document.createElement('span'))
                                            .addClass('my-2')
                                            .text(row.vcard.dba)
                                        return object.prop('outerHTML');
                                    }},
                                    { target: 3, visible: false, title: builder.Locale.get('Business Number'), name: 'bn', data: 'bn', render: function(data, type, row) {
                                        var object = $(document.createElement('span'))
                                            .addClass('my-2')
                                            .text(row.vcard.businessNumber)
                                        return object.prop('outerHTML');
                                    }},
                                    { target: 4, visible: false, title: builder.Locale.get('Status'), name: 'status', data: 'status', render: function(data, type, row) {
                                        if(row.task.process === null || typeof row.task.process[row.task.progress] === "undefined") {
                                            return '<h5><span class="badge text-bg-success"><i class="me-1 bi bi-asterisk"></i>'+builder.Locale.get('New')+'</span></h5>';
                                        } else {
                                            return '<h5><span class="badge text-bg-'+row.task.process[row.task.progress].color+'"><i class="me-1 bi bi-'+row.task.process[row.task.progress].icon+'"></i>'+row.task.process[row.task.progress].name+'</span></h5>';
                                        }
                                    }},
                                    { target: 5, visible: true, title: builder.Locale.get('Task'), name: 'task', data: 'task', render: function(data, type, row) {
                                        for(const [progress, step] of Object.entries(row.task.process)){
                                            for(const [order, task] of Object.entries(step.tasks)){
                                                if(!task.isCompleted){
                                                    return '<h5><span class="badge text-bg-'+step.color+'"><i class="me-1 bi bi-'+step.icon+'"></i>'+task.name+'</span></h5>';
                                                    break;
                                                }
                                            }
                                        }
                                    }},
                                    { target: 6, visible: true, title: builder.Locale.get('Priority'), name: 'priority', data: 'priority', render: function(data, type, row) {
                                        let color = ['secondary','primary','warning','orange','danger'];
                                        let name = ['Low','Normal','High','Urgent','Critical'];
                                        let icon = ['exclamation-triangle','info-circle','exclamation-circle','exclamation-diamond','exclamation-square'];
                                        return '<h5><span class="badge text-bg-'+color[row.task.priority]+'"><i class="me-1 bi bi-'+icon[row.task.priority]+'"></i>'+builder.Locale.get(name[row.task.priority])+'</span></h5>';
                                    }},
                                    { target: 7, visible: true, title: builder.Locale.get('Assigned To'), name: 'assignedTo', data: 'assignedTo', render: function(data, type, row) {

                                        // Create element
                                        var element = $(document.createElement('div')).addClass('d-flex align-items-center my-1');

                                        // Create Badge
                                        var object = $(document.createElement('span'))
                                            .attr({
                                                "data-bs-toggle":"tooltip",
                                                "data-bs-placement":"top",
                                                "title":data.username,
                                                "data-bs-title":data.username,
                                                "data-type": "username",
                                                "data-task": row.task.id,
                                            })
                                            .text(data.username)
                                            .prependTo(element);

                                        // Create avatar
                                        var avatar = $(document.createElement('img'))
                                            .attr({
                                                "class": "rounded-circle me-1",
                                                "data-type": "avatar",
                                                "data-task": row.task.id,
                                                "alt": data.username,
                                                "style": "width: 32px; height: 32px;",
                                                "src": "/avatar?username="+data.username,
                                            })
                                            .prependTo(element);

                                        // Return element
                                        return element.prop('outerHTML');
                                    }},
                                    { target: 8, visible: false, title: builder.Locale.get('Address'), name: 'address', data: 'address', render: function(data, type, row) {
                                        var object = $(document.createElement('span'))
                                            .addClass('my-2')
                                            .text(row.vcard.address)
                                        return object.prop('outerHTML');
                                    }},
                                    { target: 9, visible: true, title: builder.Locale.get('City'), name: 'city', data: 'city', render: function(data, type, row) {
                                        var object = $(document.createElement('span'))
                                            .addClass('my-2')
                                            .text(row.vcard.city)
                                        return object.prop('outerHTML');
                                    }},
                                    { target: 10, visible: false, title: builder.Locale.get('Website'), name: 'website', data: 'website', render: function(data, type, row) {
                                        var object = $(document.createElement('span'))
                                            .addClass('my-2')
                                            .text(row.vcard.website)
                                        return object.prop('outerHTML');
                                    }},
                                    { target: 11, visible: true, title: builder.Locale.get('Tags'), name: 'tags', data: 'tags', render: function(data, type, row) {

                                        // If no tags
                                        if(row.vcard.tags == null || row.vcard.tags == ''){
                                            return '';
                                        }

                                        // Get the tags
                                        const tags = row.vcard.tags;

                                        // Create element
                                        var element = $(document.createElement('div')).addClass('d-flex flex-wrap flex-row');

                                        // Loop through the tags
                                        for(const [key, tag] of Object.entries(tags)){

                                            // Create Badge
                                            var object = $(document.createElement('span'))
                                                .addClass('badge text-bg-warning m-1')
                                                .attr('data-bs-toggle','tooltip')
                                                .attr('data-bs-placement','top')
                                                .attr('title',tag)
                                                .attr('data-bs-title',tag)
                                                .text(tag)
                                                .css('font-size','0.8rem');

                                            // Create icon
                                            var icon = $(document.createElement('i'))
                                                .addClass('me-1 bi bi-tag')
                                                .prependTo(object);

                                            // Append to element
                                            object.appendTo(element);
                                        }

                                        // Return element
                                        return element.prop('outerHTML');
                                    }},
                                    { target: 12, visible: true, title: builder.Locale.get('Industries'), name: 'industries', data: 'industries', render: function(data, type, row) {

                                        // If no industries
                                        if(row.vcard.industries == null || row.vcard.industries == ''){
                                            return '';
                                        }

                                        // Get the industries
                                        const industries = row.vcard.industries;

                                        // Create element
                                        var element = $(document.createElement('div')).addClass('d-flex flex-wrap flex-row');

                                        // Loop through the industries
                                        for(const [key, industry] of Object.entries(industries)){

                                            // Create Badge
                                            var object = $(document.createElement('span'))
                                                .addClass('badge fs-6 text-bg-info m-1')
                                                .attr('data-bs-toggle','tooltip')
                                                .attr('data-bs-placement','top')
                                                .attr('title',industry)
                                                .attr('data-bs-title',industry)
                                                .text(industry)
                                                .css('font-size','0.8rem');

                                            // Create icon
                                            var icon = $(document.createElement('i'))
                                                .addClass('me-1 bi bi-crosshair')
                                                .prependTo(object);

                                            // Append to element
                                            object.appendTo(element);
                                        }

                                        // Return element
                                        return element.prop('outerHTML');
                                    }},
                                ],
                            },
                        },
                        async function(table, component){

                            // Add Records to Layout
                            for(const [key, record] of Object.entries(await builder.Storage.get('records'))){
                                table.add(record);
                            }
                        },
                    );
                }
            });
        });
    })();
</script>
