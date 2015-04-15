function ASTtoHTML(node) {
    console.log("made it to ASTtoHTML", node);
	var glue = "<table>";
    for (var key in node) {
	if (node.hasOwnProperty(key)) {
	    glue += "\n\t<tr>\n\t\t<td>"  + key + "</td>\n\t\t<td>" + node[key] +  '</td></tr>';
	}
	}
	glue += '</table>';
	return "\n\n<div class=\"node " + node.type + '">'
	    + glue
	    +  (function() {
		var appender = [];
		for (var key in node) {
		    if (node.hasOwnProperty(key)) {
			var child = node[key];
			if (typeof child === 'object' && child !== null) {
			    if (Array.isArray(child)) {
				child.forEach(function(node) {
				    appender.push(ASTtoHTML(node));
				});
			    } else {
				appender.push(ASTtoHTML(child));
			    }
			}
		    }
		}
		return appender;
	    })()
	    + '</div>';
}

function addHTML(node) {
    $('#ast').html(ASTtoHTML(node));
}
