var crapplets = function(sel) {

  var alerts = ["1.jpg", "14.png", "19.jpeg", "23.jpg", "28.jpg", "32.jpg", "37.jpg", "41.png", "7.png",
   "10.gif", "15.jpg", "2.png", "24.png", "29.jpg", "33.png", "38.png", "42.png", "8.jpg  11.png",
   "16.jpg", "20.jpg", "25.png", "3.png", "34.png", "39.png", "43.png", "9.png", "12.jpeg", "17.png",
   "21.png", "26.png", "30.png", "35.png", "4.png", "5.jpg", "13.png", "18.png", "22.JPG", "27.PNG",
   "31.jpg", "36.PNG", "40.png", "6.jpg"];

  var alertIntervals = [];
  var container;

  sel.on("click", function() {
    container = sel.append("div").classed("crapplets", true);
    addAlert();
    alertIntervals.push(setInterval(addAlert, 2000));

    function addAlert() {
      container.append("img").attr("src", "modules/crapplets/img/alerts/" + _.sample(alerts))
        .style("left", window.innerWidth * Math.random() + "px")
        .style("top", window.innerHeight * Math.random() + "px");
    }
  })

  sel.on("dblclick", function() {
    sel.selectAll(".crapplets").remove();
    alertIntervals.forEach(function(value, index) {
      clearInterval(value);
    });
  });

}

crapplets(d3.select('[data-module="crapplets"]'));
