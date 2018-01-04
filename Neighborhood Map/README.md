## Udacity Neighborhood Map Project

Getting started:
* Clone the repository and launch an HTTP server. This can be achieved by:

* NPM package http server (npm install-i http-server)
* Invoke [http-server] form the project

#### A Neighborhood map of places I've worked and lived:
* All application components render on scree in a responsive manner
* All application components are usable across modern desktop, tablet, and phone browsers
* Includes a text input field or dropdown menu that filters the map markers and list items to locations matching the text input or selection. Filter function runs error-free.
* Clicking a location on the list displays unique information about the location, and animates its associated map marker
* List functionality is responsive and runs error free
* Map displays all location markers by default, and displays the filtered subset of location markers when a filter is applied
* Clicking a marker displays unique information about a location in either an infoWindow or DOM element
* Markers should animate when clicked (mine change colors)
* Code is properly separated based upon Knockout best practices (follow an MVVM pattern, avoid updating the DOM manually with jQuery or JS, use observables rather than forcing refreshes manually, etc). Knockout should not be used to handle the Google Map API
* 5 locations in the model hard coded
* Application utilizes the Google Maps API and at least one non-Google third-party API
* All data requests are retrieved in an asynchronous manner
* Error Handling
Data requests that fail are handled gracefully using common fallback techniques (i.e. AJAX error or fail methods). 'Gracefully' means the user isn’t left wondering why a component isn’t working. If an API doesn’t load there should be some visible indication on the page (an alert box is ok) that it didn’t load



### References used:
* https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js used for animated sidebar
* Google maps API
* https://code.jquery.com/jquery-1.12.0.min.js
* Bootstrap https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
* Lesson 17 was a great help in completing this project
* Udacity discussion forums' for help and feedback
* Mentor (Sarah) help on certain format and issue identification
