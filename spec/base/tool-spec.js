describe("* Base: Tool", function() {

    var placeholder, utils, tool, YearDisplay, MyTool;

    beforeAll(function() {
        initializeDOM();
        placeholder = document.getElementById("test-placeholder");
        utils = Vizabi.utils;

        //create a new component fo ryear display and register
        Vizabi.Component.unregister('year-display');
        YearDisplay = Vizabi.Component.extend('year-display', {
            init: function(config, parent) {
                this.name = "year-display";
                this.template = "<h2></h2>";
                this.model_expects = [{
                    name: 'time',
                    type: 'time'
                }];
                var _this = this;
                this.model_binds = {
                    'change:time': function() {
                        _this.update()
                    }
                };
                this._super(config, parent);

                this.on('ready', function() {
                    _this.update();
                });
            },

            update: function(evt) {
                this.element.innerHTML = this.model.time.value;
            }
        });

        //create a new component class
        MyTool = Vizabi.Tool.extend('MyTool', {
            init: function(placeholder, options) {
                this.name = 'MyTool';
                this.template = '<div><div class="display"></div></div>';
                this.components = [{
                    component: 'year-display',
                    placeholder: '.display',
                    model: ['time']
                }];
                this._super(placeholder, options);
            }
        });

    });

    it("should have registered as a tool", function() {
        expect(Vizabi.Tool._collection.hasOwnProperty('MyTool')).toBe(true);
    });

    it("should initialize and render tool", function() {
        tool = new MyTool(placeholder, {
            time: {
                value: 2013
            }
        });
        expect(placeholder.innerHTML).toEqual('<div><div class="display"><h2>2013</h2></div></div>');
    });

    it("should be initialized from name by Vizabi", function() {
        tool = Vizabi('MyTool', placeholder, {
            time: {
                value: 2011
            }
        });
        expect(placeholder.innerHTML).toEqual('<div><div class="display"><h2>2011</h2></div></div>');
    });

    it("should be in instances of Vizabi", function() {

        Vizabi.clearInstances();

        tool = Vizabi('MyTool', placeholder, {
            time: {
                value: 2011
            }
        });

        tool2 = Vizabi('MyTool', placeholder, {
            time: {
                value: 2013
            }
        });
        expect(Object.keys(Vizabi._instances).length).toEqual(2);
    });

    it("should update view when changing value", function() {
        tool = Vizabi('MyTool', placeholder, {
            time: {
                value: 2011
            }
        });
        expect(placeholder.innerHTML).toEqual('<div><div class="display"><h2>2011</h2></div></div>');

        tool.setOptions({
            time: {
                value: 2010
            }
        });
        expect(placeholder.innerHTML).toEqual('<div><div class="display"><h2>2010</h2></div></div>');
    });

});