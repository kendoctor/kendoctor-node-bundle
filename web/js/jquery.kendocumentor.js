;
(function($, window, document, undefined) {


    var classesOfElements = {};
    var pluginName = 'kendocumentor';

    function ucfirst(s)
    {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
    function trim(string)
    {
        return string.replace(/^\s+|\s+$/g, '')
    }


    var Element = Class.extend({
        init: function(data) {
            this.data = $.extend({}, {data: {}}, data);
            this.excludeTypes = null;
            // if(!data || !data.type) throw exception
            this._initExcludes();
            this._initElement();
            this.setData(this.data.data);
        },
        _initElement: function()
        {
        },
        _initExcludes: function() {

        },
        isExclude: function(elementType) {
            if (typeof(elementType) === "object") {
                elementType = elementType.getType();
            }
            if (this.excludeTypes === null)
                return false;
            for (var i = 0; i < this.excludeTypes.length; i++)
            {
                if (this.excludeTypes[i] === elementType)
                    return true;
            }
            return false;
        },
        parentsWithSelf: function() {
            var parents = this.parents()
            parents.unshift(this);
            return parents;
        },
        parents: function() {
            var parents = this.object.parents(".kdoc-element");
            var p = [];
            parents.each(function() {
                p.push($(this).data('kdoc-element'));
            });
            return p;
        },
        append: function(child) {
            if (child.parent)
                child.detach();

            this.object.append(child.object);
            child.document = this.document || this;
            child.documentor = this.documentor;
            child.parent = this;
            child._update();
        },
        prepend: function(child) {
            if (child.parent)
                child.detach();
            var first = this.firstChild();
            if (first) {
                child.insertBefore(first);
            } else
            {
                this.append(child);
            }
        },
        insertAfter: function(beforeElement)
        {
            if (this.parent)
                this.detach();
            this.object.insertAfter(beforeElement.object);
            this.document = beforeElement.document;
            this.documentor = beforeElement.documentor;
            this.parent = beforeElement.parent;
            this._update();
        },
        insertBefore: function(afterElement)
        {
            if (this.parent)
                this.detach();
            this.object.insertBefore(afterElement.object);
            this.document = afterElement.document;
            this.documentor = afterElement.documentor;
            this.parent = afterElement.parent;
            this._update();
        },
        detach: function()
        {
            this.parent = null;
            this.object.detach();
        },
        remove: function()
        {
            this.object.data('kdoc-element', null);
            this.object.remove();
        },
        prev: function()
        {
            var prev = this.object.prev('.kdoc-element');
            if (prev.length === 0)
                return null;
            return prev.data('kdoc-element');
        },
        next: function() {
            var next = this.object.next('.kdoc-element');
            if (next.length === 0)
                return null;
            return next.data('kdoc-element');
        },
        lastChild: function() {

            var last = this.object.children('.kdoc-element').last();
            if (last.length === 0)
                return null;
            return last.data('kdoc-element');
        },
        firstChild: function() {

            var first = this.object.children('.kdoc-element').first();
            if (first.length === 0)
                return null;
            return first.data('kdoc-element');
        },
        level2Parent: function() {
            var parent = this.object.parents('.kdoc-element:not(.kdoc-root)').last();

            if (parent.length === 0)
                return null;
            return parent.data('kdoc-element');
        },
        deepLastChild: function()
        {
            var deepLast = $('.kdoc-element', this.object).last();
            if (deepLast.length === 0)
                return null;
            return deepLast.data('kdoc-element');
        },
        create: function(data)
        {
            if (data.type === undefined || this.getType() !== data.type) {
                throw "Invalid content data";
                return;
            }
            data.data = data.data || {};
            data.nodes = data.nodes || [];
            this.setData(data.data);
            for (var i = 0; i < data.nodes.length; i++)
            {
                var childData = data.nodes[i];
                var className = classesOfElements[ucfirst(childData.type)];
                var child = new className(data);

                this.append(child);
                child.create(childData);
            }
        },
        /**
         * 
         * update for such hN tag according to level
         */
        _update: function()
        {
        },
        setData: function(data) {
        },
        getData: function() {
            return null;
        },
        getJsonData: function()
        {
            var nodes = [];
            this.object.children('.kdoc-element').each(function() {
                var documentElement = $(this).data('kdoc-element');
                if (documentElement) {
                    nodes.push(documentElement.getJsonData());
                }
            });
            return {
                type: this.getType(),
                data: this.getData(),
                nodes: nodes
            };
        },
        getType: function()
        {
            throw "Abstract element class can not INITIALIZED";
        },
        getUpToSelectElement: function() {
            //pre,pre.hasChild
            var prev = null;

            if (this.document !== undefined) {
                prev = this.prev();
                if (!prev) {
                    return this.parent;
                } else
                {
                    var last = prev.deepLastChild();
                    if (last)
                        return last;
                    return prev;
                }
            }

            prev = this.deepLastChild();
            if (prev)
                return prev;
            return this;

        },
        getDownToSelectElement: function() {
            //next,parent

            var next = this.firstChild();
            if (next)
                return next;
            if (this.document === undefined)
                return this;
            next = this.next();
            if (next)
                return next;
            var parent = this.parent;
            while (parent && !(next = parent.next()))
            {
                parent = parent.parent;
            }

            if (next)
                return next;

            return this.document;

        },
        enterEditingMode: function() {
            return false;
        },
        exitEditingMode: function() {
            return false;
        },
        _addFocusStyle: function() {
            this.object.addClass('kdoc-selected');
        },
        _removeFocusStyle: function() {
            this.object.removeClass('kdoc-selected');
        },
        setFocus: function() {
            if (this.documentor.selected) {
                this.documentor.selected.loseFocus();
            }
            this.documentor.prevSelected = this.documentor.selected;
            this.documentor.selected = this;
            this._addFocusStyle();
            this.documentor.onSelectedChange();
        },
        loseFocus: function() {
            this.documentor.prevSelected = this;
            this.documentor.selected = null;
            this._removeFocusStyle();
            this.documentor.onSelectedChange();
        },
        toString: function()
        {
            return this.getType();
        }
    });


    var Highlight = classesOfElements.Highlight = Element.extend({
        _initElement: function()
        {
            this.preObject = $("<pre />");
            this.highLightObject =
            $("<div />").addClass("highlight")
            .append(this.preObject);

            this.object = $("<div />")
            .addClass("highlight-code" )
            .append(this.highLightObject)
            .addClass('kdoc-element')
            .addClass('kdoc-highlight')
            .data('kdoc-element', this);
        },
        _initExcludes: function() {
            this.excludeTypes = ['section', 'paragraph', 'list', 'listItem', 'hightlight'];
        },
        setData: function(data)
        {
            this.setContent(data.content);
        },
        getData: function()
        {
            return {content: this.getContent()};
        },
        enterEditingMode: function()
        {
            this.editTextareaField = $('<textarea style="margin: 0px; width: 638px; height: 114px;">')
            .addClass('kdoc-editing-textarea')
            .attr('rows', 3)
            .insertAfter(this.object)
            .focus()
            .val(this.getContent())
            .select();

            this.object.hide();
            return true;
        },
        exitEditingMode: function()
        {
            this.object.show();
            this.setContent(this.editTextareaField.val());
            this.editTextareaField.remove();
            this.editTextareaField = null;
            return false;
        },
        getContent: function()
        {
            return this.preObject.text();
        },
        setContent: function(content)
        {
            if (this.preObject && typeof(content) === 'string')
                this.preObject.text(content);
        },
        getType: function() {
            return 'highlight';
        }
    });

    /**
     * <ul>
     *  <li></li>
     * </ul>
     * 
     */

    var ListItem = classesOfElements.ListItem = Element.extend({
        _initElement: function() {

            this.object = $('<li></li>')
            .addClass('kdoc-element')
            .addClass('kdoc-listItem')
            .data('kdoc-element', this);

        },
        _initExcludes: function() {
            this.excludeTypes = ['section', 'paragraph', 'listItem'];
        },
        setData: function(data)
        {
            this.object.html(data.content);
        },
        getData: function()
        {
            return {
                content: this.getContent()
            };
        },
        enterEditingMode: function()
        {
            this.editInputField = $('<input type="text" />')
            .addClass("input-xxlarge")
            .addClass('kdoc-editing-text')
            .insertAfter(this.object)
            .focus()
            .val(this.getContent());

            this.object.hide();
            return true;

        },
        exitEditingMode: function()
        {
            this.object.show();
            this.setContent(this.editInputField.val());
            this.editInputField.remove();
            this.editInputField = null;
            return false;
        },
        getContent: function()
        {

            return this.object.html();
        },
        setContent: function(content)
        {
            this.object.html(content);
        },
        getType: function() {
            return 'listItem';
        }
    });


    var List = classesOfElements.List = Element.extend({
        _initElement: function() {

            this.object = $('<ul></ul>')
            .addClass('kdoc-element')
            .addClass('kdoc-list')
            .data('kdoc-element', this);

        },
        _initExcludes: function() {
            this.excludeTypes = ['section', 'paragraph', 'highlight', 'list'];
        },
        setData: function(data)
        {
            //this.object.html(data.content);
        },
        getData: function()
        {
            return {};
        },
        getType: function() {
            return 'list';
        },
        enterEditingMode: function()
        {
            this.editTextareaField = $('<textarea style="margin: 0px; width: 638px; height: 114px;">')
            .addClass('kdoc-editing-textarea')
            .attr('rows', 3)
            .insertAfter(this.object)
            .focus()
            .val(this.getContent());

            this.object.hide();
            return true;

        },
        exitEditingMode: function()
        {
            this.object.show();
            this.setContent(this.editTextareaField.val());
            this.editTextareaField.remove();
            this.editTextareaField = null;
            return false;
        },
        getContent: function()
        {
            var content = "";
            this.object.children('li').each(function() {
                content += $(this).html() + "\n";
            });
            return content;
        },
        setContent: function(content)
        {
            this.object.empty();
            var items = content.split("\n");
            for (var i = 0; i < items.length; i++)
            {


                if (trim(items[i]).length === 0)
                    continue;
                this.append(new ListItem({type: 'listItem', data: {content: trim(items[i])}}));
                //this.object.append($("<li />").html(trim(items[i])));
            }
        }
    });

    /**
     * 
     * <p class="k_paragraph">
     *   some content<span></span><code></code><a href="#></a>
     * </p>
     */
    var Paragraph = classesOfElements.Paragraph = Element.extend({
        _initElement: function() {

            this.object = $('<p></p>')
            .addClass('kdoc-element')
            .addClass('kdoc-paragraph')
            .data('kdoc-element', this);

        },
        _initExcludes: function() {
            this.excludeTypes = ['section', 'paragraph', 'highlight', 'list', 'listItem'];
        },
        setData: function(data)
        {
            this.object.html(data.content);
        },
        getData: function()
        {
            return {content: this.getContent()};
        },
        getType: function() {
            return 'paragraph';
        },
        enterEditingMode: function()
        {
            this.editTextareaField = $('<textarea style="margin: 0px; width: 638px; height: 114px;">')
            .addClass('kdoc-editing-textarea')
            .attr('rows', 3)
            .insertAfter(this.object)
            .focus()
            .val(this.getContent())
            .select();

            this.object.hide();
            return true;
        },
        exitEditingMode: function()
        {
            this.object.show();
            this.setContent(this.editTextareaField.val());
            this.editTextareaField.remove();
            this.editTextareaField = null;
            return false;
        },
        getContent: function()
        {
            return this.object.html();
        },
        setContent: function(content)
        {
            if (this.object && typeof(content) === 'string')
                this.object.html(content);
        }
    });


    /**
     * <div class="section">
     *     <hN class="title"></hN>
     *     <p></p>
     *     <div></div>
     * </div>
     */
    var Section = classesOfElements.Section = Element.extend({
        _initElement: function() {
            if (!this.object) {
                this.object = $('<div></div>')
                .addClass('kdoc-element')
                .addClass('section');
            }
            this.titleObject = $('<h1></h1>')
            .addClass('kdoc-title');

            this.object.append(this.titleObject)
            .data('kdoc-element', this);
        },
        _update: function() {
            var level = this.getSectionLevel();
            level = level > 6 ? 6 : level;
            var replacer = $('<h' + level + '></h' + level + '>')
            .addClass('kdoc-title')
            .html(this.getTitle());

            this.titleObject.replaceWith(replacer);
            this.titleObject = replacer;

            if (this.documentor.selected === this)
                this._addFocusStyle();
        },
        getSectionLevel: function() {
            return this.object.parents('.section.kdoc-element').length + 1;
        },
        setData: function(data) {
            this.setTitle(data.title);
        },
        getData: function() {
            return {
                title: this.getTitle()
            };
        },
        getType: function() {
            return 'section';
        },
        enterEditingMode: function()
        {
            this.editInputField = $('<input type="text" />')
            .addClass("input-xxlarge")
            .addClass('kdoc-editing-text')
            .insertAfter(this.titleObject);
            this.editInputField.focus().val(this.titleObject.html()).select();

            this.titleObject.hide();
            return true;
        },
        exitEditingMode: function()
        {
            this.titleObject.show();
            this.setTitle(this.editInputField.val());
            this.editInputField.remove();
            this.editInputField = null;
            return false;
        },
        getTitle: function()
        {
            return this.titleObject.html();
        },
        setTitle: function(title)
        {
            if (this.titleObject)
                this.titleObject.html(title);
        },
        _addFocusStyle: function() {
            this.titleObject.addClass('kdoc-selected');
        },
        _removeFocusStyle: function() {
            this.titleObject.removeClass('kdoc-selected');
        },
        toString: function() {
            return this.getTitle();
        }
    });

    /**
     * 
     * <div class="k_document">
     *  <h1 class="k_title"></h1>
     * </div>
     */
    var Document = classesOfElements.Document = Section.extend({
        getType: function() {
            return 'document';
        },
        _initElement: function()
        {
            this._super();
            this.object.addClass('kdoc-root');
        }
    });

    var Documentor = function(element, options)
    {
        this.element = element;
        this.container = $(element);

        //if data not in options and bodyFeild is specified, we assume is not new document, fetch data from bodyField
        if (typeof(options.data) !== "object" && options.bodyFieldSelector) {
            console.log(options.bodyFieldSelector);
            this.bodyFieldObject = $(options.bodyFieldSelector);
            //TODO: may be data corrupted
            try {
                options.data = JSON.parse(this.bodyFieldObject.val());
            }
            catch (e) {

            }
        }
        if (options.titleFieldSelector) {
            this.titleFieldObject = $(options.titleFieldSelector);
        }
        if (options.formSelector) {
            this.formObject = $(options.formSelector);
        }

        this.options = $.extend({}, $.fn[pluginName].defaults, options);
        this._init();
    };

    Documentor.prototype = {
        _init: function() {
            //compatible with prevous version
            if (this.options.data.type === "page")
                this.options.data.type = "document";
            this.document = new Document(this.options.data);
            this.document.documentor = this;
            this.document.create(this.options.data);
            this.breadCrumbs = $('<ul><li class="kdoc-nav"><b> Navigator</b> : </li> </ul>').addClass("breadcrumb");
            this.container.append(this.breadCrumbs);
            this.container.append(this.document.object);
            this.loadHotkeys();
            this.onEditing = false;
            this.selected = null;
            this.prevSelected = null;
            var me = this;
            this.document.object.on('click', function(event) {
                if (me.onEditing)
                    return;
                var toSelect = $(event.target);
                if (!toSelect.hasClass('kdoc-element')) {
                    toSelect = toSelect.parents('.kdoc-element').first();

                }
                toSelect.data('kdoc-element').setFocus();
            });
            this.document.object.on('dblclick', function() {
                me.switchSelectedEditingMode();
            });
            if (this.formObject) {
                this.formObject.on('submit', function(event) {
                    if (me.bodyFieldObject) {
                        me.bodyFieldObject.val(JSON.stringify(me.document.getJsonData()));
                    }
                    if (me.titleFieldObject)
                    {
                        me.titleFieldObject.val(me.document.getTitle());
                    }
                });
            }
        },
        getElementClass: function(type) {
            type = ucfirst(type);
            if (type && classesOfElements[type]) {
                return classesOfElements[type];
            }

        },
        onSelectedChange: function() {
            $("li:not(.kdoc-nav)", this.breadCrumbs).remove();
            if (this.selected) {

                var elements = this.selected.parentsWithSelf();
                console.log(typeof(elements));
                //this.breadCrumbs;
                var len = elements.length,
                item = null;
                for (var i = len; i > 0; i--)
                {
                    if (i === 1) {
                        item = $('<li>' + elements[i - 1].toString() + '</li> ');
                        item.addClass('active');
                    }
                    if (i > 1)
                    {
                        item = $('<li><a href="#">' + elements[i - 1].toString() + '</a> <span class="divider">/</span></li>');
                    }
                    this.breadCrumbs.append(item);
                }
            }

        },
        createElement: function(data) {
            if (!data || !data.type) {
                throw "Create element data is NOT valid."
            }
            var constructor = this.getElementClass(data.type);
            if (!constructor) {
                throw "Element Of Class: " + data.type + " NOT exsists.";
            }

            return new constructor(data);
        },
        createChildElementToSelected: function(data)
        {
            var selected = this.getSelected();

            if (!this.onEditing && selected && data && data.type)
            {

                try {
                    var newElement = null;
                    if (selected.isExclude(data.type))
                    {
                        newElement = this.createElement(data);
                        if (!selected.parent.isExclude(data.type)) {
                            newElement.insertAfter(selected);
                        }
                    } else {
                        newElement = this.createElement(data);
                        selected.prepend(newElement);
                    }
                    newElement.setFocus();
                } catch (e)
                {
                    console.log(e);
                }
            }
        },
        getSelected: function()
        {
            return this.selected;
        },
        moveUpToSelect: function()
        {
            if (this.onEditing)
                return;
            var toSelect = null;
            if (!this.selected) {
                toSelect = this.prevSelected || this.document;
            } else
            {
                toSelect = this.selected.getUpToSelectElement();
            }
            toSelect.setFocus();
        },
        moveDownToSelect: function()
        {
            if (this.onEditing)
                return;
            var toSelect = null;
            if (!this.selected) {
                toSelect = this.prevSelected || this.document;
            } else
            {
                toSelect = this.selected.getDownToSelectElement();
            }
            toSelect.setFocus();
        },
        moveSelectedUp: function() {
            if (!this.selected || this.onEditing || !this.selected.document)
                return;
            var prev = this.selected.prev();

            if (prev) {
                this.selected.insertBefore(prev);
            } else
            {
                this.selected.parent.append(this.selected);
            }

        },
        moveSelectedDown: function() {
            if (!this.selected || this.onEditing || !this.selected.document)
                return;
            var next = this.selected.next();

            if (next) {
                this.selected.insertAfter(next);
            } else
            {

                this.selected.parent.prepend(this.selected);
            }
        },
        switchSelectedEditingMode: function() {
            if (!this.selected)
                return;
            if (this.onEditing) {
                this.onEditing = this.selected.exitEditingMode();
            } else
            {
                this.onEditing = this.selected.enterEditingMode();
            }
        },
        cancelSelectedOrExitEditingMode: function() {
            if (this.selected)
            {
                if (this.onEditing)
                {
                    this.onEditing = this.selected.exitEditingMode();
                } else
                {
                    this.selected.loseFocus();
                }
            }
        },
        deleteSelected: function() {
            if (this.selected && this.selected.document && !this.onEditing)
            {
                var toSelect = this.selected.next();
                if (!toSelect)
                    toSelect = this.selected.parent;

                //this.selected.loseFocus();
                this.selected.remove();
                toSelect.setFocus();
            }
        },
        promoteSelected: function() {
            if (this.selected && this.selected.document && !this.onEditing) {
                if (this.selected.parent === this.selected.document)
                    return;
                if (this.selected.parent.parent.isExclude(this.selected))
                    return;
                this.selected.insertAfter(this.selected.parent);
                this.selected.setFocus();
            }
        },
        degradeSelected: function() {
            if (this.selected && this.selected.document && !this.onEditing) {
                var prev = this.selected.prev();
                if (prev && !prev.isExclude(this.selected))
                {
                    prev.append(this.selected);
                    this.selected.setFocus();
                }

            }
        },
        initHotkeys: function()
        {
            var me = this;

            $.each(this.options.hotkeysTable, function(name, value) {
                var fn = me[value.fn];
                if (!fn)
                    throw "Hotkey callback configured error."
                $(document).bind(value.hotkey, function(event) {
                    fn.apply(me, value.args ? value.args : []);
                    event.preventDefault();
                });
            });
        },
        loadHotkeys: function(hotkeys)
        {

            hotkeys = hotkeys || [];
            this.options.hotkeysTable = $.extend({}, this.options.hotkeysTable, hotkeys);
            this.initHotkeys();
        }
    };


    $.fn[pluginName] = function(options) {
        return this.each(function() {

            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Documentor(this, options));
            }
        });
    };

    $.fn[pluginName].defaults = {
        data: {
            type: 'document',
            data: {title: 'untitled'}
        },
        titleFieldSelector: null,
        bodyFieldSelector: null,
        formSelector: null,
        hotkeysTable: {
            'Create Paragraph': {hotkey: 'keypress.p', fn: "createChildElementToSelected", args: [{type: 'paragraph', data: {content: 'paragraph'}}]},
            'Create Section': {hotkey: 'keypress.s', fn: "createChildElementToSelected", args: [{type: 'section', data: {title: 'untitled'}}]},
            'Create List': {hotkey: 'keypress.l', fn: "createChildElementToSelected", args: [{type: 'list'}]},
            'Create Highlight': {hotkey: 'keypress.h', fn: "createChildElementToSelected", args: [{type: 'highlight'}]},
            'Create Admonition': {hotkey: 'keypress.m', fn: "createChildElementToSelected", args: [{type: 'admonition'}]},
            'Move Focus Up': {hotkey: 'keydown.up', fn: "moveUpToSelect"},
            'Move Focus Down': {hotkey: 'keydown.down', fn: "moveDownToSelect"},
            'Switch Editing Mode': {hotkey: 'keydown.ctrl_return', fn: "switchSelectedEditingMode"},
            'Cancel Focus Or Editing': {hotkey: 'keydown.esc', fn: "cancelSelectedOrExitEditingMode"},
            'Delete You Selected': {hotkey: 'keydown.ctrl_del', fn: "deleteSelected"},
            'Promote': {hotkey: 'keydown.ctrl_left', fn: "promoteSelected"},
            'Degrade': {hotkey: 'keydown.ctrl_right', fn: "degradeSelected"},
            'Up': {hotkey: 'keydown.ctrl_up', fn: "moveSelectedUp"},
            'Down': {hotkey: 'keydown.ctrl_down', fn: "moveSelectedDown"}
        }
    };

})(jQuery, window, document);