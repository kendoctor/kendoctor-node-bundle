;
(function($, window, document, undefined) {


    var classesOfElements = {};

	function ucfirst(s)
    {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // Create the defaults once
    var pluginName = 'kenDocument',
    defaults = {
        propertyName: "value"
    };

    var Element = Class.extend({
        init: function(data) {
            // if(!data || !data.type) throw exception
            this.type = data.type;
            this._initElement()
        },
        _initElement: function()
        {
        },
        create: function(data)
        {
			if (data.type  === undefined || this.getType() != data.type) {
                alert("invalid data");
                return;
            }
            this.setData(data.data);
            for (var i = 0; i < data.nodes.length; i++)
            {
                var childData = data.nodes[i];
                var className = classesOfElements[ucfirst(childData.type)];
                var child = new className(data);
				this.object.append(child.object);
                child.create(childData);                
            }
            this.update();
        },
        update: function()
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
            this.object.children().each(function() {
                var documentElement = $(this).data('kdoc-element');
                if (documentElement) {
                    nodes.push(documentElement.getJsonData());
                }
            });
            return {
                type: this.type,
                data: this.getData(),
                nodes: nodes
            };
        },
		getType: function()
		{
			alert('abstract element class');
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
            .addClass('k_paragraph')
            .data('kdoc-element', this);
        },
		setData: function(data)
		{
			this.object.html(data.content);
		},
		getData: function()
		{
			return { content: this.object.html() }
		},
		getType: { return 'paragraph'; }
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
            if(!this.object) {
                this.object = $('<div></div>')
                .addClass('k_section');
            }
            this.object.append(
            $('<h1></h1>').addClass('k_title'))
            .data('kdoc-element', this);
        },
		setData: function(data) {
			this.object.children('.k_title').html(data.title);
		},
        getData: function() {
            return {
                title: this.object.children('.k_title').html()
            }
        },
		getType: { return 'section'; }
    });

    var Document = classesOfElements.Document = Section.extend({
        init: function(element, options) {       
            var defaults = {};
            this.element = element;
            this.object = $(element);
            this.options = $.extend( {}, defaults, options) ;     
			this._initElement();
			this.create(this.options.data);
        } ,
		getType: { return 'document'; }
    });



    $.fn[pluginName] = function(options) {
        return this.each(function() {
			
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Document(this, options));
            }
        });
    }

})(jQuery, window, document);