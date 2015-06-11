function squares(count) {
    var x = [];
    for (var i=1;i<count+1;i++) {
	x.push(i*i);
    }
    console.log(x.join(" "));
}
squares(10);
