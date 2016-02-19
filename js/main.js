

document.addEventListener('DOMContentLoaded', function(){

        
	var target = {"name": "Place Verneuil", "latitude" : 43.3093416, "longitude" : 5.3662773};
    //var target = {"name": "Ajaccio", "latitude" : 41.9227052, "longitude" : 8.6358011};


    
    //DOM elements
	var status = document.querySelector("#status");
	var infos  = document.querySelector("#infos");
    var fauxBorderUp = document.querySelector("#fauxBorderUp");
    var fauxBorderDown = document.querySelector("#fauxBorderDown");
    var fauxBorderLeft = document.querySelector("#fauxBorderLeft");
    var fauxBorderRight = document.querySelector("#fauxBorderRight");
    

	//map 
	var map = L.map('myMap');
	map.setView([0, 0], 3);

	//pattern
	var mapPatternUrl = 'http://tile.openstreetmap.org/{z}/{x}/{y}.png';
	var tileLayer = L.tileLayer(mapPatternUrl);
	tileLayer.addTo(map);

	//target marker 
	var targetMarker = L.marker([target.latitude, target.longitude]);
	targetMarker.bindPopup(target.name);
	targetMarker.addTo(map);

	//marker
	var marker = L.marker([0, 0]);
	marker.bindPopup("Me.");
	marker.addTo(map);
    
    //saving marker coords for later
    var myMarkerLat = 0.0;
    var myMarkerLong = 0.0;
    
    //other
    var currentGlitchLevel = "clearZone";

    
    //compass
    if (window.DeviceOrientationEvent) {
        console.log("DeviceOrientation is supported");
        
        window.addEventListener('deviceorientation', function(eventData){
            var myDir = 0.0;
            
            if(eventData.webkitCompassHeading) {
                myDir = eventData.webkitCompassHeading;
                document.getElementById("arrowNorth").style.transform = "rotate(-"+myDir+"deg)";
                
            } else {
                myDir = eventData.alpha;
                document.getElementById("arrowNorth").style.transform = "rotate("+myDir+"deg)";
                //pas certain que ça marche sur le navigateur android par défaut mais en même temps c'est pas comme si j'avais les moyens de tester ça facilement...
            }
            pointToTarget(myDir);
        }, false);
    } else {
        document.getElementById("boussole").innerHTML = "On saura jamais vu que c'est pas supporté par ton navigateur...";
    }
    
    
	function processPosition(event){
		status.innerHTML = "Lat : " + event.coords.latitude + "° Long : " + event.coords.longitude + "° Precision : " + event.coords.accuracy + "m.";
		var coords = [event.coords.latitude, event.coords.longitude] ;

		marker.setLatLng( coords );

		if ( ! map.getBounds().contains( coords ) ) {
			map.panTo(coords);
		}

		var distanceTarget = geoDistance(target.latitude, target.longitude, event.coords.latitude, event.coords.longitude);
		distanceTarget = round(distanceTarget);

		infos.innerHTML = "Distance from " + target.name + " : " + distanceTarget + "km.";
        
        myMarkerLat = event.coords.latitude;
        myMarkerLong = event.coords.longitude;
        
        testDistance(distanceTarget);
        
        testZone.className = currentGlitchLevel;
        
        //console.log(distanceTarget);
        
	}

	function errorPosition(){
		status.innerHTML = "No position.";
		marker.setLatLng( [0,0] );
		map.setView([0, 0], 3);
	}

	//location notifications
	var options = {"enableHighAccuracy": true, "maximumAge" : 0, "timeout" : Infinity};
	navigator.geolocation.watchPosition( processPosition, errorPosition, options );

    
    
    /*Debug & testing*/
    var debugButton = document.getElementById("debugButton");
    var debugMenuOpen = false;
    debugButton.onclick = function() {
        if (debugMenuOpen == false){
            document.getElementById("debug").className = "debug";
            debugMenuOpen = true;
            map.setZoom(10);
        } else {
            document.getElementById("debug").className = "debugHidden";  
            debugMenuOpen = false;
            map.setZoom(3);
        }
    };
    
    //move new target & test
    var moveButton = document.getElementById("moveZone");
    
    moveButton.onclick = function(){moveZone();};
    
    function moveZone() {
        var wormholeLat = myMarkerLat - 0.005;
        var wormholeLong = myMarkerLong - 0.005;
        console.log("move clicked");
        
        window.wormhole = {"name": "Wormhole", "latitude" : wormholeLat, "longitude" : wormholeLong}; 
        window.wormholeMarker = L.marker([wormhole.latitude, wormhole.longitude]);
	    wormholeMarker.bindPopup(wormhole.name);
        wormholeMarker.addTo(map);
        
        window.moveWormhole = window.setInterval(startMoving, 50);
        
        console.log("end moveZone");
        
    }
    
    var testClear = 0;
    
    
    
    var testZone = document.getElementById("testZone");
    
    
    function startMoving() {
        
        wormhole.latitude += 0.00005;
        wormhole.longitude += 0.00005;
        
        var lat = (wormhole.latitude);
        var lng = (wormhole.longitude);
        var newLatLng = new L.LatLng(lat, lng);
        wormholeMarker.setLatLng(newLatLng); 
        testClear++;
        
        var distanceWormhole = geoDistance(wormhole.latitude, wormhole.longitude, myMarkerLat, myMarkerLong);
		distanceWormhole = round(distanceWormhole);
        
        testDistance(distanceWormhole);
        testZone.className = currentGlitchLevel;

        
        
        if(testClear>200){
            stopMoving();
            testClear = 0;
        }
    }
    
    function stopMoving() {
        window.clearInterval(moveWormhole);
    }
    
    function testDistance(ref) {
            switch (true) {
                case (ref>0.6):
                    currentGlitchLevel ="glitched0";
                    testZone.innerHTML = "Find the source of the interference."
                    break;
                case (ref<0.6 && ref>0.5):
                    currentGlitchLevel = "glitched1";
                    testZone.innerHTML = "Looks like you're on the right track."
                    break;
                case (ref<0.5 && ref>0.4):
                    currentGlitchLevel = "glitched2";
                    testZone.innerHTML = "You're getting closer (except if you went back...)"
                    break;
                case (ref<0.4 && ref>0.3):
                    currentGlitchLevel = "glitched3";
                    testZone.innerHTML = "I think you figured it out."
                    break;
                case (ref<0.3 && ref>0.2):
                    currentGlitchLevel = "glitched4";
                    testZone.innerHTML = "It's big, I can feel it in my circuits."
                    break;
                case (ref<0.2):
                    currentGlitchLevel = "glitched5";
                    testZone.innerHTML = "You found it! aaaand now you're dead... game over."
                    break;
                default:
                    currentGlitchLevel = "clearZone";  
                    testZone.innerHTML = "Find the source of the interference... but seriously if you see this it's unlikely you ever will... and it's probably my fault..."
            }
            
    }
    
    function pointToTarget(x) {
        if (x==null) {
            x = 0.0;
            //console.log("impossible de récupérer les infos de la boussole, on présume qu'elle pointe vers le nord pour les tests");
        }
        
        //j'arrondis les valeurs pour avoir la possibilité d'avoir des valeurs égales
                    
        var tLat = Math.floor(target.latitude*1000);
        var tLong = Math.floor(target.longitude*1000);
        var mLat = Math.floor(myMarkerLat*1000);
        var mLong = Math.floor(myMarkerLong*1000);
        
        var rotateArrow;
        
        if (tLat>mLat){
            if(tLong>mLong){
                document.getElementById("boussole").innerHTML = "Northeast";
                rotateArrow = x - 45;

                
            } else if(tLong<mLong) {
                document.getElementById("boussole").innerHTML = "Northwest";
                rotateArrow = x - 315;
                //console.log("x "+x+"rotate arrow "+rotateArrow);

            } else {
                document.getElementById("boussole").innerHTML = "North";
                rotateArrow = x;

            }
        }  else if(tLat<mLat){
            if(tLong>mLong){
                document.getElementById("boussole").innerHTML = "Southeast";
                rotateArrow = x - 135;

            } else if(tLong<mLong){
                document.getElementById("boussole").innerHTML = "Southwest";
                rotateArrow = x - 225;

            } else {
                document.getElementById("boussole").innerHTML = "South";
                rotateArrow = x - 180;
            }
        } else {
            if(tLong>mLong){
                document.getElementById("boussole").innerHTML = "East";
            } else if (tLong<mLong){
                document.getElementById("boussole").innerHTML = "West";
            } else {
                document.getElementById("boussole").innerHTML = "You're already there dummy";

            }
            
        }
        
        if (rotateArrow<0){
            rotateArrow += 360;
        }
        
        //maths got nothing on my brute force game... I... had to guess all the values... (or it wouldn't point the right way... :/ )
        switch(true){       
            case (rotateArrow>330 || rotateArrow<30):
                fauxBorderUp.className=currentGlitchLevel;
                fauxBorderLeft.className="clearZone";
                fauxBorderDown.className="clearZone";
                fauxBorderRight.className="clearZone";
                break;
            case (rotateArrow>30 && rotateArrow<60):
                fauxBorderUp.className=currentGlitchLevel;
                fauxBorderLeft.className=currentGlitchLevel;
                fauxBorderDown.className="clearZone";
                fauxBorderRight.className="clearZone";
                break;
            case (rotateArrow>60 && rotateArrow<120):
                fauxBorderUp.className="clearZone";
                fauxBorderLeft.className=currentGlitchLevel;
                fauxBorderDown.className="clearZone";
                fauxBorderRight.className="clearZone";
                break;
            case (rotateArrow>120 && rotateArrow<150):
                fauxBorderUp.className="clearZone";
                fauxBorderLeft.className=currentGlitchLevel;
                fauxBorderDown.className=currentGlitchLevel;
                fauxBorderRight.className="clearZone";
                break;
            case (rotateArrow>150 && rotateArrow<210):
                fauxBorderUp.className="clearZone";
                fauxBorderLeft.className="clearZone";
                fauxBorderDown.className=currentGlitchLevel;
                fauxBorderRight.className="clearZone";
                break;
            case (rotateArrow>210 && rotateArrow<240):
                fauxBorderUp.className="clearZone";
                fauxBorderLeft.className="clearZone";
                fauxBorderDown.className=currentGlitchLevel;
                fauxBorderRight.className=currentGlitchLevel;
                break;
            case (rotateArrow>240 && rotateArrow<300):
                fauxBorderUp.className="clearZone";
                fauxBorderLeft.className="clearZone";
                fauxBorderDown.className="clearZone";
                fauxBorderRight.className=currentGlitchLevel;
                break;
            case (rotateArrow>300 && rotateArrow<330):
                fauxBorderUp.className=currentGlitchLevel;
                fauxBorderLeft.className="clearZone";
                fauxBorderDown.className="clearZone";
                fauxBorderRight.className=currentGlitchLevel;
                break;
            default:
                fauxBorderUp.className="clearZone";
                fauxBorderLeft.className="clearZone";
                fauxBorderDown.className="clearZone";
                fauxBorderRight.className="clearZone";
        }
        document.getElementById("arrowTarget").style.transform = "rotate(-"+rotateArrow+"deg)";
        
        //alors autant la première flèche tournait dans le sens inverse dans edge inspect autant ici on dirait que ça roule sans faire de cas particulier en l'absence de compassHeading... faudrait tester sur un android mais j'en ai pas sous la main...
        
    }
    
});