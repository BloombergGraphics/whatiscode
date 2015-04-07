/**
 * javascript sandbox console 0.1.5 - joss crowcroft
 * 
 * requires underscore, backbone, backbone-localStorage and jquery
 * 
 * http://josscrowcroft.github.com/javascript-sandbox-console/
 */
var Sandbox = {

	/**
	 * The Sandbox.Model
	 * 
	 * Takes care of command evaluation, history and persistence via localStorage adapter
	 */
	Model : Backbone.Model.extend({
		defaults: {
			history : [],
			iframe : false, // if true, run `eval` inside a sandboxed iframe
			fallback : true // if true, use native `eval` if the iframe method fails
		},
		initialize: function() {
			_.bindAll(this);

			// Attempt to fetch the Model from localStorage
			this.fetch();

			// Set up the iframe sandbox if needed
			if ( this.get('iframe') ) this.iframeSetup();

			// When the Model is destroyed (eg. via ':clear'), erase the current history as well
			this.bind("destroy", function(model) {
				model.set({history:[]});
			});
		},

		// The Sandbox Model tries to use the localStorage adapter to save the command history
		localStorage: new Store("SandboxConsole"),
		
		// Parser for restoring the Model's state
		// Backbone.localStorage adapter stores a collection, so grab the first 'model'
		parse : function(data) {	

			// `parse` also fires when doing a save, so just return the model for that
			if ( !_.isArray(data) || data.length < 1 || !data[0] ) return data;

			// Hide the saved command history, so that they don't show up in output,
			// and delete the results and classes from each, because they won't be needed
			data[0].history = _.map(data[0].history, function(command) {
				command._hidden = true;
				if ( command.result ) delete command.result;
				if ( command._class ) delete command._class;
				return command;
			});

			// Shouldn't save whether/not this is sandboxed (it's confusing)
			delete data[0].iframe;
			return data[0];
		},

		// Inspect an object and output the results
		// todo: Implement a custom stringify similar to jsconsole.com, to include native
		// and circular objects, and all object methods
		stringify : function(obj) {
			try {
				return JSON.stringify(obj);
			} catch(e) {
				return obj.toString();
			}
		},

		// Adds a new item to the history
		addHistory: function(item) {
			var history = this.get('history');

			// Tidy up the item's result
			if (_.isString(item.result)) item.result = '\"' + item.result.toString().replace(/"/g, '\\"') + '\"';
			if (_.isFunction(item.result)) item.result = item.result.toString().replace(/"/g, '\\"');
			if (_.isObject(item.result)) item.result = this.stringify(item.result).replace(/"/g, '\\"');
			if (_.isUndefined(item.result)) item.result = "undefined";

			// Add the command and result to the history
			history.push(item);

			// Update the history state and save the model
			this.set({ history : history }).change();
			this.save();

			return this;
		},

		// Creates the sandbox iframe, if needed, and stores it
		iframeSetup : function() {
			this.sandboxFrame = $('<iframe width="0" height="0"/>').css({visibility : 'hidden'}).appendTo('body')[0];
			this.sandbox = this.sandboxFrame.contentWindow;

			// This should help IE run eval inside the iframe.
			if (!this.sandbox.eval && this.sandbox.execScript) {
				this.sandbox.execScript("null");
			}
		},

		// Runs `eval` safely inside the sandboxed iframe
		iframeEval : function(command) {
			// Set up the iframe if not set up already (in case iframe has been enabled):
			if ( !this.sandbox ) this.iframeSetup();

			// Evaluate inside the sandboxed iframe, if possible.
			// If fallback is allowed, use basic eval, or else throw an error.
			return this.sandbox.eval ? this.sandbox.eval(command) : this.get('fallback') ? eval(command) : new Error("Can't evaluate inside the iframe - please report this bug along with your browser information!");
		},

		// One way of loading scripts into the document or the sandboxed iframe:
		load : function(src) {
			var script = document.createElement('script');
			script.type = "text/javascript";
			script.src = src;

			if ( this.get('iframe') ) {
				return this.sandboxFrame ? this.sandboxFrame.contentDocument.body.appendChild(script) : new Error("sandbox: iframe has not been created yet, cannot load " + src);
			} else {
				return document.body.appendChild(script);
			}
		},

		// Evaluate a command and save it to history
		evaluate: function(command) {
			if ( !command )
				return false;

			var item = {
				command : command
			};
			
			// Evaluate the command and store the eval result, adding some basic classes for syntax-highlighting
			try {
				item.result = this.get('iframe') ? this.iframeEval(command) : eval.call(window, command);
				if ( _.isUndefined(item.result) ) item._class = "undefined";
				if ( _.isNumber(item.result) ) item._class = "number";
				if ( _.isString(item.result) ) item._class = "string";
			} catch(error) {
				item.result = error.toString();
				item._class = "error";
			}

			// Add the item to the history
			return this.addHistory(item);
		}
	}),


	/**
	 * The Sandbox.View
	 * 
	 * Defers to the Sandbox.Model for history, evaluation and persistence
	 * Takes care of all the rendering, controls, events and special commands
	 */
	View : Backbone.View.extend({
		initialize: function(opts) {
			_.bindAll(this);

			// Set up the history state (the up/down access to command history)
			this.historyState = this.model.get('history').length;
			this.currentHistory = "";

			// Set up the View Options
			this.resultPrefix = opts.resultPrefix || "  => ";
			this.tabCharacter = opts.tabCharacter || "\t";
			this.placeholder = opts.placeholder || "// type some javascript and hit enter (:help for info)";
			this.helpText = opts.helpText || "type javascript commands into the console, hit enter to evaluate. \n[up/down] to scroll through history, ':clear' to reset it. \n[alt + return/up/down] for returns and multi-line editing.";

			// Bind to the model's change event to update the View
			this.model.bind("change", this.update);

			// Delegate key and mouse events to View input
			this.el.delegate("textarea", {
				keydown : this.keydown,
				keyup : this.keyup
			});

			// Delegate click event to View output
			this.el.delegate(".output", {
				click : this.focus
			});

			// Render the textarea
			this.render();
		},

		// The templating functions for the View and each history item
		template: _.template( $('#tplSandbox').html() ),
		format : _.template( $('#tplCommand').html() ),

		// Renders the Sandbox View initially and stores references to the elements
		render: function() {
			this.el.html(this.template({
				placeholder : this.placeholder
			}));

			this.textarea = this.el.find("textarea");
			this.output = this.el.find(".output");

			return this;
		},
		
		// Updates the Sandbox View, redrawing the output and checking the input's value
		update : function() {
			this.output.html(
				// Reduce the Model's history into HTML, using the command format templating function
				_.reduce(this.model.get('history'), function(memo, command) {
					return memo + this.format({
						_hidden : command._hidden,
						_class : command._class,
						command : this.toEscaped(command.command),
						result :  this.toEscaped(command.result)
					});
				}, "", this)
			);
			
			// Set the textarea to the value of the currently selected history item
			// Update the textarea's `rows` attribute, as history items may be multiple lines
			this.textarea.val(this.currentHistory).attr('rows', this.currentHistory.split("\n").length);

			// Scroll the output to the bottom, so that new commands are visible
			this.output.scrollTop(
				this.output[0].scrollHeight - this.output.height()
			);
		},

		// Manually set the value in the sandbox textarea and focus it ready to submit:
		setValue : function(command) {
			this.currentHistory = command;
			this.update();
			this.setCaret( this.textarea.val().length );
			this.textarea.focus();
			return false;
		},

		// Returns the index of the cursor inside the textarea
		getCaret : function() {
			if (this.textarea[0].selectionStart) {
				return this.textarea[0].selectionStart; 
			} else if (document.selection) { 
				// This is for IE (apparently ... not tested yet)
				this.textarea[0].focus();
				var r = document.selection.createRange();
				if (r === null) return 0;
	
				var re = this.textarea[0].createTextRange(),
				rc = re.duplicate();
				re.moveToBookmark(r.getBookmark());
				rc.setEndPoint('EndToStart', re);
	
				return rc.text.length;
			}
			// If nothing else, assume index 0
			return 0;
		},

		// Sets the cursor position inside the textarea (not IE, afaik)
		setCaret: function(index) {
			this.textarea[0].selectionStart = index;
			this.textarea[0].selectionEnd = index;
		},

		// Escapes a string so that it can be safely html()'ed into the output:
		toEscaped: function(string) {
		    return String(string)
		    	.replace(/\\"/g, '"')
	            .replace(/&/g, '&amp;')
	            .replace(/"/g, '&quot;')
	            .replace(/'/g, '&#39;')
	            .replace(/</g, '&lt;')
	            .replace(/>/g, '&gt;');
		},

		// Focuses the input textarea
		focus: function(e) {
			e.preventDefault();
			this.textarea.focus();
			return false;
		},
		
		// The keydown handler, that controls all the input
		keydown: function(e) {
			// Register shift, control and alt keydown
			if ( _([16,17,18]).indexOf(e.which, true) > -1 ) this.ctrl = true;

			// Enter submits the command
			if (e.which === 13) {
				e.preventDefault();
				var val = this.textarea.val();

				// If shift is down, do a carriage return
				if ( this.ctrl ) {
					this.currentHistory = val + "\n";
					this.update();
					return false;
				}
				
				// If submitting a command, set the currentHistory to blank (empties the textarea on update)
				this.currentHistory = "";
	
				// Run the command past the special commands to check for ':help' and ':clear' etc.
				if ( !this.specialCommands( val ) ) {

					// If if wasn't a special command, pass off to the Sandbox Model to evaluate and save
					this.model.evaluate( val );
				}
	
				// Update the View's history state to reflect the latest history item
				this.historyState = this.model.get('history').length;
				
				return false;
			}
	
			// Up / down keys cycle through past history or move up/down
			if ( !this.ctrl && (e.which === 38 || e.which === 40) ) {
				e.preventDefault();

				var history = this.model.get('history');
				
				// `direction` is -1 or +1 to go forward/backward through command history
				var direction = e.which - 39;
				this.historyState += direction;
	
				// Keep it within bounds
				if (this.historyState < 0) this.historyState = 0;
				else if (this.historyState >= history.length) this.historyState = history.length;
				
				// Update the currentHistory value and update the View
				this.currentHistory = history[this.historyState] ? history[this.historyState].command : "";
				this.update();

				return false;
			}
	
			// Tab adds a tab character (instead of jumping focus)
			if ( e.which === 9 ) {
				e.preventDefault();

				// Get the value, and the parts between which the tab character will be inserted
				var value = this.textarea.val(),
					caret = this.getCaret(),
					parts = [
						value.slice(0, caret),
						value.slice(caret, value.length)
					];
				
				// Insert the tab character into the value and update the textarea
				this.textarea.val(
					parts[0] + this.tabCharacter + parts[1]
				);

				// Set the caret (cursor) position to just after the inserted tab character
				this.setCaret(caret + this.tabCharacter.length);

				return false;
			}
		},
		
		// The keyup handler, used to switch off shift/alt keys
		keyup: function(e) {
			// Register shift, alt and control keyup
			if ( _([16,17,18]).indexOf(e.which, true) > -1 ) this.ctrl = false;
		},
		
		// Checks for special commands. If any are found, performs their action and returns true
		specialCommands: function(command) {
			if (command === ":clear") {
				this.model.destroy();
				return true;
			}
			if ( command === ":help" ) {
				return this.model.addHistory({
					command : ':help',
					result : this.helpText
				});
			}
			// `:load <script src>`
			if ( command.indexOf(":load") > -1 ) {
				return this.model.addHistory({
					command : command,
					result : this.model.load( command.substring(6) )
				});
			} 

			// If no special commands, return false so the command gets evaluated
			return false;
		}
	})
};