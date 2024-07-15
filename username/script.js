var XMLHTTP = new XMLHttpRequest();
const ckr = document.getElementById('checker');
const iconyes = document.getElementById("check");
const iconno = document.getElementById("cancel");
const divc = document.getElementById("divchecker");
const select = document.getElementById("characters");

async function getData() {
    const char = document.getElementById('char').innerHTML;
    const url = "https://youtube.googleapis.com/youtube/v3/channels?part=id&forHandle=%40"+char+"&maxResults=1&key=AIzaSyBFEdIwNNsZ8GfX4PlIWxy06ObULpzwDgs";

    XMLHTTP.onreadystatechange = function(){
        if(this.status == 200){
            var output = this.responseText;
            output = JSON.parse(output);
            var check = output.pageInfo.totalResults;
            try {
                var url = output.items[0].id;
            }catch{
                var url = null;
            }
            if (check == 0){
                divc.style.display = "flex";
                iconyes.style.display = "block";
                iconno.style.display = "none";
                divc.style.background = "#06be15";
                ckr.innerHTML = 'This handle is available!'
            }else{
                divc.style.display = "flex";
                iconno.style.display = "block";
                iconyes.style.display = "none";
                divc.style.background = "#cc0512";
                ckr.innerHTML = 'This handle has <a href="'+'https://www.youtube.com/channel/'+url+'">already been taken!</a>'
            }
        }
    }
    
    XMLHTTP.open("GET" ,url, true);
    XMLHTTP.send()
}

function copy() {
    navigator.clipboard.writeText(char.innerHTML);
    alert("Copied to clipboard!")
}
