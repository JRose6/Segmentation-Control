L.Control.SegmentationControl = L.Control.extend({
    
    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-segment-trajectory-control-custom');
        L.DomEvent.addListener(controlDiv, 'click', L.DomEvent.stopPropagation);
        this._controlDiv = controlDiv;
        return controlDiv;
    },

    initializeComponents: function(){   
        
        console.log(this.Marker_Group);
        var customcontrol = document.getElementsByClassName('leaflet-segment-trajectory-control-custom')[0];
        customcontrol.innerHTML = "<button id='btn-open-segment-control' class='btn-open-close'><img src='Segmentation-Control/map_marker_font_awesome.png'/></button>";
        customcontrolcontent = L.DomUtil.create('div', 'leaflet-segment-trajectory-control-custom-container');
        customcontrolcontent.innerHTML = '<button id="btn-close-play-container" type="button" class="close-map-container" aria-label="Close"><span aria-hidden="true">×</span></button><br><b>Segmentation Control</b>';
        console.log(customcontrol);
        var table = document.createElement('table');
        console.log(this.labels);
        this.labels.forEach(label => {   
            var tr = document.createElement('tr');
            var addtd = document.createElement('td');
            addtd.innerHTML = "<button value="+label+" class='btn-add'>+</button>";
            var labeltd = document.createElement('td');
            labeltd.innerHTML = label;
            var colorpickertd = document.createElement('td');
            colorpickertd.innerHTML = '<input type="color" class="leaflet-custom-color" value="#c807c0">';
            tr.appendChild(addtd);
            tr.appendChild(labeltd);
            tr.appendChild(colorpickertd);
            table.appendChild(tr);
            this.Marker_Groups[label] = L.layerGroup().addTo(map);
        });
        customcontrolcontent.appendChild(table);
        customcontrolcontent.style.display = "none";
        customcontrol.appendChild(customcontrolcontent);
        var control = this;
        function bindMarker(e){
            console.log("Bind event fired");
            if(control.Bind_Markers && control.Trajectory_Layer != null){
                var minindex=0, mindist=0;
                var c = control.Trajectory_Layer.getLayers()[0].getLatLngs();  
                var latlng = e.target.getLatLng();
                console.log(c);
                console.log(latlng);
                for (var i=0;i<c.length;i++){
                    var dist = Math.abs(calculateDistance(c[i].lat,c[i].lng,latlng.lat,latlng.lng));
                    console.log(dist);
                    if (dist<mindist || i==0){
                        minindex = i;
                        mindist = dist;
                    }
                }
                console.log(c[minindex]);
                e.target.setLatLng({'lon':c[minindex].lng,'lat':c[minindex].lat});
            }
        }
        function calculateDistance(lat1,lng1,lat2,lng2){
            var lat1 = toRadian(lat1);
            var lat2 = toRadian(lat2);
            var lng1 = toRadian(lng1);
            var lng2 = toRadian(lng2);
            var dlat = lat2-lat1;
            var dlng = lng2-lng1;
            var a = Math.pow(Math.sin(dlat/2),2)+Math.cos(lat1)*Math.cos(lat2)*Math.pow(Math.sin(dlng/2),2);
            var c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
            const EARTH_RADIUS = 9793000;
            return c * EARTH_RADIUS ;
        }
        function toRadian(d) {
            return d*Math.PI/180;
        }
        function addMarker(e){
            console.log(e);
            var colour = this.parentNode.parentNode.childNodes[2].childNodes[0].value;
            var label = this.parentNode.parentNode.childNodes[1].innerHTML;
            console.log(label);
            console.log(colour);7
            colour = colour.substr(1,colour.length);
            
           var marker = L.marker(map.getCenter(),{
                draggable:true
            });
            control.Marker_Groups[label].addLayer(marker);
            marker.on('dragend',bindMarker);
        }
        function changeColour(e){
            var label = this.parentNode.parentNode.childNodes[1].innerHTML;
            var colour = this.value;
            var label = this.parentNode.parentNode.childNodes[1].innerHTML;
            console.log(control.Marker_Groups[label]);
            control.Marker_Groups[label].getLayers().forEach(marker => {
                marker.setIcon(icon);    
            });
        }
        var btnadd = document.getElementsByClassName("btn-add");   
        var colorpickers = document.getElementsByClassName("leaflet-custom-color");
        for(var i=0;i < colorpickers.length;i++){
            colorpickers[i].addEventListener('change',changeColour,false);
        }     
        for (var i = 0; i < btnadd.length; i++) {
            btnadd[i].addEventListener('click', addMarker, false);
        }
        var btnopen = document.getElementById("btn-open-segment-control");
        btnopen.addEventListener('click',this.show,false);

    },
    show: function(){
        var container = document.getElementsByClassName("leaflet-segment-trajectory-control-custom-container")[0];
        container.style.display = 'block';
        var btnopen = document.getElementById("btn-open-segment-control");
        btnopen.style.display = 'none';
    },
    hide: function(){
        var container = document.getElementsByClassName("leaflet-segment-trajectory-control-custom-container")[0];
        container.style.display = 'none';
        var btnopen = document.getElementById("btn-open-segment-control");
        btnopen.style.display = 'block';
    },
    labels: [],
    Marker_Groups:{},
    Bind_Markers:true,
    Trajectory_Layer:null
});

L.control.SegmentationControl = function(options) {
    Bind_Markers = true;
    Trajectory_Layer = null;
    if (options["bind"]==false){
        Bind_Markers=false;
    }
    return new L.Control.SegmentationControl(options);
};