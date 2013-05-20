(function() {
    Ken =  function() {};
    
    Ken.JSON = {};

    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };


    Ken.ucfirst = function(s)
    {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    Ken.JSON.stringify = function(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string")
                obj = '"' + obj + '"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (t == "string")
                    v = '"' + v + '"';
                else if (t == "object" && v !== null)
                    v = Ken.JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    Ken.setSelectionRange = function(input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    Ken.setCaretToPos = function(input, pos) {
        Ken.setSelectionRange(input, pos, pos);
    }

    Ken.initPage = function(title)
    {
        Ken.page = new Page(title);
        return Ken.page;
    }


    var PageElement = Class.extend({
        init: function()
        {
            this.events = {};
            //是否此元素有焦点特性
            this.hasFocus = true;
            //文档页面根节点
            this.pageRoot = null;
            //是否此元素获得焦点
            //this.focused = false;
            this.excludeElements = [];
            // 能包含的文档元素类型
            this.includeElements = null;

            this.parentElement = null;
            this.children = [];
            this.elementDom = null;
            this._initElement();
            this._initExcludeElements();
            var me = this;
            $(this.elementDom).click(function(event) {
                if (me.getPage().onEditing)
                    return;
                if (me.hasFocus) {
                    me.setFocus();
                    event.stopImmediatePropagation();
                }
            });
            $(this.elementDom).dblclick(function(event) {
                me.getPage().switchTheElementOnEditing(me);
                event.stopImmediatePropagation();

            });
        },
        _initElement: function()
        {

        },
        _updateElement: function()
        {

        },
        _initExcludeElements: function()
        {
            this.excludeElements = [];
        },
        // 初始化能包含的文档元素类型
        _initIncludeElements: function()
        {
            this.includeElements = [];
        },
        isExclude: function(element) {
            for (var i = 0; i < this.excludeElements.length; i++)
            {
                if (this.excludeElements[i] == element.getType())
                    return true;
            }
            return false;
        },
        fireEvent: function()
        {
        },
        on: function(event, callback)
        {
        },
        getUpElements: function(){
            var elements = [];
            elements.push(this);
            if(this instanceof Page) return elements;
            var parent = this;
            do
            { 
                parent = parent.getParent();
                elements.push(parent);      
            }
            while(!(parent instanceof Page));
            return elements;
        },
        getPage: function()
        {
            var thePage = this;
            var i = 1;
            while (1)
            {

                if (thePage instanceof Page)
                    break;
                thePage = thePage.getParent();
            }
            return thePage;
        },
        removeChild: function(child)
        {
            this.children.remove(child.index());
            child.elementDom.remove();
        },
        remove: function()
        {
            this.getParent().removeChild(this);
        },
        //当前焦点元素是自身，如果有子元素，让子元素获得焦点，如果没有那么让父元素决定
        getNextFocusElement: function()
        {
            var availableFocusElement = null;
            for (var i = 0; i < this.children.length; i++)
            {
                availableFocusElement = this.children[i];
                if (availableFocusElement.hasFocus)
                    return availableFocusElement;

                availableFocusElement = availableFocusElement.getNextFocusElement();
                if (availableFocusElement)
                    return availableFocusElement;
            }

            var nextSibling = this.getNextSibling();
            if (nextSibling && nextSibling.hasFocus)
                return nextSibling;
            if (nextSibling)
                return nextSibling.getNextFocusElement();

            var theParent = this.getParent();
            while (theParent)
            {
                nextSibling = theParent.getNextSibling();
                if (nextSibling && nextSibling.hasFocus)
                    return nextSibling;
                if (nextSibling)
                    return nextSibling.getNextFocusElement();
                if (theParent instanceof Page)
                    return theParent;
                theParent = theParent.getParent().getNextSibling();
            }

        },
        findLastDescendant: function()
        {
            if (!this.hasChildren())
                return null;
            var last = this.getLastChild();
            while (last && last.hasChildren())
            {
                last = last.getLastChild();
            }
            return last;
        },
        getPrevFocusElement: function()
        {
            var last = null;
            if (this instanceof Page) {
                last = this.findLastDescendant();
                if (!last || !last.hasFocus)
                    return this;
                return last;
            }

            var prevSibling = this.getPrevSibling();

            if (prevSibling) {
                last = prevSibling.findLastDescendant();
                if (last && last.hasFocus)
                    return last;
                if (last)
                    return last.getPrevFocusElement();
                if (prevSibling.hasFocus)
                    return prevSibling;
            }

            var parent = this.getParent();
            if (parent.hasFocus)
                return parent;
            return parent.getPrevFocusElement();

        },
        hasChildren: function()
        {
            return this.children.length > 0;
        },
        getReStructruedText: function()
        {
        },
        getType: function() {
            alert("must overrided");
        },
        getData: function() {
            return {};
        },
        setData: function(data) {
        },
        create: function(data) {
            if (this.getType() != data.type) {
                alert("invalid data");
                return
            }
            this.setData(data.data);
            for (var i = 0; i < data.nodes.length; i++)
            {
                var childData = data.nodes[i];
                var className = Ken['Page' + Ken.ucfirst(childData.type)];
                var child = new className();
                child.create(childData);
                this.add(child);
            }
            this._updateElement();
        },
        getJsonData: function()
        {
            var data = {type: this.getType(), nodes: [], data: this.getData()};
            for (var i = 0; i < this.children.length; i++)
            {
                data.nodes.push(this.children[i].getJsonData());
            }
            return data;
        },
        setParent: function(parentElement)
        {            
            this.parentElement = parentElement;
            this._updateElement();
            
        },
        getParent: function()
        {
            return this.parentElement;
        },
        left: function()
        {

        },
        right: function()
        {

        },
        addFirst: function(childElement)
        {
            this.children.splice(0, 0, childElement);
            childElement.setParent(this);
            this.getDom().prepend(childElement.getDom());
        },
        add: function(childElement)
        {
            this.children.push(childElement);
            childElement.setParent(this);
            this.getDom().append(childElement.getDom());
            //parentElement.getDom().append(this.elementDom);    
            return this;
        },
        insert: function()
        {

        },
        index: function()
        {
            if (this.getParent())
            {
                var children = this.getParent().children;
                for (var i = 0; i < children.length; i++)
                {
                    if (this === children[i])
                        return i;
                }
            }
            return 0;
        },
        insertAfter: function(siblingElement)
        {
            if (siblingElement && siblingElement.getParent())
            {
                var index = siblingElement.index();
                var parent = siblingElement.getParent()
                parent.children.splice(index + 1, 0, this);
                this.getDom().insertAfter(siblingElement.getDom())
                this.setParent(parent);
            }
        },
        insertBefore: function(siblingElement){
            if (siblingElement && siblingElement.getParent())
            {
                var index = siblingElement.index();
                var parent = siblingElement.getParent()
                parent.children.splice(index - 1, 0, this);
                this.getDom().insertBefore(siblingElement.getDom())
                this.setParent(parent);
            }
        },
        getPrevSibling: function()
        {
            if (this.parentElement) {
                var children = this.parentElement.children;
                for (var i = 0; i < children.length; i++)
                {
                    if (children[i] == this && (i - 1) >= 0)
                    {
                        return children[i - 1];
                    }
                }
            }

            return null;
        },
        getNextSibling: function()
        {
            if (this.parentElement) {
                var children = this.parentElement.children;
                for (var i = 0; i < children.length; i++)
                {
                    if (children[i] == this && (i + 1) < children.length)
                    {
                        return children[i + 1];
                    }
                }
            }

            return null;
        },
        getFirstChild: function()
        {
            if (this.children.length > 0)
                return this.children[0];
            return null;
        },
        getLastChild: function()
        {

            if (this.children.length > 0)
            {
                return this.children[this.children.length - 1];
            }

            return null;
        },
        getLevel: function()
        {
            if (this.parentElement)
            {
                return this.parentElement.getLevel() + 1;
            }
            return 1;
        },
        getSectionLevel: function()
        {
            if (this.parentElement && (this.parentElement instanceof PageSection ||
                    this.parentElement instanceof Page))
            {

                return this.parentElement.getSectionLevel() + 1;
            }
            return 0;
        },
        enterEditingMode: function()
        {
            return false;
        },
        exitEditingMode: function()
        {
            return true;
        },
        getDom: function()
        {
            return this.elementDom;
        },
        _addFocusSelector: function()
        {
            this.elementDom.addClass('focus');
        },
        _removeFocusSelector: function()
        {
            this.elementDom.removeClass('focus');
        },
        setFocus: function()
        {
            if (this.hasFocus) {
                if (Ken.page && this === Ken.page.focusElement)
                    return;
                if (Ken.page) {
                    this._addFocusSelector();
                    if (Ken.page.focusElement)
                    {
                        Ken.page.focusElement.loseFocus();
                    }

                    Ken.page.focusElement = this;
                    if(Ken.page) Ken.page.onElementFocusChange();
                }
                
            }
        },
        loseFocus: function()
        {
            if (this.hasFocus) {                
                this._removeFocusSelector();
                if (Ken.page)
                    Ken.page.focusElement = null;
                if(Ken.page) Ken.page.onElementFocusChange();
            }
        },
        onRemove: function() {
            return false;
        },
        onCreate: function()
        {

        },
        promoteElement: function()
        {
            if(this.getLevel() <= 2) return false;
            var parent = this.getParent(),
                parentOfParent = parent.getParent();
            if(parentOfParent.isExclude(this)) { return; false }
            this.detach();
            this.insertAfter(parent);
            Ken.page.onElementFocusChange();
            return true;
        },
        detach: function()
        {  
            if(this.getParent() && !(this instanceof Page)){
                this.getParent().children.remove(this.index());
                this.getDom().detach();
            }            
        },
        degradeElement: function()
        {
            var prevSibling = this.getPrevSibling();
            if(!prevSibling || prevSibling.isExclude(this)) return false;
            this.detach();
            prevSibling.add(this);
            return true;
        },
        upElement: function()
        {
            var prevSibling = this.getPrevSibling();
            if(prevSibling) 
            {
               prevSibling.detach();
               prevSibling.insertAfter(this);
            }else
            {
               if(this.promoteElement())
                {
                    this.upElement();
                }
            }
        }, 
        downElement:function() {
             var nextSibling = this.getNextSibling();
             if(nextSibling){
                 this.detach();
                 if(nextSibling.isExclude(this)) {                 
                    this.insertAfter(nextSibling);
                 }else
                {
                   nextSibling.addFirst(this);
                }
             }else
             {
                this.promoteElement();
             }
        }
    });

    var PageHighlight = Ken.PageHighlight = PageElement.extend({
        init: function()
        {
            this.code = "php";
            this.highLightDom = null;
            this.preDom = null;
            this._super();
        },
        _initElement: function()
        {
            this.preDom = $("<pre />");
            this.highLightDom = $("<div />").addClass("highlight").append(this.preDom);
            this.elementDom = $("<div />").addClass("highlight-" + this.code).append(this.highLightDom);

        },
        _updateElement: function()
        {
            this.setContent(this.content);
        },
        _initExcludeElements: function()
        {
            this.excludeElements = ['paragraph', 'section', 'highlight', 'list'];
        },
        setContent: function(content)
        {
            this.content = content;
            this.preDom.text(content);
        },
        getContent: function()
        {
            return this.preDom.text();
        },
        enterEditingMode: function()
        {
            this.editInputField = $("<textarea class=\"editingField\" />").insertAfter(this.elementDom);
            this.editInputField.focus().val(this.getContent());
            this.elementDom.hide();
            return true;

        },
        exitEditingMode: function()
        {
            this.elementDom.show();
            this.setContent(this.editInputField.val());
            this.editInputField.remove()
            this.editInputField = null;
            return false;
        },
        getType: function() {
            return "highlight";
        },
        getData: function() {
            return {content: this.content}
        },
        setData: function(data) {
            this.content = data.content;
        }
    });

    var PageImage = Ken.PageImage = PageElement.extend({
        init: function()
        {
            this.imageUrl = "";
            this.align = "align-center";
            this._super();
        },
        _initElement: function()
        {
            this.elementDom = $("<img />").addClass(this.align).addClass(this.type);
        },
        enterEditingMode: function()
        {
            this.editInputField = $("<input class=\"editingField\" />").insertAfter(this.elementDom);
            this.editInputField.focus().val(this.elementDom.attr("src"));
            // Ken.setCaretToPos(this.editInputField[0]);
            this.elementDom.hide();
            return true;

        },
        exitEditingMode: function()
        {
            this.elementDom.show();
            this.imageUrl = this.editInputField.val();
            this.elementDom.attr("src", this.imageUrl);
            this.editInputField.remove()
            this.editInputField = null;
            return false;
        },
        getType: function() {
            return "image";
        },
        getData: function() {
            return {imageUrl: this.imageUrl}
        },
        setData: function(data) {
            this.imageUrl = data.imageUrl;
            this.elementDom.attr("src", this.imageUrl);
        }
    });

    var PageAdmonition = Ken.PageAdmonition = PageElement.extend({
        init: function()
        {
            this.types = {
                "note": "note",
                "tip": "tip"
            };
            this.type = "note";
            this.titleDom = null;
            this._super();
            this.hasFocus = true;
            if(Ken && !Ken.page.isLoading) {
                this.add(new PageParagraph("..."));
            }
        },
        _initElement: function()
        {
            this.elementDom = $("<div />").addClass("admonition").addClass(this.type);
            this.titleDom = $("<p />").addClass("first").addClass("admonition-title").text(this.types[this.type]);
            this.elementDom.append(this.titleDom);
        },
        _initExcludeElements: function()
        {
            this.excludeElements = ['section', 'admonition'];
        },
        getType: function() {
            return "admonition";
        },
        getData: function() {
            return {type: this.type}
        },
        setData: function(data) {
            this.type = data.type;
        },
        addFirst: function(childElement)
        {
            this.children.splice(0, 0, childElement);
            childElement.setParent(this);
            childElement.getDom().insertAfter(this.titleDom);
        }
    });


    /**
     * <ul>
     *  <li></li>
     *  <li></li>
     *  </ul>
     */
    var PageList = Ken.PageList = PageElement.extend({
        init: function()
        {
            this._super();
        },
        _initElement: function()
        {
            this.elementDom = $("<ul />");
        },
        initExcludeElements: function()
        {
            this.excludeElements = ['section', 'admonition', 'highlight'];
        },
        getContentOfItems: function()
        {
            var content = [];
            $("li", this.elementDom).each(function() {
                content.push($(this).html());
            });
            return content.join("\n");
        },
        createItemsFromContent: function(content)
        {
            this.elementDom.empty();

            var items = content.split("\n");
            for (var i = 0; i < items.length; i++)
            {
                if (items[i].length == 0)
                    continue;
                this.elementDom.append($("<li />").html(items[i]));
            }
        },
        enterEditingMode: function()
        {
            this.editInputField = $("<textarea class=\"editingField\" />").insertAfter(this.elementDom);
            this.editInputField.focus().val(this.getContentOfItems());
            // Ken.setCaretToPos(this.editInputField[0]);
            this.elementDom.hide();
            return true;

        },
        exitEditingMode: function()
        {
            this.elementDom.show();
            this.createItemsFromContent(this.editInputField.val());
            this.editInputField.remove()
            this.editInputField = null;
            return false;
        },
        getType: function() {
            return "list";
        },
        getData: function() {
            return {content: this.getContentOfItems()}
        },
        setData: function(data) {
            this.createItemsFromContent(data.content);
        }
    });

    var PageParagraph = Ken.PageParagraph = PageElement.extend({
        init: function(content)
        {
            this.content = content;
            this._super();
        },
        _initElement: function()
        {
            this.elementDom = $("<p />");
            if (this.content)
                this.setContent(this.content);
        },
        _initExcludeElements: function()
        {
            this.excludeElements = ['paragraph', 'list', 'admonition', 'highlight','section'];
        },
        enterEditingMode: function()
        {
            this.editInputField = $("<textarea class=\"editingField\" />").insertAfter(this.elementDom);
            this.editInputField.focus().val(this.content).select();

            this.elementDom.hide();
            return true;
        },
        exitEditingMode: function()
        {
            this.elementDom.show();
            this.setContent(this.editInputField.val());
            this.editInputField.remove()
            this.editInputField = null;
            return false;
        },
        getContent: function()
        {
            return this.elementDom.text();
        },
        setContent: function(content)
        {
            this.content = content;
            if (this.elementDom)
                this.elementDom.text(this.content);
        },
        getType: function() {
            return "paragraph";
        },
        getData: function() {
            return {content: this.getContent()}
        },
        setData: function(data) {
            this.setContent(data.content);
        }
    });

    //alert(pe instanceof  PageElement);



    /**
     <div class="section">
     <h1>title</h1>
     <p></p> 
     </div>
     **/
    var PageSection = Ken.PageSection = PageElement.extend({
        init: function(title)
        {
            this.titleDom = null;
            this.title = title;
            this._super();
        },
        _initElement: function()
        {
            this.elementDom = $("<div />").addClass("section");
            this._updateElement();
        },
        _updateElement: function()
        {
            var level = this.getSectionLevel();
            var titleDom = $("<h" + level + " />");
            level = level > 6 ? 6 : level;
            if (this.elementDom && this.titleDom)
            {
                this.titleDom.replaceWith(titleDom);
            } else if (this.elementDom)
            {
                this.elementDom.prepend(titleDom);
            }
            this.titleDom = titleDom;
            if (this.title)
                this.setTitle(this.title);
            if(Ken.page && Ken.page.focusElement == this){
                this._addFocusSelector();
            }
        },
        _addFocusSelector: function()
        {
            this.elementDom.addClass('blockFocus')
            this.titleDom.addClass('focus');
        },
        _removeFocusSelector: function()
        {
            this.titleDom.removeClass('focus');
            this.elementDom.removeClass('blockFocus')
        },
        enterEditingMode: function()
        {
            this.editInputField = $("<input class=\"editingField\" />").insertAfter(this.titleDom);
            this.editInputField.focus().val(this.title).select();

            this.titleDom.hide();
            return true;
        },
        exitEditingMode: function()
        {
            this.titleDom.show();
            this.setTitle(this.editInputField.val());
            this.editInputField.remove()
            this.editInputField = null;
            return false;
        },
        getTitle: function()
        {
            return this.titleDom.text();
        },
        setTitle: function(title)
        {
            this.title = title;
            if (this.titleDom)
                this.titleDom.text(this.title);
        },
        getType: function() {
            return "section";
        },
        getData: function() {
            return {title: this.getTitle()}
        },
        setData: function(data) {
            this.setTitle(data.title);
        },
        addFirst: function(childElement)
        {
            this.children.splice(0, 0, childElement);
            childElement.setParent(this);
            childElement.getDom().insertAfter(this.titleDom);
        },
    });


    var Page = Ken.Page = PageSection.extend({
        init: function(title)
        {
            this.isLoading = false;
            this.focusElement = null;
            this.onEditing = false;
            this.hotkeys = null;
            this.navigatorDom = null;
            this._super(title);
            this.loadHotKeys();
        },
        _initElement: function()
        {
            this._super();
        },
        setNavigatorDom: function(dom)
        {
            this.navigatorDom = $(dom);
            if(this.navigatorDom)
            {
                this.navigatorDom.on('click', function(event) {
                     
                    if(event.target)
                    {
                        if($(event.target).hasClass('nav_item'))
                        {
                              var element = $(event.target).data('element');
                              if(element) { element.setFocus(); }
                        }
                    }
                })
            }
        },
        focusUp: function()
        {
            if (this.onEditing)
                return;
            var toFocusElement = (this.focusElement == null) ? this : this.focusElement.getPrevFocusElement();
            if (toFocusElement)
                toFocusElement.setFocus();
        },
        focusDown: function()
        {
            if (this.onEditing)
                return;
            var toFocusElement = (!this.focusElement) ? this : this.focusElement.getNextFocusElement();
            if (toFocusElement)
                toFocusElement.setFocus();
        },
        enterTheElementOnEditing: function(element)
        {
            if (this.focusElement && this.onEditing)
            {
                if (this.focusElement == element)
                    return;

                this.onEditing = this.focusElement.exitEditingMode();
            }
            if (!this.onEditing)
                this.onEditing = element.enterEditingMode();
        },
        exitTheElementOnEditing: function(element)
        {
            if (!this.onEditing)
                return;
            if (element != this.focusElement)
            {
                this.onEditing = this.focusElement.exitEditingMode();
            } else
            {
                this.onEditing = element.exitEditingMode();
            }
        },
        switchTheElementOnEditing: function(element)
        {
            this.onEditing ? this.exitTheElementOnEditing(element) : this.enterTheElementOnEditing(element);
        },
        switchFocusElementEditing: function()
        {
            if (this.focusElement)
            {
                this.onEditing = this.onEditing ? this.focusElement.exitEditingMode() : this.focusElement.enterEditingMode();
            }
        },
        exitFocusElementEditingOrLoseFocus: function()
        {
            if (this.focusElement)
            {
                if (this.onEditing)
                {
                    this.onEditing = this.focusElement.exitEditingMode();

                } else {
                    this.focusElement.loseFocus();
                }
            }
        },
        createElement: function(type) {
            if (this.onEditing || !this.focusElement)
                return;
            var className = Ken['Page' + Ken.ucfirst(type)];
            var newElement = new className();
            if (this.focusElement.isExclude(newElement))
            {
                var parent = this.focusElement.getParent();
                if (!parent.isExclude(newElement))
                {
                    newElement.insertAfter(this.focusElement);
                } else {
                    return;
                }
            } else
            {
                this.focusElement.addFirst(newElement);
            }
            newElement.setFocus();
            this.onEditing = newElement.enterEditingMode();
        },
        deleteSelectedElement: function() {
            if(this.focusElement && !this.onEditing) {
                var toDelete = this.focusElement;
                this.focusUp();
                toDelete.remove();
            }
        },
        promoteSelectedElement: function() {
             if(this.focusElement && !this.onEditing) {
                 this.focusElement.promoteElement();
             }
        },
        degradeSelectedElement: function() {
            if(this.focusElement && !this.onEditing)
            {
                this.focusElement.degradeElement();
            }
        },
        upSelectedElement: function() {
            if(this.focusElement && !this.onEditing)
            {
                this.focusElement.upElement();
            }
        },
        downSelectedElement: function() {
            if(this.focusElement && !this.onEditing)
            {
                this.focusElement.downElement();
            }
        },
        loadHotKeys: function(hotkeys)
        {
            if (!hotkeys)
            {
                this.hotkeys = [
                    {name: 'Create Paragraph', hotkey: 'keypress.p', fn: this.createElement, args: ['paragraph']},
                    {name: 'Create Section', hotkey: 'keypress.s', fn: this.createElement, args: ['section']},
                    {name: 'Create List', hotkey: 'keypress.l', fn: this.createElement, args: ['list']},
                    {name: 'Create Highlight', hotkey: 'keypress.h', fn: this.createElement, args: ['highlight']},
                    {name: 'Create Admonition', hotkey: 'keypress.m', fn: this.createElement, args: ['admonition']},
                    {name: 'Move Focus Up', hotkey: 'keydown.up', fn: this.focusUp},
                    {name: 'Move Focus Down', hotkey: 'keydown.down', fn: this.focusDown},
                    {name: 'Switch Editing Mode', hotkey: 'keydown.ctrl_return', fn: this.switchFocusElementEditing},
                    {name: 'Cancel Focus Or Editing', hotkey: 'keydown.esc', fn:this.exitFocusElementEditingOrLoseFocus },
                    {name: 'Delete You Selected', hotkey: 'keydown.ctrl_del', fn:this.deleteSelectedElement },
                    {name: 'Promote', hotkey: 'keydown.ctrl_left', fn:this.promoteSelectedElement } ,
                    {name: 'Degrade', hotkey: 'keydown.ctrl_right', fn:this.degradeSelectedElement },
                    {name: 'Up', hotkey: 'keydown.ctrl_up', fn:this.upSelectedElement },
                    {name: 'Down', hotkey: 'keydown.ctrl_down', fn:this.downSelectedElement }      
                ];
            } else
            {
                this.hotkeys = hotkeys;
            }
            this.initHotKeys();
        },
        initHotKeys: function()
        {
            var me = this;
            var hotkeyItem = null;
            $(this.hotkeys).each(function() {
                var h = this;
                $(document).bind(h.hotkey, function(event) {
                    h.fn.apply(me, h.args ? h.args : [])
                    event.preventDefault();
                });
            });



            /*
             var me = this;
             $(document).bind('keypress.p', 
             function(){
             if(me.onEditing || !me.focusElement) return ;
             var newElement = new PageParagraph("");
             if(me.focusElement.isExclude(newElement))
             {
             var parent = me.focusElement.getParent();
             if(!parent.isExclude(newElement))
             {
             newElement.insertAfter(me.focusElement);
             }else  {
             return;
             }
             }else
             {
             me.focusElement.addFirst(newElement);
             }                   
             newElement.setFocus();
             me.onEditing = newElement.enterEditingMode();  
             
             } 
             ).bind('keydown.up', function() {
             me.focusUp();
             }).bind('keydown.down', function() {
             me.focusDown();
             });
             
             $("body").keypress(function(event) {
             if ( event.which == 13 ) {
             event.preventDefault();
             }
             
             switch (event.keyCode)
             {
             case 46:
             if (event.ctrlKey && !me.onEditing && me.focusElement && !(me.focusElement instanceof Page))
             {
             
             var toDelete = me.focusElement;
             me.focusDown();
             toDelete.remove();
             }
             break;
             //ESC KEY
             case 27:
             if (me.onEditing)
             {
             me.onEditing = me.focusElement.exitEditingMode();
             
             } else
             {
             me.loseFocusCurrent();
             }
             break;
             
             case 13:
             if (event.ctrlKey && me.focusElement)
             {
             if (me.onEditing) {
             me.onEditing = false;
             me.focusElement.exitEditingMode();
             } else {
             me.onEditing = me.focusElement.enterEditingMode();
             }
             }
             break;
             }
             
             switch (event.charCode)
             {
             case 49:
             if (!me.onEditing)
             {
             var newElement = new PageSection("untitled");
             if (!me.focusElement || me.focusElement instanceof Page)
             {
             me.add(newElement);
             me.focusLast();
             }
             else if (me.focusElement)
             {
             newElement.insertAfter(me.focusElement);
             me.focusDown();
             }
             
             me.onEditing = true;
             newElement.enterEditingMode();
             }
             break;
             case 50:
             if (!me.onEditing)
             {
             if (me.focusElement)
             ;
             {
             
             var newElement = new PageParagraph("content");
             if (!me.focusElement || me.focusElement instanceof PageSection || me.focusElement instanceof Page)
             {
             me.focusElement ? me.focusElement.add(newElement) : me.add(newElement);
             me.focusTheElement(newElement);
             }
             else if (me.focusElement)
             {
             newElement.insertAfter(me.focusElement);
             me.focusDown();
             }
             
             me.onEditing = true;
             newElement.enterEditingMode();
             
             }
             }
             break;
             case 51:
             if (!me.onEditing)
             {
             if (me.focusElement)
             ;
             {
             
             var newElement = new PageList();
             if (!me.focusElement || me.focusElement instanceof PageSection || me.focusElement instanceof Page)
             {
             me.focusElement ? me.focusElement.add(newElement) : me.add(newElement);
             me.focusTheElement(newElement);
             }
             else if (me.focusElement)
             {
             newElement.insertAfter(me.focusElement);
             me.focusDown();
             }
             
             me.onEditing = true;
             newElement.enterEditingMode();
             
             }
             }
             break;
             case 52:
             if (!me.onEditing)
             {
             if (me.focusElement)
             ;
             {
             
             var newElement = new PageAdmonition();
             if (!me.focusElement || me.focusElement instanceof PageSection || me.focusElement instanceof Page)
             {
             me.focusElement ? me.focusElement.add(newElement) : me.add(newElement);
             me.focusTheElement(newElement);
             }
             else if (me.focusElement)
             {
             newElement.insertAfter(me.focusElement);
             me.focusDown();
             }
             
             }
             }
             break;
             case 53:
             if (!me.onEditing)
             {
             if (me.focusElement)
             ;
             {
             
             var newElement = new PageImage();
             if (!me.focusElement || me.focusElement instanceof PageSection || me.focusElement instanceof Page)
             {
             me.focusElement ? me.focusElement.add(newElement) : me.add(newElement);
             me.focusTheElement(newElement);
             }
             else if (me.focusElement)
             {
             newElement.insertAfter(me.focusElement);
             me.focusDown();
             }
             
             me.onEditing = true;
             newElement.enterEditingMode();
             
             }
             }
             break;
             case 54:
             if (!me.onEditing)
             {
             if (me.focusElement)
             ;
             {
             
             var newElement = new PageHighlight();
             if (!me.focusElement || me.focusElement instanceof PageSection || me.focusElement instanceof Page)
             {
             me.focusElement ? me.focusElement.add(newElement) : me.add(newElement);
             me.focusTheElement(newElement);
             }
             else if (me.focusElement)
             {
             newElement.insertAfter(me.focusElement);
             me.focusDown();
             }
             
             me.onEditing = true;
             newElement.enterEditingMode();
             
             }
             }
             break;
             }
             });*/
        },
        render: function(parentNode)
        {
            if (this.parentNode && parentNode)
                return;
            if (parentNode)
                this.parentNode = parentNode;

            if (this.parentNode)
                this.elementDom.appendTo(this.parentNode);
        },
        setParent: function(parentNode)
        {
            this.parentNode = parentNode;

        },
        getSectionLevel: function()
        {
            return 1;
        },
        getLevel: function()
        {
            return 1;
        },
        getType: function() {
            return "page";
        },
        getNextFocusElement: function()
        {
            var focusElement = this._super();
            if (!focusElement)
                return focusElement = this;
            return focusElement;
        },
        getPrevFocusElement: function()
        {
            var focusElement = this._super();
            if (!focusElement)
                return focusElement = this;
            return focusElement;
        },
        create: function(data)
        {
            this.isLoading = true;
            this._super(data);
            this.isLoading = false;
        },
        onElementFocusChange: function()
        {        
            
            if(!this.navigatorDom || !this.focusElement) {
                if(this.navigatorDom) {
                    this.navigatorDom.empty();
                }
                return;
            }            
            
            var elements = this.focusElement.getUpElements();
            this.navigatorDom.empty();
            
            for(var i = elements.length; i > 0; i--)
            {
                var navItem = $('<a class="nav_item" href="#"></a>').data("element", elements[i-1]).text(elements[i-1].getType());    
                this.navigatorDom.append(">> ");
                this.navigatorDom.append(navItem);
            }
            
        }

    });


    return Ken;

})();