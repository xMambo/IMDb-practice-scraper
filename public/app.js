// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'scrapedData' (JSON) and creates a table body
function displayResults(scrapedData) {
    // First, empty the table
    $("tbody").empty();
  
    // Then, for each entry of that json...
    scrapedData.forEach(function(movie) {
      // Append each of the movie's properties to the table
      var tr = $("<tr>").append(
        $("<td>").text(movie.title),
        $("<td>").text(movie.link),
      );
  
      $("tbody").append(tr);
    });
  }
  
  // Bonus function to change "active" header
  function setActive(selector) {
    // remove and apply 'active' class to distinguish which column we sorted by
    $("th").removeClass("active");
    $(selector).addClass("active");
  }
  
  // 1: On Load
  // ==========
  
  // First thing: ask the back end for json with all scrapedData
  $.getJSON("/all", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });
  
  // 2: Button Interactions
  // ======================
  

  
  // When user clicks the name sort button, display the table sorted by name
  $("#name-sort").on("click", function() {
    // Set new column as currently-sorted (active)
    setActive("#movie-title");
  
    // Do an api call to the back end for json with all scrapedData sorted by name
    $.getJSON("/name", function(data) {
      // Call our function to generate a table body
      displayResults(data);
    });
  });
  