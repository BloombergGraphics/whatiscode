(function() {
        
    function jetpack(d3) {
        d3.selection.prototype.translate = function(xy) {
            return this.attr('transform', function(d,i) {
                return 'translate('+[typeof xy == 'function' ? xy(d,i) : xy]+')';
            });
        };

        d3.transition.prototype.translate = function(xy) {
            return this.attr('transform', function(d,i) {
                return 'translate('+[typeof xy == 'function' ? xy(d,i) : xy]+')';
            });
        };

        d3.selection.prototype.tspans = function(lines, lh) {
            return this.selectAll('tspan')
                .data(lines)
                .enter()
                .append('tspan')
                .text(function(d) { return d; })
                .attr('x', 0)
                .attr('dy', function(d,i) { return i ? lh || 15 : 0; });
        };

        d3.selection.prototype.append = 
        d3.selection.enter.prototype.append = function(name) {
            var n = d3_parse_attributes(name), s;
            //console.log(name, n);
            name = n.attr ? n.tag : name;
            name = d3_selection_creator(name);
            s = this.select(function() {
                return this.appendChild(name.apply(this, arguments));
            });
            return n.attr ? s.attr(n.attr) : s;
        };

        d3.selection.prototype.insert = 
        d3.selection.enter.prototype.insert = function(name, before) {
            var n = d3_parse_attributes(name), s;
            name = n.attr ? n.tag : name;
            name = d3_selection_creator(name);
            before = d3_selection_selector(before);
            s = this.select(function() {
                return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
            });
            return n.attr ? s.attr(n.attr) : s;
        };

        var d3_parse_attributes_regex = /([\.#])/g;

        function d3_parse_attributes(name) {
            if (typeof name === "string") {
                var attr = {},
                    parts = name.split(d3_parse_attributes_regex), p;
                    name = parts.shift();
                while ((p = parts.shift())) {
                    if (p == '.') attr['class'] = attr['class'] ? attr['class'] + ' ' + parts.shift() : parts.shift();
                    else if (p == '#') attr.id = parts.shift();
                }
                return attr.id || attr['class'] ? { tag: name, attr: attr } : name;
            }
            return name;
        }

        function d3_selection_creator(name) {
            return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? function() {
                return this.ownerDocument.createElementNS(name.space, name.local);
            } : function() {
                return this.ownerDocument.createElementNS(this.namespaceURI, name);
            };
        }

        function d3_selection_selector(selector) {
            return typeof selector === "function" ? selector : function() {
                return this.querySelector(selector);
            };
        }

        d3.wordwrap = function(line, maxCharactersPerLine) {
            var w = line.split(' '),
                lines = [],
                words = [],
                maxChars = maxCharactersPerLine || 40,
                l = 0;
            w.forEach(function(d) {
                if (l+d.length > maxChars) {
                    lines.push(words.join(' '));
                    words.length = 0;
                    l = 0;
                }
                l += d.length;
                words.push(d);
            });
            if (words.length) {
                lines.push(words.join(' '));
            }
            return lines;
        };
        
        d3.ascendingKey = function(key) {
            return typeof key == 'function' ? function (a, b) {
                  return key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : key(a) >= key(b) ? 0 : NaN;
            } : function (a, b) {
                  return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : a[key] >= b[key] ? 0 : NaN;
            };
        };

        d3.descendingKey = function(key) {
            return typeof key == 'function' ? function (a, b) {
                return key(b) < key(a) ? -1 : key(b) > key(a) ? 1 : key(b) >= key(a) ? 0 : NaN;
            } : function (a, b) {
                return b[key] < a[key] ? -1 : b[key] > a[key] ? 1 : b[key] >= a[key] ? 0 : NaN;
            };
        };
        
        d3.f = function(){
            var functions = arguments;
            //convert all string arguments into field accessors
            var i = 0, l = functions.length;
            while (i < l) {
                if (typeof(functions[i]) === 'string' || typeof(functions[i]) === 'number'){
                    functions[i] = (function(str){ return function(d){ return d[str] }; })(functions[i])
                }
                i++;
            }
             //return composition of functions
            return function(d) {
                var i=0, l = functions.length;
                while (i++ < l) d = functions[i-1].call(this, d);
                return d;
            };
        };
        // store d3.f as convenient unicode character function (alt-f on macs)
        if (!window.hasOwnProperty('ƒ')) window.ƒ = d3.f;
    }

    if (typeof d3 === 'object' && d3.version) jetpack(d3);
    else if (typeof define === 'function' && define.amd) {
        define(['d3'], jetpack);
    }

})();
