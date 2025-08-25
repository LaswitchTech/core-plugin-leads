builder.add('layouts','lead', class extends builder.ComponentClass {

    #interval = null;

    _init(){
        this._properties = {
            class: {
                component: null,
            },
            id: null,
            table: 'leads',
            interval: 15000,
            autoStart: true,
            callback: {},
        };
        this._data = {};
        this._widgets = {};
        this._priorities = [
            {name: 'Low', color: 'secondary', icon: 'exclamation-triangle'},
            {name: 'Normal', color: 'primary', icon: 'info-circle'},
            {name: 'High', color: 'warning', icon: 'exclamation-circle'},
            {name: 'Urgent', color: 'orange', icon: 'exclamation-diamond'},
            {name: 'Critical', color: 'danger', icon: 'exclamation-square'},
        ]
    }

    _create(){

        // Set Self
        const self = this;

        // Create Component
        this._component = $(document.createElement('div')).attr({
            'id': 'lead' + this._id,
            'class': 'lead-profile',
        });
        this._component.id = this._component.attr('id');

        // Add Class
        if(this._properties.class.component){
            this._component.addClass(this._properties.class.component);
        }

        // Fetch Lead Data
        $.ajax({
            url: '/api/'+this._properties.table+'/fetch?id=' + this._properties.id,
            type: 'GET',dataType: 'json',
            error: function(xhr, status, error) {
                let color = 'info', icon = 'question-circle', title = builder.Locale.get(xhr.statusText), content = builder.Locale.get(xhr.responseText);
                switch(xhr.status){
                    case 403: color = 'danger'; icon = 'shield-lock'; break;
                    case 404: color = 'warning'; icon = 'question-diamond'; break;
                    case 500: color = 'danger'; icon = 'bug'; break;
                }
                builder.Component("alert",self._component,{icon:icon,color:color,title:title},function(alert,component){component.content.html('<pre class="m-0 p-2">'+content+'</pre>');});
            },
            success: function(response) {

                // Set Data
                self._data = response;

                // Layout
                self._component.details = $(document.createElement('div')).addClass('lead-details').appendTo(self._component);
                self._component.steps = $(document.createElement('div')).addClass('lead-steps').appendTo(self._component);
                self._component.tabs = $(document.createElement('div')).addClass('lead-tabs').appendTo(self._component);

                // Controls
                self._component.details.controls = $(document.createElement('div')).addClass('controls').appendTo(self._component.details);
                self._component.details.controls.group = $(document.createElement('div')).addClass('btn-group').appendTo(self._component.details.controls);

                // Control - Edit
                if(self._data.extensions.includes('vcards')){
                    self._component.details.controls.group.edit = $(document.createElement('button')).attr({
                        "type": "button",
                        "data-action": "edit",
                        "data-vcard": self._data.record.vcard.id,
                        "class": "btn btn-sm btn-warning",
                    }).text(self._builder.Locale.get('Edit')).appendTo(self._component.details.controls.group);
                    self._component.details.controls.group.edit.icon = $(document.createElement('i')).addClass('bi bi-pencil me-1').prependTo(self._component.details.controls.group.edit);
                    self._component.details.controls.group.edit.click(function(){
                        self._builder.Widget('vcard',{mode:'edit',data: self._data.record.vcard.id});
                    });
                }

                // Control - Archive
                if(self._data.extensions.includes('tasks')){
                    self._component.details.controls.group.archive = $(document.createElement('button')).attr({
                        "type": "button",
                        "data-action": "archive",
                        "data-vcard": self._data.record.vcard.id,
                        "class": "btn btn-sm btn-dark",
                    }).text(self._builder.Locale.get('Archive')).appendTo(self._component.details.controls.group);
                    self._component.details.controls.group.archive.icon = $(document.createElement('i')).addClass('bi bi-archive me-1').prependTo(self._component.details.controls.group.archive);
                    self._component.details.controls.group.archive.click(function(){
                        self._builder.Widget('task',{data: self._data.record.task.id}).archive(function(data){});
                    });
                }

                // Logo
                self._component.details.logo = $(document.createElement('div')).addClass('logo').appendTo(self._component.details);
                self._component.details.logo.favicon = $(document.createElement('div')).addClass('favicon').appendTo(self._component.details.logo);
                self._component.details.logo.favicon.img = $(document.createElement('img')).attr({
                    "src": '/avatar?id=' + self._data.record.vcard.id,
                }).appendTo(self._component.details.logo.favicon);
                self._component.details.logo.favicon.click(function(){
                    self._builder.Widget('vcard',{mode:'upload',data: self._data.record.vcard.id});
                });

                // Name and DBA
                self._component.details.name = $(document.createElement('div')).attr({
                    "class": "name",
                }).appendTo(self._component.details.logo);
                self._component.details.name.fullname = $(document.createElement('h3')).attr({
                }).text(self._data.record.vcard.name).appendTo(self._component.details.name);
                self._component.details.name.dba = $(document.createElement('h4')).attr({
                    "class": "text-muted",
                }).text(self._data.record.vcard.dba).appendTo(self._component.details.name);
                self._component.details.name.click(function(){
                    self._builder.Widget('vcard',{data: self._data.record.vcard.id});
                });

                // Body
                self._component.details.body = $(document.createElement('div')).addClass('body row g-3').appendTo(self._component.details);

                // Task
                if(self._data.extensions.includes('tasks')){
                    self._component.details.body.task = {}
                    for(const [key, value] of Object.entries(self._data.record.task)){
                        switch(key){
                            case 'assignedTo':
                                self._component.details.body.task[key] = $(document.createElement('div')).attr({
                                    'class': 'col-12 col-lg-4 hover task-'+key,
                                }).appendTo(self._component.details.body);
                                self._component.details.body.task[key].header = $(document.createElement('p')).text(self._builder.Locale.get('Assigned To')).appendTo(self._component.details.body.task[key]);
                                self._component.details.body.task[key].object = $(document.createElement('div')).attr({
                                    "data-type": 'assigned',
                                    "data-task-id": self._data.record.task.id,
                                }).appendTo(self._component.details.body.task[key]);
                                self._component.details.body.task[key].object.username = $(document.createElement('span')).attr({
                                }).text(self._data.record.task.assignedTo.username ?? self._builder.Locale.get('Unassigned')).appendTo(self._component.details.body.task[key].object);
                                self._component.details.body.task[key].object.avatar = $(document.createElement('img')).attr({
                                    "alt": "user",
                                    "src": "/avatar?username="+self._data.record.task.assignedTo.username ?? 'Unassigned',
                                }).prependTo(self._component.details.body.task[key].object);
                                self._component.details.body.task[key].click(function(){
                                    self._builder.Widget('task',{data: self._data.record.task.id}).assign();
                                });
                                break;
                            case 'progress':
                                self._component.details.body.task[key] = $(document.createElement('div')).attr({
                                    'class': 'col-12 col-lg-4 task-'+key,
                                }).appendTo(self._component.details.body);
                                self._component.details.body.task[key].header = $(document.createElement('p')).text(self._builder.Locale.get('Status')).appendTo(self._component.details.body.task[key]);
                                self._component.details.body.task[key].object = $(document.createElement('h4')).attr({
                                    "data-type": key,
                                }).appendTo(self._component.details.body.task[key]);
                                self._component.details.body.task[key].badge = $(document.createElement('span')).attr({
                                    "class": "badge",
                                    "data-type": key,
                                    "data-task-id": self._data.record.task.id,
                                }).appendTo(self._component.details.body.task[key].object);
                                if(self._data.record.task.progress > 0){
                                    self._component.details.body.task[key].badge.addClass('text-bg-'+self._data.record.task.process[self._data.record.task.progress].color);
                                    self._component.details.body.task[key].badge.html('<i class="me-1 bi bi-'+self._data.record.task.process[self._data.record.task.progress].icon+'"></i>'+self._builder.Locale.get(self._data.record.task.process[self._data.record.task.progress].name));
                                } else {
                                    self._component.details.body.task[key].badge.addClass('text-bg-success').html('<i class="me-1 bi bi-stars"></i>'+builder.Locale.get('New'));
                                }
                                break;
                            case 'priority':
                                self._component.details.body.task[key] = $(document.createElement('div')).attr({
                                    'class': 'col-12 col-lg-4 hover task-'+key,
                                }).appendTo(self._component.details.body);
                                self._component.details.body.task[key].header = $(document.createElement('p')).text(self._builder.Locale.get('Priority')).appendTo(self._component.details.body.task[key]);
                                self._component.details.body.task[key].object = $(document.createElement('h4')).attr({
                                    "data-type": key,
                                }).appendTo(self._component.details.body.task[key]);
                                self._component.details.body.task[key].badge = $(document.createElement('span')).attr({
                                    "class": "badge",
                                    "data-type": key,
                                    "data-task-id": self._data.record.task.id,
                                }).appendTo(self._component.details.body.task[key].object);
                                self._component.details.body.task[key].badge.addClass('text-bg-'+self._priorities[value].color);
                                self._component.details.body.task[key].badge.html('<i class="me-1 bi bi-'+self._priorities[value].icon+'"></i>'+self._builder.Locale.get(self._priorities[value].name));
                                self._component.details.body.task[key].click(function(){
                                    self._builder.Widget('task',{data: self._data.record.task.id}).priority();
                                });
                                break;
                        }
                    }
                }

                // vCard
                if(self._data.extensions.includes('vcards')){
                    self._component.details.body.vcard = {}
                    for(const [key, value] of Object.entries(self._data.record.vcard)){
                        switch(key){
                            case 'address':
                                self._component.details.body.vcard[key] = $(document.createElement('div')).attr({
                                    'class': 'col-12 col-lg-8 vcard-'+key,
                                }).appendTo(self._component.details.body);
                                self._component.details.body.vcard[key].header = $(document.createElement('p')).text(self._builder.Locale.get(key)).appendTo(self._component.details.body.vcard[key]);
                                self._component.details.body.vcard[key].object = $(document.createElement('div')).attr({
                                    "data-type": key,
                                    "data-vcard-id": self._data.record.vcard.id,
                                }).text(self._data.record.vcard.address + (self._data.record.vcard.city ? ', ' + self._data.record.vcard.city : '') + (self._data.record.vcard.state.name ? ', ' + self._data.record.vcard.state.name : '') + (self._data.record.vcard.zipcode ? ', ' + self._data.record.vcard.zipcode : '') + (self._data.record.vcard.country.name ? ', ' + self._data.record.vcard.country.name : '')).appendTo(self._component.details.body.vcard[key]);
                                break;
                            case 'phone':
                                self._component.details.body.vcard[key] = $(document.createElement('div')).attr({
                                    'class': 'col-12 col-lg-4 hover vcard-'+key,
                                }).appendTo(self._component.details.body);
                                self._component.details.body.vcard[key].header = $(document.createElement('p')).text(self._builder.Locale.get(key)).appendTo(self._component.details.body.vcard[key]);
                                self._component.details.body.vcard[key].object = $(document.createElement('button')).attr({
                                    "class": "btn btn-link text-decoration-none",
                                    "type": "button",
                                    "data-type": key,
                                    "data-vcard-id": self._data.record.vcard.id,
                                }).html('<i class="me-1 bi bi-telephone"></i>'+value).appendTo(self._component.details.body.vcard[key]);
                                self._component.details.body.vcard[key].click(function(){
                                    self._builder.Widget('followups',{render:false,type:'Call',targetTable:self._properties.table,targetId:self._properties.id,default:self._data.record.vcard.id}).create();
                                });
                                break;
                            case 'tags':
                            case 'industries':
                                const color = (key === 'tags') ? 'warning' : 'primary';
                                const icon = (key === 'tags') ? 'tag' : 'crosshair';
                                self._component.details.body.vcard[key] = $(document.createElement('div')).attr({
                                    'class': 'col-12 col-lg-6 vcard-'+key,
                                }).appendTo(self._component.details.body);
                                self._component.details.body.vcard[key].header = $(document.createElement('p')).text(self._builder.Locale.get(key)).appendTo(self._component.details.body.vcard[key]);
                                self._component.details.body.vcard[key].object = $(document.createElement('div')).attr({
                                    "data-type": key,
                                    "data-vcard-id": self._data.record.vcard.id,
                                }).appendTo(self._component.details.body.vcard[key]);
                                for(const [k, unique] of Object.entries(value ?? [])){
                                    $(document.createElement('span')).addClass('badge text-bg-'+color).html('<i class="me-1 bi bi-'+icon+'"></i>'+unique).appendTo(self._component.details.body.vcard[key].object);
                                }
                                break;
                        }
                    }
                }

                // Tabs
                self._component.tabs.component = self._builder.Component(
                    "tabs",
                    self._component.tabs,
                    {
                        class: {
                            navbar: 'nav-pills',
                        },
                    },
                    function(tabs,card){

                        // Set Tabs
                        self._component.tabs.tabs = tabs;
                        self._component.tabs.card = card;

                        // Styling
                        card.tabs = {};
                        card._component.card.addClass('lead-tabs-card');
                        card._component.body.removeClass('card-body').addClass('row m-0');
                        tabs._content.addClass('col-12 col-lg-8 p-0 order-2 order-lg-1');
                        self._component.tasks = $(document.createElement('div')).addClass('col-12 col-lg-4 p-0 tasks order-1 order-lg-2').appendTo(card._component.body);

                        // Notes
                        if(self._data.extensions.includes('notes')){

                            // Add the tab
                            tabs.add(
                                'notes',
                                {
                                    icon: "stickies",
                                    label: builder.Locale.get("Notes"),
                                },
                                function(tab,nav){
                                    card.tabs.notes = tab;
                                    self._widgets.notes = self._builder.Widget('notes',tab,{data: self._data.dependencies.notes ?? {},targetTable: self._properties.table,targetId: self._properties.id})
                                },
                            );
                        }

                        // Contacts
                        if(self._data.extensions.includes('contacts')){

                            // Add the Contacts tab
                            tabs.add(
                                'contacts',
                                {
                                    icon: "person-vcard",
                                    label: builder.Locale.get("Contacts"),
                                },
                                function(tab,nav){
                                    card.tabs.contacts = tab;
                                    self._widgets.contacts = self._builder.Widget("contacts",tab,{data: self._data.dependencies.contacts ?? {},targetTable: self._properties.table,targetId: self._properties.id, default: self._data.record.vcard});
                                },
                            );
                        }

                        // Followups
                        if(self._data.extensions.includes('followups')){

                            // Set Followups
                            card.tabs.followups = {};
                            self._widgets.followups = {};

                            // Add the Followups tab - Calls
                            tabs.add(
                                'calls',
                                {
                                    icon: "telephone",
                                    label: builder.Locale.get("Calls"),
                                },
                                function(tab,nav){
                                    card.tabs.followups.calls = tab;
                                    self._widgets.followups.calls = self._builder.Widget("followups",tab,{data: self._data.dependencies.followups ?? {},type:'Call',targetTable: self._properties.table,targetId: self._properties.id});
                                },
                            );

                            // Add the Followups tab - Callbacks
                            tabs.add(
                                'callbacks',
                                {
                                    icon: "telephone-forward",
                                    label: builder.Locale.get("Callbacks"),
                                },
                                function(tab,nav){
                                    card.tabs.followups.callbacks = tab;
                                    self._widgets.followups.callbacks = self._builder.Widget("followups",tab,{data: self._data.dependencies.followups ?? {},type:'Callback',targetTable: self._properties.table,targetId: self._properties.id});
                                },
                            );

                            // Add the Followups tab - Meetings
                            tabs.add(
                                'meetings',
                                {
                                    icon: "calendar2-event",
                                    label: builder.Locale.get("Meetings"),
                                },
                                function(tab,nav){
                                    card.tabs.followups.meetings = tab;
                                    self._widgets.followups.meetings = self._builder.Widget("followups",tab,{data: self._data.dependencies.followups ?? {},type:'Meeting',targetTable: self._properties.table,targetId: self._properties.id});
                                },
                            );
                        }

                        // Files
                        if(self._data.extensions.includes('files')){

                            // Add the Files tab
                            tabs.add(
                                'files',
                                {
                                    icon: "file-earmark",
                                    label: builder.Locale.get("Files"),
                                },
                                function(tab,nav){
                                    card.tabs.files = tab;
                                    self._widgets.files = self._builder.Widget("files",tab,{data: self._data.dependencies.files ?? {},targetTable: self._properties.table,targetId: self._properties.id,isPublic: 1});
                                },
                            );
                        }

                        // Documents
                        if(self._data.extensions.includes('documents')){

                            // Add the Documents tab
                            tabs.add(
                                'documents',
                                {
                                    icon: "file-earmark-richtext",
                                    label: builder.Locale.get("Documents"),
                                },
                                function(tab,nav){
                                    card.tabs.documents = tab;
                                    // self._widgets.documents = self._builder.Widget("documents",tab,{data: self._data.dependencies.documents ?? {},targetTable: self._properties.table,targetId: self._properties.id});
                                },
                            );
                        }

                        // Services
                        if(self._data.extensions.includes('services')){

                            // Add the Services tab
                            tabs.add(
                                'services',
                                {
                                    icon: "cash-coin",
                                    label: builder.Locale.get("Services"),
                                },
                                function(tab,nav){
                                    card.tabs.services = tab;
                                    // self._widgets.services = self._builder.Widget("services",tab,{data: self._data.dependencies.services ?? {},targetTable: self._properties.table,targetId: self._properties.id});
                                },
                            );
                        }

                        // Event
                        if(self._data.extensions.includes('event')){

                            // Add the Event tab
                            tabs.add(
                                'event',
                                {
                                    icon: "activity",
                                    label: builder.Locale.get("Activity"),
                                },
                                function(tab,nav){
                                    card.tabs.event = tab;
                                    // self._widgets.event = self._builder.Widget("events",tab,{data: self._data.dependencies.event ?? {},targetTable: self._properties.table,targetId: self._properties.id});
                                },
                            );
                        }

                        // Relationship
                        if(self._data.extensions.includes('relationship')){

                            // Add the Relationship tab
                            tabs.add(
                                'relationship',
                                {
                                    icon: "diagram-2",
                                    label: builder.Locale.get("Related"),
                                },
                                function(tab,nav){
                                    card.tabs.relationship = tab;
                                    // self._widgets.relationship = self._builder.Widget("relationships",tab,{data: self._data.dependencies.relationship ?? {},targetTable: self._properties.table,targetId: self._properties.id});
                                },
                            );
                        }

                        // Task
                        if(self._data.extensions.includes('tasks')){
                            self._widgets.tasks = self._builder.Widget(
                                "processTree",
                                self._component.tasks,
                                {
                                    class: {
                                        steps: 'border-bottom p-3 py-2',
                                        pagination: 'p-3 py-2 btn-group w-100',
                                    },
                                    data: self._data.record.task.id,
                                },
                                function(widget,component){
                                    widget.controls().appendTo(self._component.steps)
                                }
                            );
                        }

                        // Check if autoStart is enabled
                        if(self._properties.autoStart){
                            // Start
                            setTimeout(function(){
                                self.start();
                            }, self._properties.interval);
                        }
                    },
                );
            },
        });
    }

    data(){
        return this._data;
    }

    start(){

        // Set Self
        const self = this;

        // Check if the interval is already set
        if(this.#interval){
            console.warn('Interval is already set, stopping the previous one.');
            clearInterval(this.#interval);
        }

        // Set the interval to check for changes
        this.#interval = setInterval(function(){
            self.load();
        }, this._properties.interval);
    }

    stop(){
        // Check if the interval is set
        if(this.#interval){
            clearInterval(this.#interval);
            this.#interval = null;
        } else {
            console.warn('No interval is currently set.');
        }
    }

    load(){

        // Set Self
        const self = this;

        // Fetch Lead Data
        $.ajax({
            url: '/api/'+this._properties.table+'/fetch?id=' + this._properties.id,
            type: 'GET',dataType: 'json',
            error: function(xhr, status, error) {
                console.error('Error fetching data:', error);
            },
            success: function(response) {

                // Set Data
                self._data = response;

                // Render the component
                self.render();
            },
        });
    }

    render(){

        // Set Self
        const self = this;

        // vCard
        if(self._data.extensions.includes('vcards')){

            // Logo
            self._component.details.logo.favicon.img.attr({
                "src": '/avatar?id=' + self._data.record.vcard.id,
            });

            // Name and DBA
            self._component.details.name.fullname.text(self._data.record.vcard.name);
            self._component.details.name.dba.text(self._data.record.vcard.dba);

            // Address
            self._component.details.body.vcard.address.object.text(self._data.record.vcard.address + (self._data.record.vcard.city ? ', ' + self._data.record.vcard.city : '') + (self._data.record.vcard.state.name ? ', ' + self._data.record.vcard.state.name : '') + (self._data.record.vcard.zipcode ? ', ' + self._data.record.vcard.zipcode : '') + (self._data.record.vcard.country.name ? ', ' + self._data.record.vcard.country.name : ''));

            // Phone
            self._component.details.body.vcard.phone.object.html('<i class="me-1 bi bi-telephone"></i>'+self._data.record.vcard.phone);

            // Tags
            self._component.details.body.vcard.tags.object.empty();
            for(const [k, unique] of Object.entries(self._data.record.vcard.tags ?? [])){
                $(document.createElement('span')).addClass('badge text-bg-warning').html('<i class="me-1 bi bi-tag"></i>'+unique).appendTo(self._component.details.body.vcard.tags.object);
            }

            // Industries
            self._component.details.body.vcard.industries.object.empty();
            for(const [k, unique] of Object.entries(self._data.record.vcard.industries ?? [])){
                $(document.createElement('span')).addClass('badge text-bg-primary').html('<i class="me-1 bi bi-crosshair"></i>'+unique).appendTo(self._component.details.body.vcard.industries.object);
            }
        }

        // Task
        if(self._data.extensions.includes('tasks')){

            // Assigned To
            self._component.details.body.task.assignedTo.object.username.text(self._data.record.task.assignedTo.username ?? self._builder.Locale.get('Unassigned'));
            self._component.details.body.task.assignedTo.object.avatar.attr({
                "src": "/avatar?username="+(self._data.record.task.assignedTo.username ?? 'Unassigned'),
            });

            // Status
            self._component.details.body.task.progress.badge.removeClass(function (index, className) {
                return (className.match(/(^|\s)text-bg-\S+/g) || []).join(' ');
            })
            if(self._data.record.task.progress > 0){
                self._component.details.body.task.progress.badge.addClass('text-bg-'+self._data.record.task.process[self._data.record.task.progress].color);
                self._component.details.body.task.progress.badge.html('<i class="me-1 bi bi-'+self._data.record.task.process[self._data.record.task.progress].icon+'"></i>'+self._builder.Locale.get(self._data.record.task.process[self._data.record.task.progress].name));
            } else {
                self._component.details.body.task.progress.badge.addClass('text-bg-success');
                self._component.details.body.task.progress.badge.html('<i class="me-1 bi bi-stars"></i>'+builder.Locale.get('New'));
            }

            // Priority
            self._component.details.body.task.priority.badge.removeClass(function (index, className) {
                return (className.match(/(^|\s)text-bg-\S+/g) || []).join(' ');
            }).addClass('text-bg-'+self._priorities[self._data.record.task.priority].color).html('<i class="me-1 bi bi-'+self._priorities[self._data.record.task.priority].icon+'"></i>'+self._builder.Locale.get(self._priorities[self._data.record.task.priority].name));

            // Update the Widget
            // self._widgets.tasks.load(self._data.task ?? {});
        }

        // Notes
        if(self._data.extensions.includes('notes')){
            self._widgets.notes.load(self._data.dependencies.notes ?? {});
        }

        // Contacts
        if(self._data.extensions.includes('contacts')){
            self._widgets.contacts.load(self._data.dependencies.contacts ?? {});
        }

        // Followups
        if(self._data.extensions.includes('followups')){
            // self._widgets.followups.calls.load(self._data.dependencies.followups ?? {});
            // self._widgets.followups.callbacks.load(self._data.dependencies.followups ?? {});
            // self._widgets.followups.meetings.load(self._data.dependencies.followups ?? {});
        }

        // Files
        if(self._data.extensions.includes('files')){
            // self._widgets.files.load(self._data.dependencies.files ?? {});
        }

        // Documents
        if(self._data.extensions.includes('documents')){
            // self._widgets.documents.load(self._data.dependencies.documents ?? {});
        }

        // Services
        if(self._data.extensions.includes('services')){
            // self._widgets.services.load(self._data.dependencies.services ?? {});
        }

        // Event
        if(self._data.extensions.includes('event')){
            // self._widgets.event.load(self._data.dependencies.event ?? {});
        }

        // Relationship
        if(self._data.extensions.includes('relationship')){
            // self._widgets.relationship.load(self._data.dependencies.relationship ?? {});
        }
    }
});
