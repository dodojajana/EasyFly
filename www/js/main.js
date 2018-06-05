var zahtjev, zahtjev2,zahtjev3, zahtjev4,zahtjev5, mj_from, mj_to, date1, date2, price,val;
var apiKey="";
var url="";
var iata_d=""; var iata_p=""; var txt=""; var br_putnika=1;
window.onload=function(){
  document.getElementById('aplikacija').addEventListener('ondeviceready',postavi);
  postavi();
}
function postavi()
{

    document.getElementById('btn_search').addEventListener("click",trazi);
    document.getElementById('btn_polazak').addEventListener("click",dohvatiPolazak);
    document.getElementById('btn_dolazak').addEventListener("click",dohvatiDolazak);
    document.getElementById('minus').addEventListener("click",smanjiPutnika);
    document.getElementById('plus').addEventListener("click",dodajPutnika);
    document.getElementById('home').addEventListener("click",vrati);
    document.getElementById('history').addEventListener("click",povijest);
    document.getElementById('btn_lokacija').addEventListener("click",lokacija);


}
function lokacija(){
  var opcije ={enableHighAccuracy : true};
  var brojac= navigator.geolocation.getCurrentPosition(dobro, lose, opcije);
}

function dobro(rez){
    var x=String(rez.coords.longitude);
    var y= String(rez.coords.latitude);
    //alert(x);
    //alert(y);
    var url2='https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=Hmg4DMZvTLPS29AMiK9tbUtkb3eYzsXE&latitude='+y+'&longitude='+x;
    zahtjev5=new XMLHttpRequest();
    zahtjev5.open('GET', url2, true);
    zahtjev5.onreadystatechange= primiZahtjev;
    zahtjev5.send();
}
function lose(gr){
    alert("Akc ne radi:" + gr.message);
}
function primiZahtjev(){
  var arr=[]; var tekst="";
    if (zahtjev5.readyState ==4 && zahtjev5.status==200){
      console.log(zahtjev5.responseText);
      var podaci=JSON.parse(zahtjev5.responseText);
      tekst =podaci[0].city_name + " ["+podaci[0].airport+"]"
      arr.push(tekst);
      var items = document.getElementById("placeList");
      for (var i=0;i<arr.length;i++){
        var item = document.createElement("li");
        item.innerHTML = arr[i];
        items.appendChild(item);
      }
      document.getElementById("select").classList.toggle("show");
      $("#placeList li").click(function(){
        var a=$(this).html();
        iata_p=a.slice(-4,-1);
        document.getElementById('mjesto_polazak').value=a;
        document.getElementById("select").classList.remove('show');
          $("#placeList").empty();
      });
    }
  }

function dohvatiDatum1(){
  date1 = document.getElementById("datep").value;
    //document.getElementById("datump").innerHTML = x;
}
function dohvatiDatum2(){
  date2 = document.getElementById("dated").value;
    //document.getElementById("datumd").innerHTML = x;
}
function hide(){
  if($('#povratni_let').is(":checked")){
    document.getElementById("dated").classList.remove("hide");
    document.getElementById("lbldated").classList.remove("hide");
  }
  else{
    document.getElementById("dated").classList.toggle("hide");
    document.getElementById("lbldated").classList.toggle("hide");
  }

}
function err(){
    alert("Loš unos");
    return;
}
function err2(){
  $("#rezultat tr").remove();
  var items = document.getElementById("rezultat");
  var item = rezultat.insertRow(0);
  var cell1 = item.insertCell(0);
  cell1.innerHTML="nema letova";
}
function dodajPutnika(){
  var y=parseInt(document.getElementById('br_put').value) + 1;
  console.log(y);
  document.getElementById('br_put').value=y;
}
function smanjiPutnika(){
  var y=parseInt(document.getElementById('br_put').value) - 1;
  console.log(y);
  if(y<1){
    document.getElementById('br_put').value=1;
  }
  else {
    document.getElementById('br_put').value=y;
  }
}
function vrati(){
   document.getElementById("home").classList.remove("show");
   document.getElementById("history").classList.remove("show");
   document.getElementById("clear").classList.remove("show");
   document.getElementById("rez").classList.remove("show");
   document.getElementById("ostalo").classList.remove("hide");
   $('#datep').val('');
   $('#dated').val('');
   $('#mjesto_polazak').val('');
   $('#mjesto_dolazak').val('');
   $('#max_cijena').val(1000);
   $('#br_put').val(1);
   $("ul").empty();
   $("#rezultat tr").remove();
   iata_p='';
   iata_d='';
}
function dohvatiPolazak(){
  var arr=[];
  var tekst="";
  var x =document.getElementById("mjesto_polazak").value;
  var xx=x.charAt(0).toUpperCase()+ x.slice(1);
  console.log(xx);
    zahtjev=new XMLHttpRequest();
    zahtjev.addEventListener('readystatechange', function(){
      if(this.readyState == 4 && this.status == 200){
        console.log(this.responseText);
        var podaci=JSON.parse(this.responseText);
        for (var i=0; i<podaci.length;i++ )
        {
          arr.push(podaci[i].label);
        }
        var t=arr[0];
        if(t.slice(0,-6)==xx){
          arr.shift();
        }
        for(var i =0; i<arr.length;i++)
        {
          tekst+=arr[i];
        }
        var items = document.getElementById("placeList");
        for (var i=0;i<arr.length;i++){
          var item = document.createElement("li");
          item.innerHTML = arr[i];
          items.appendChild(item);
        }
        document.getElementById("select").classList.toggle("show");
        $("#placeList li").click(function(){
          var a=$(this).html();
          iata_p=a.slice(-4,-1);
          document.getElementById('mjesto_polazak').value=xx +'['+iata_p+']';
          document.getElementById("select").classList.remove('show');
            $("#placeList").empty();
        });
      }
      else if (this.readyState == 4 && this.status > 400){err();}
    }
    );
    zahtjev.open('GET',"https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey=Hmg4DMZvTLPS29AMiK9tbUtkb3eYzsXE&term="+xx,true)
    zahtjev.send();

 }
function dohvatiDolazak(){
  var arr2=[];
  var tekst="";
  var x=document.getElementById('mjesto_dolazak').value;
  var xx=x.charAt(0).toUpperCase()+ x.slice(1);
  console.log(xx);
  zahtjev2=new XMLHttpRequest();
  zahtjev2.addEventListener('readystatechange', function(){
    if(this.readyState == 4 && this.status == 200){
      console.log(this.responseText);
      var podaci=JSON.parse(this.responseText);
      for (var i=0; i<podaci.length;i++ )
      {
        arr2.push(podaci[i].label);
      }
      var t=arr2[0];
      if(t.slice(0,-6)==xx){
        arr2.shift();
      }
      for(var i =0; i<arr2.length;i++)
      {
        tekst+=arr2[i];
      }
      console.log(tekst);
      var items = document.getElementById("placeList2");
      for (var i=0;i<arr2.length;i++){
        var item = document.createElement("li");
        item.innerHTML = arr2[i];
        items.appendChild(item);
      }
      document.getElementById("select2").classList.toggle("show");
      $("#placeList2 li").click(function(){
        var b=$(this).html();
        iata_d=b.slice(-4,-1);
        document.getElementById('mjesto_dolazak').value=xx +'['+iata_d+']';
        document.getElementById("select2").classList.remove('show');
        $("#placeList2").empty();
      });
      }
    else if (this.readyState == 4 && this.status > 400){err();}}
  );
  zahtjev2.open('GET',"https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey=Hmg4DMZvTLPS29AMiK9tbUtkb3eYzsXE&term="+xx,true)
  zahtjev2.send();
}
function trazi(){

  if(iata_d=='' || iata_p=='' || datep == '')
  {
    alert('Neka polja su prazna!');
    return;
  }
else {
  document.getElementById("ostalo").classList.toggle("hide");
  document.getElementById("home").classList.toggle("show");
  document.getElementById("rez").classList.toggle("show");
  document.getElementById("history").classList.toggle("show");
    $("#rezultat tr").remove();
  if($('#povratni_let').is(":checked")){
      posaljiZahtjev();
    }
  else{
    posaljiZahtjev2();
  }}

}
function posaljiZahtjev(){
  price=document.getElementById('max_cijena').value;
  br_putnika=document.getElementById('br_put').value;
  var e = document.getElementById("valuta");
  val = e.options[e.selectedIndex].value;
  console.log(val);
  // document.getElementById("ostalo").classList.toggle("hide");
  // document.getElementById("home").classList.toggle("show");
  // document.getElementById("rez").classList.toggle("show");
  // document.getElementById("history").classList.toggle("show");
  zahtjev3 = new XMLHttpRequest();
  zahtjev3.addEventListener("readystatechange", function (){
    if (this.readyState === 4 && this.status == 200) {
      console.log(this.responseText);
      var podaci=JSON.parse(this.responseText);
      ispis2(podaci);
    }
    else if (this.readyState === 4 && this.status > 400) {
      err();
    }
    else if (this.readyState === 4 && this.status == 400) {
      err2();
    }
  });
  //zahtjev3.open('GET','https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin=lhr&destination=ory&departure_date=2018-03-05&return_date=2018-05-05&adults=1&number_of_results=10&apikey=bIsETKJNASRGpdB1SabBLmzYbvu0ABmc',true)
    zahtjev3.open('GET','https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin='+iata_p+'&destination='+ iata_d+'&departure_date='+date1+'&return_date='+date2+'&adults='+br_putnika.toString()+'&currency='+val+'&max_price='+price.toString()+'&number_of_results=10&apikey='+apiKey,true);
    zahtjev3.send();
}
function posaljiZahtjev2(){
  price=document.getElementById('max_cijena').value;
  br_putnika=document.getElementById('br_put').value;
  var e = document.getElementById("valuta");
  val = e.options[e.selectedIndex].value;
  // document.getElementById("ostalo").classList.toggle("hide");
  // document.getElementById("home").classList.toggle("show");
  // document.getElementById("rez").classList.toggle("show");
  // document.getElementById("history").classList.toggle("show");
  zahtjev4 = new XMLHttpRequest();
  zahtjev4.addEventListener("readystatechange", function (){
    if (this.readyState === 4 && this.status == 200) {
      console.log(this.responseText);
      var podaci=JSON.parse(this.responseText);
      ispis(podaci);
    }
    else if (this.readyState === 4 && this.status > 400) {
      err();
    }
    else if (this.readyState === 4 && this.status == 400) {
      err2();
    }
  });
    //zahtjev4.open('GET','https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin=ZAG&destination=LIM&departure_date=2018-06-25&currency=EUR&adults=1&number_of_results=10'+'&apikey='+apiKey,true);
    zahtjev4.open('GET','https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin='+iata_p+'&destination='+ iata_d+'&departure_date='+date1+'&adults='+br_putnika.toString()+'&currency='+val+'&max_price='+price.toString()+'&number_of_results=10'+'&apikey='+apiKey,true);
    zahtjev4.send();
}

function ispis(podaci){
  var txt="";
  var c,a,b;
  for(var i=0; i<podaci.results.length; i++)
  {
    var a=podaci.results[i].itineraries[0].outbound.flights;
    var b=podaci.results[i].fare.total_price;
    c=a[0].origin.airport+"-";
    for (var j= 1; j<(a.length ); j++){
      c +=a[j].origin.airport + "-";
    }
    c +=a[a.length - 1].destination.airport;
    var valuta=podaci.currency;
    var d=new Date(a[0].departs_at);
    var dd=d.getHours() +":"+ d.getMinutes();
    var e=new Date(a[a.length - 1].arrives_at);
    var ee=e.getHours() +":"+ e.getMinutes();
    var vr=time(a);

    var items = document.getElementById("rezultat");
    var item = rezultat.insertRow(i);
    var cell1 = item.insertCell(0);
    var cell2 = item.insertCell(1);

    if( (a.length - 1) != 0){
      cell1.innerHTML = c +'<br>' +' međuletovi ' + (a.length - 1).toString();
      cell2.innerHTML = vr +"h <br>"+' '+ b.toString()+ valuta;
    }
    else {
      cell1.innerHTML = c +'<br>' +dd +"-"+ee;
      cell2.innerHTML = vr +"h <br>"+' '+ b.toString()+ valuta;
    }
  }
  // var blob = new Blob([teekst], {type: "text/plain;charset=utf-8"});
  // saveAs(blob, "flights.txt");
  var x={"departure": a[0].origin.airport, "arrival":a[a.length - 1].destination.airport, "putnici": br_putnika, "ddate": date1,"pdate": ""};
  var xy=JSON.stringify(x);
  console.log(xy);
  var duz=localStorage.length;
  localStorage.setItem(duz,xy);
}
function ispis2(podaci){
  var txt="";var d,g; var br=0;
  for(var i=0; i<podaci.results.length; i++)
  {
    var a=podaci.results[i].itineraries[0].outbound.flights;
    var b=podaci.results[i].itineraries[0].inbound.flights;
    //console.log(b);
    var c=podaci.results[i].fare.total_price;
    var vr=time(a);
    var vr2=time(b);
    d=a[0].origin.airport+"-";
    for (var j= 1; j<(a.length); j++){
        d +=a[j].origin.airport + "-";
      }
      d +=a[a.length - 1].destination.airport;
      g=b[0].origin.airport+"-";
      for (var j= 1; j<(b.length); j++){
          g +=b[j].origin.airport + "-";
        }
        g +=b[b.length - 1].destination.airport;
    var valuta=podaci.currency;
    var f=new Date(a[0].departs_at);
    var ff=f.getHours() +":"+ f.getMinutes();
    var e=new Date(a[a.length - 1].arrives_at);
    var ee=e.getHours() +":"+ e.getMinutes();
    var h=new Date(b[0].departs_at);
    var hh=h.getHours() +":"+ h.getMinutes();
    var k=new Date(b[b.length - 1].arrives_at);
    var kk=k.getHours() +":"+ k.getMinutes();

    var items = document.getElementById("rezultat");
    var item = rezultat.insertRow(i);
    var cell1 = item.insertCell(0);
    var cell2 = item.insertCell(1);


    if( (a.length - 1) != 0){
      cell1.innerHTML = d +'<br>' +'međuletovi' + (a.length - 1).toString()+'<br>';
      cell2.innerHTML = vr +"h <br>"+ ' '+c.toString()+ valuta+'<br>';
    }
    else if((a.length - 1) == 0) {
      cell1.innerHTML = d +'<br>' +ff +"-"+ee+'<br>';
      cell2.innerHTML = vr +"h <br> "+ ' '+c.toString()+ valuta+'<br>';
    }
    if((b.length - 1) == 0) {
      cell1.innerHTML += g +'<br>' +hh +"-"+kk;
      cell2.innerHTML += vr2 +"h <br> "+ ' '+c.toString()+ valuta;
    }
    else if((b.length - 1) != 0) {
      cell1.innerHTML += g +'<br>' +'međuletovi' + (b.length - 1).toString();
      cell2.innerHTML += vr2 +"h <br> "+' '+ c.toString()+ valuta;
    }
  }
  var x={"departure": a[0].origin.airport, "arrival":a[a.length - 1].destination.airport, "putnici": br_putnika, "ddate": date1, "pdate": date2};
  var xy=JSON.stringify(x);
  localStorage.setItem(localStorage.length,xy)
  var xz=JSON.parse(localStorage.getItem(localStorage.length - 1));
   console.log(xz);
  // var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
  // saveAs(blob, "flights.txt");
  //document.getElementById('rez').innerHTML=txt;
}
function time(a){
  var pol=new Date(a[0].departs_at);
  var dol=new Date(a[a.length - 1].arrives_at);
  var interval=dol.getTime() - pol.getTime();
  var h=Math.floor(interval/(1000*60*60));
  interval=interval -(h*1000*60*60);
  var m=Math.floor(interval/(1000*60));
  var v=h + ":"+m;
  return v;
}
function time2(a,b){
  var pol=new Date(a);
  var dol=new Date(b);
  var interval=dol.getTime() - pol.getTime();
  var h=Math.floor(interval/(1000*60*60));
  interval=interval -(h*1000*60*60);
  var m=Math.floor(interval/(1000*60));
  var v=h + ":"+m;
  return v;
}
function ocisti()
{ localStorage.clear();
  $("#rezultat tr").remove();
  var items = document.getElementById("rezultat");
  var item = rezultat.insertRow(0);
  var cell1 = item.insertCell(0);
  cell1.innerHTML="Successfully deleted.";
}

function povijest(){
  $("#rezultat tr").remove();
  document.getElementById("clear").classList.toggle("show");
  document.getElementById("history").classList.remove("show");
  if(localStorage != null){
  for(var i =0; i<localStorage.length ; i++){
    var y=localStorage.getItem(localStorage.key(i));
    var x=JSON.parse(y);
    console.log(x);
    var items = document.getElementById("rezultat");
    var item = rezultat.insertRow(i);
    var cell1 = item.insertCell(0);
    var cell2 = item.insertCell(1);

    if(x.pdate != ""){
      cell1.innerHTML = x.departure + " -"+x.arrival;
      cell2.innerHTML = x.ddate + "-"+x.pdate;
    }
    else {
      cell1.innerHTML = x.departure + " -"+x.arrival;
      cell2.innerHTML = x.ddate;
    }
  }}
  else{
    var items = document.getElementById("rezultat");
    var item = rezultat.insertRow(i);
    var cell1 = item.insertCell(0);
    cell1.innerHTML="No search history."
  }

}
