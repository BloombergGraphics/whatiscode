var crapplets = function(sel) {

  var alerts = ["1.jpg", "13.png", "17.png", "20.jpg", "24.png", "28.jpg", "31.jpg", "35.png", "4.png", "8.jpg",
    "10.gif", "14.png", "18.png", "21.png", "25.png", "29.jpg", "32.jpg", "36.PNG", "5.jpg", "9.png",
    "11.png", "15.jpg", "19.jpeg", "22.JPG", "26.png", "3.png", "33.png", "37.jpg", "6.jpg",
    "12.jpeg", "16.jpg", "2.png", "23.jpg", "27.PNG", "30.png", "34.png", "38.png", "7.png"];

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
