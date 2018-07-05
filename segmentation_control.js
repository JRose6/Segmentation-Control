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
        customcontrol.innerHTML = "<button id='btn-open-segment-control' class='btn-open-close'><img src='2000px-Map_marker_font_awesome.png'/></button>";
        customcontrolcontent = L.DomUtil.create('div', 'leaflet-segment-trajectory-control-custom-container');
        customcontrolcontent.innerHTML = "<b>Segmentation Control</b>";
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
                console.log(c);
                var latlng = e.target.getLatLng();
                for (var i=0;i<c.length;i++){
                    var dist = Math.abs(Math.sqrt(Math.pow(c[i].lat,2)+Math.pow(c[i].lng,2))-Math.sqrt(Math.pow(latlng.lat,2)+Math.pow(latlng.lng,2)));
                    if (dist<mindist || i==0){
                        minindex = i;
                        mindist = dist;
                        console.log("Min Index:"+ i);
                        console.log(mindist);
                    }
                }
                console.log(c[minindex]);
                e.target.setLatLng({'lon':c[minindex].lng,'lat':c[minindex].lat});
            }
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